/**
 * @fileoverview Rule to flag use of parseInt without a radix argument
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Types
//------------------------------------------------------------------------------

/** @typedef {import("eslint-scope").Variable} Variable */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const validRadixValues = new Set(
	Array.from({ length: 37 - 2 }, (_, index) => index + 2),
);

/**
 * Checks whether a given variable is shadowed or not.
 * @param {Variable} variable A variable to check.
 * @returns {boolean} `true` if the variable is shadowed.
 */
function isShadowed(variable) {
	return variable.defs.length >= 1;
}

/**
 * Checks whether a given node is a valid value of radix or not.
 *
 * The following values are invalid.
 *
 * - A literal except integers between 2 and 36.
 * - undefined.
 * @param {ASTNode} radix A node of radix to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} `true` if the node is valid.
 */
function isValidRadix(radix, sourceCode) {
	if (
		radix.type === "UnaryExpression" &&
		(radix.operator === "-" || radix.operator === "+") &&
		radix.argument.type === "Literal" &&
		typeof radix.argument.value === "number"
	) {
		const value =
			radix.operator === "-"
				? -radix.argument.value
				: radix.argument.value;

		return validRadixValues.has(value);
	}

	return !(
		(radix.type === "Literal" && !validRadixValues.has(radix.value)) ||
		(radix.type === "Identifier" &&
			radix.name === "undefined" &&
			sourceCode.isGlobalReference(radix))
	);
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
				"Enforce the use of the radix argument when using `parseInt()`",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/radix",
		},

		hasSuggestions: true,

		schema: [
			// deprecated
			{
				enum: ["always", "as-needed"],
			},
		],

		messages: {
			missingParameters: "Missing parameters.",
			missingRadix: "Missing radix parameter.",
			invalidRadix:
				"Invalid radix parameter, must be an integer between 2 and 36.",
			addRadixParameter10:
				"Add radix parameter `10` for parsing decimal numbers.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		/**
		 * Checks the arguments of a given CallExpression node and reports it if it
		 * offends this rule.
		 * @param {ASTNode} node A CallExpression node to check.
		 * @returns {void}
		 */
		function checkArguments(node) {
			const args = node.arguments;
			const spreadIndex = args.findIndex(
				arg => arg.type === "SpreadElement",
			);

			if (spreadIndex !== -1 && spreadIndex < 2) {
				return;
			}

			if (args.length === 0) {
				context.report({
					node,
					messageId: "missingParameters",
				});
			} else if (args.length === 1) {
				context.report({
					node,
					messageId: "missingRadix",
					suggest: [
						{
							messageId: "addRadixParameter10",
							fix(fixer) {
								const lastToken = sourceCode.getLastToken(node);
								const prevToken =
									sourceCode.getTokenBefore(lastToken);

								const hasTrailingComma =
									astUtils.isCommaToken(prevToken);

								return fixer.insertTextBefore(
									lastToken,
									hasTrailingComma ? " 10," : ", 10",
								);
							},
						},
					],
				});
			} else if (!isValidRadix(args[1], sourceCode)) {
				context.report({
					node,
					messageId: "invalidRadix",
				});
			}
		}

		return {
			"Program:exit"(node) {
				const scope = sourceCode.getScope(node);
				let variable;

				// Check `parseInt()`
				variable = astUtils.getVariableByName(scope, "parseInt");
				if (variable && !isShadowed(variable)) {
					variable.references.forEach(reference => {
						const idNode = reference.identifier;

						if (astUtils.isCallee(idNode)) {
							checkArguments(idNode.parent);
						}
					});
				}

				// Check `Number.parseInt()`
				variable = astUtils.getVariableByName(scope, "Number");
				if (variable && !isShadowed(variable)) {
					variable.references.forEach(reference => {
						const parentNode = reference.identifier.parent;
						const maybeCallee =
							parentNode.parent.type === "ChainExpression"
								? parentNode.parent
								: parentNode;

						if (
							astUtils.isSpecificMemberAccess(
								parentNode,
								"Number",
								"parseInt",
							) &&
							astUtils.isCallee(maybeCallee)
						) {
							checkArguments(maybeCallee.parent);
						}
					});
				}
			},
		};
	},
};
