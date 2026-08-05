/**
 * @fileoverview The rule should warn against code that tries to compare against -0.
 * @author Aladdin-ADD <hh_2013@foxmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { getVariableByName } = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",

		docs: {
			description: "Disallow comparing against `-0`",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-compare-neg-zero",
		},

		fixable: null,
		hasSuggestions: true,
		schema: [],

		messages: {
			unexpected:
				"Do not use the '{{operator}}' operator to compare against -0.",
			suggestRemoveMinus:
				"Replace '-0' with '0' (keeps the current comparison behavior).",
			suggestObjectIs:
				"Replace with 'Object.is()' (changes the comparison to distinguish -0 from +0).",
			suggestNotObjectIs:
				"Replace with '!Object.is()' (changes the comparison to distinguish -0 from +0).",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		//--------------------------------------------------------------------------
		// Helpers
		//--------------------------------------------------------------------------

		/**
		 * Checks a given node is -0
		 * @param {ASTNode} node A node to check.
		 * @returns {boolean} `true` if the node is -0.
		 */
		function isNegZero(node) {
			return (
				node.type === "UnaryExpression" &&
				node.operator === "-" &&
				node.argument.type === "Literal" &&
				node.argument.value === 0
			);
		}

		/**
		 * Gets the source text of an operand, keeping parentheses where required.
		 * @param {ASTNode} operand A comparison operand node.
		 * @returns {string} The source text of the operand.
		 */
		function getOperandText(operand) {
			const text = sourceCode.getText(operand);

			return operand.type === "SequenceExpression" ? `(${text})` : text;
		}

		const OPERATORS_TO_CHECK = new Set([
			">",
			">=",
			"<",
			"<=",
			"==",
			"===",
			"!=",
			"!==",
		]);

		return {
			BinaryExpression(node) {
				if (!OPERATORS_TO_CHECK.has(node.operator)) {
					return;
				}

				const leftIsNegZero = isNegZero(node.left);
				const rightIsNegZero = isNegZero(node.right);

				if (!leftIsNegZero && !rightIsNegZero) {
					return;
				}

				context.report({
					node,
					messageId: "unexpected",
					data: { operator: node.operator },
					suggest: [
						{
							messageId: "suggestRemoveMinus",
							*fix(fixer) {
								if (leftIsNegZero) {
									yield fixer.replaceText(node.left, "0");
								}
								if (rightIsNegZero) {
									yield fixer.replaceText(node.right, "0");
								}
							},
						},
						{
							messageId:
								node.operator === "==="
									? "suggestObjectIs"
									: "suggestNotObjectIs",
							fix(fixer) {
								if (
									(node.operator !== "===" &&
										node.operator !== "!==") ||
									sourceCode.getCommentsInside(node).length >
										0
								) {
									return null;
								}

								const objectVariable = getVariableByName(
									sourceCode.getScope(node),
									"Object",
								);

								if (
									!objectVariable ||
									objectVariable.identifiers.length > 0
								) {
									return null;
								}

								const negation =
									node.operator === "===" ? "" : "!";

								return fixer.replaceText(
									node,
									`${negation}Object.is(${getOperandText(node.left)}, ${getOperandText(node.right)})`,
								);
							},
						},
					],
				});
			},
		};
	},
};
