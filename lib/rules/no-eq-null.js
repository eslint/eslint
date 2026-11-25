/**
 * @fileoverview Rule to flag comparisons to null without a type-checking
 * operator.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");
const { addUndefinedComparison } = require("./utils/fix-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description:
				"Disallow `null` comparisons without type-checking operators",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-eq-null",
		},

		hasSuggestions: true,

		schema: [],

		messages: {
			unexpected: "Use '{{expectedOperator}}' to compare with null.",
			replaceOperator:
				"Use '{{expectedOperator}}' to compare with null only.",
			addUndefinedComparison:
				"Use '{{expectedOperator}}' to compare with both null and undefined.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		return {
			BinaryExpression(node) {
				if (node.operator !== "==" && node.operator !== "!=") {
					return;
				}

				if (
					!astUtils.isNullLiteral(node.right) &&
					!astUtils.isNullLiteral(node.left)
				) {
					return;
				}

				const expectedOperator = `${node.operator}=`;
				const operatorToken = sourceCode.getFirstTokenBetween(
					node.left,
					node.right,
					token => token.value === node.operator,
				);

				context.report({
					node,
					messageId: "unexpected",
					data: { expectedOperator },
					suggest: [
						{
							messageId: "replaceOperator",
							data: { expectedOperator },
							fix(fixer) {
								return fixer.replaceText(
									operatorToken,
									expectedOperator,
								);
							},
						},
						{
							messageId: "addUndefinedComparison",
							data: { expectedOperator },
							fix(fixer) {
								return addUndefinedComparison(
									fixer,
									sourceCode,
									node,
								);
							},
						},
					],
				});
			},
		};
	},
};
