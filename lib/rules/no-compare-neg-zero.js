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
			suggestRemoveMinus: "Replace '-0' with '0'.",
			suggestObjectIs: "Replace with 'Object.is()'.",
			suggestNotObjectIs: "Replace with '!Object.is()'.",
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

				const negZeroNode = leftIsNegZero ? node.left : node.right;
				const suggest = [
					{
						messageId: "suggestRemoveMinus",
						fix(fixer) {
							return fixer.replaceText(negZeroNode, "0");
						},
					},
				];

				if (node.operator === "===" || node.operator === "!==") {
					// check `Object` scope
					const objectVariable = getVariableByName(
						sourceCode.getScope(node),
						"Object",
					);

					if (
						sourceCode.getCommentsInside(node).length === 0 &&
						objectVariable &&
						objectVariable.identifiers.length === 0
					) {
						const negation = node.operator === "===" ? "" : "!";

						suggest.push({
							messageId:
								node.operator === "==="
									? "suggestObjectIs"
									: "suggestNotObjectIs",
							fix(fixer) {
								return fixer.replaceText(
									node,
									`${negation}Object.is(${sourceCode.getText(node.left)}, ${sourceCode.getText(node.right)})`,
								);
							},
						});
					}
				}

				context.report({
					node,
					messageId: "unexpected",
					data: { operator: node.operator },
					suggest,
				});
			},
		};
	},
};
