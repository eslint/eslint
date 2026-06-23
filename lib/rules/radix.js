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
// Helpers
//------------------------------------------------------------------------------

const validRadixValues = new Set(
	Array.from({ length: 37 - 2 }, (_, index) => index + 2),
);

/**
 * Checks whether a given node is a MemberExpression of `Number.parseInt` method or not.
 * @param {ASTNode} node A node to check.
 * @returns {boolean} `true` if the node is a MemberExpression of `Number.parseInt`
 *      method.
 */
function isNumberParseIntMethod(node) {
	return (
		node.type === "MemberExpression" &&
		node.object.type === "Identifier" &&
		node.object.name === "Number" &&
		!node.computed &&
		node.property.type === "Identifier" &&
		node.property.name === "parseInt"
	);
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

			switch (args.length) {
				case 0:
					context.report({
						node,
						messageId: "missingParameters",
					});
					break;

				case 1:
					context.report({
						node,
						messageId: "missingRadix",
						suggest: [
							{
								messageId: "addRadixParameter10",
								fix(fixer) {
									const tokens = sourceCode.getTokens(node);
									const lastToken = tokens.at(-1); // Parenthesis.
									const secondToLastToken = tokens.at(-2); // May or may not be a comma.
									const hasTrailingComma =
										secondToLastToken.type ===
											"Punctuator" &&
										secondToLastToken.value === ",";

									return fixer.insertTextBefore(
										lastToken,
										hasTrailingComma ? " 10," : ", 10",
									);
								},
							},
						],
					});
					break;

				default:
					if (!isValidRadix(args[1], sourceCode)) {
						context.report({
							node,
							messageId: "invalidRadix",
						});
					}
					break;
			}
		}

		return {
			CallExpression(node) {
				const callee = astUtils.skipChainExpression(node.callee);

				if (
					(astUtils.isSpecificId(callee, "parseInt") &&
						sourceCode.isGlobalReference(callee)) ||
					(isNumberParseIntMethod(callee) &&
						sourceCode.isGlobalReference(callee.object))
				) {
					checkArguments(node);
				}
			},
		};
	},
};
