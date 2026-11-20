/**
 * @fileoverview Rule to enforce requiring named capture groups in regular expression.
 * @author Pig Fang <https://github.com/g-plane>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const {
	CALL,
	CONSTRUCT,
	ReferenceTracker,
	getStaticValue,
	getStringIfConstant,
} = require("@eslint-community/eslint-utils");
const regexpp = require("@eslint-community/regexpp");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/** @import { SuggestedEdit } from "@eslint/core"; */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const parser = new regexpp.RegExpParser();

/**
 * Creates fixer suggestions for the regex, if statically determinable.
 * @param {number} groupStart Starting index of the regex group.
 * @param {string} pattern The regular expression pattern to be checked.
 * @param {string} rawText Source text of the regexNode.
 * @param {ASTNode} regexNode AST node which contains the regular expression.
 * @param {Object} options Information about the whole regular expression.
 * @param {boolean} options.canBeNamed Whether a name can be added to the group without breaking `\k` identity escapes.
 * @param {boolean} options.canBeNonCapturing Whether the group can be converted to a non-capturing group without breaking numeric backreferences.
 * @param {Set<string>} options.groupNames Names of the existing capture groups.
 * @returns {Array<SuggestedEdit>} Fixer suggestions for the regex, if statically determinable.
 */
function suggestIfPossible(
	groupStart,
	pattern,
	rawText,
	regexNode,
	{ canBeNamed, canBeNonCapturing, groupNames },
) {
	switch (regexNode.type) {
		case "Literal":
			if (typeof regexNode.value === "string" && rawText.includes("\\")) {
				return null;
			}
			break;
		case "TemplateLiteral":
			if (
				regexNode.expressions.length ||
				rawText.slice(1, -1) !== pattern
			) {
				return null;
			}
			break;
		default:
			return null;
	}

	const start = regexNode.range[0] + groupStart + 2;

	return [
		{
			fix(fixer) {
				if (!canBeNamed) {
					return null;
				}

				const existingTemps = pattern.match(/temp\d+/gu) || [];
				let tempCount =
					existingTemps.reduce(
						(previous, next) =>
							Math.max(
								previous,
								Number(next.slice("temp".length)),
							),
						0,
					) + 1;

				// names written with escapes (e.g. `(?<\u0074emp1>a)`) aren't found in the raw pattern
				while (groupNames.has(`temp${tempCount}`)) {
					tempCount++;
				}

				return fixer.insertTextBeforeRange(
					[start, start],
					`?<temp${tempCount}>`,
				);
			},
			messageId: "addGroupName",
		},
		{
			fix(fixer) {
				return canBeNonCapturing
					? fixer.insertTextBeforeRange([start, start], "?:")
					: null;
			},
			messageId: "addNonCapture",
		},
	];
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description:
				"Enforce using named capture group in regular expression",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/prefer-named-capture-group",
		},

		hasSuggestions: true,

		schema: [],

		messages: {
			addGroupName: "Add name to capture group.",
			addNonCapture: "Convert group to non-capturing.",
			required:
				"Capture group '{{group}}' should be converted to a named or non-capturing group.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const regexLiteralValues = new WeakSet();

		/**
		 * Function to check regular expression.
		 * @param {string} pattern The regular expression pattern to be checked.
		 * @param {ASTNode} node AST node which contains the regular expression or a call/new expression.
		 * @param {ASTNode} regexNode AST node which contains the regular expression.
		 * @param {string|null} flags The regular expression flags to be checked.
		 * @returns {void}
		 */
		function checkRegex(pattern, node, regexNode, flags) {
			let ast;

			try {
				ast = parser.parsePattern(pattern, 0, pattern.length, {
					unicode: Boolean(flags && flags.includes("u")),
					unicodeSets: Boolean(flags && flags.includes("v")),
				});
			} catch {
				// ignore regex syntax errors
				return;
			}

			const capturingGroups = [];
			const groupNames = new Set();
			let maxNumericBackreference = 0;
			let hasIdentityEscapeK = false;

			regexpp.visitRegExpAST(ast, {
				onCapturingGroupEnter(group) {
					capturingGroups.push(group);

					if (group.name) {
						groupNames.add(group.name);
					}
				},
				onCharacterEnter(character) {
					if (character.raw === "\\k") {
						hasIdentityEscapeK = true;
					}
				},
				onBackreferenceEnter(backreference) {
					if (typeof backreference.ref === "number") {
						maxNumericBackreference = Math.max(
							maxNumericBackreference,
							backreference.ref,
						);
					}
				},
			});

			capturingGroups.forEach((group, index) => {
				if (!group.name) {
					const rawText = sourceCode.getText(regexNode);
					const suggest = suggestIfPossible(
						group.start,
						pattern,
						rawText,
						regexNode,
						{
							/*
							 * Without `u`/`v` flags and named groups, `\k` is an identity escape (Annex B).
							 * Adding the first named group makes it an invalid named reference.
							 */
							canBeNamed:
								groupNames.size > 0 || !hasIdentityEscapeK,

							/*
							 * Converting a group to non-capturing renumbers all groups after it,
							 * so it's unsafe if this group or any later group is referenced by number (e.g. `\1`).
							 */
							canBeNonCapturing:
								index + 1 > maxNumericBackreference,
							groupNames,
						},
					);

					context.report({
						node,
						messageId: "required",
						data: {
							group: group.raw,
						},
						suggest,
					});
				}
			});
		}

		return {
			Literal(node) {
				if (node.regex) {
					if (node.value) {
						regexLiteralValues.add(node.value);
					}

					checkRegex(
						node.regex.pattern,
						node,
						node,
						node.regex.flags,
					);
				}
			},
			"Program:exit"(node) {
				const scope = sourceCode.getScope(node);
				const tracker = new ReferenceTracker(scope);
				const traceMap = {
					RegExp: {
						[CALL]: true,
						[CONSTRUCT]: true,
					},
				};

				for (const { node: refNode } of tracker.iterateGlobalReferences(
					traceMap,
				)) {
					const [regexArgument, flagsArgument] = refNode.arguments;

					// regex literals like `new RegExp(/(a)/)` are already checked by the `Literal` handler
					if (regexArgument?.regex) {
						continue;
					}

					const regexValue = getStaticValue(regexArgument)?.value;

					if (regexValue instanceof RegExp) {
						// values of regex literals like in `new RegExp((0, /(a)/))` are already checked by the `Literal` handler
						if (regexLiteralValues.has(regexValue)) {
							continue;
						}

						const flagsValue = flagsArgument
							? getStaticValue(flagsArgument)
							: { value: void 0 };
						let flags = null;

						if (flagsValue) {
							// if flags are `undefined`, the new regex inherits the flags of the given one
							flags =
								flagsValue.value === void 0
									? regexValue.flags
									: String(flagsValue.value);
						}

						checkRegex(
							regexValue.source,
							refNode,
							regexArgument,
							flags,
						);
						continue;
					}

					const regex = getStringIfConstant(regexArgument);
					const flags = getStringIfConstant(flagsArgument);

					if (regex) {
						checkRegex(regex, refNode, regexArgument, flags);
					}
				}
			},
		};
	},
};
