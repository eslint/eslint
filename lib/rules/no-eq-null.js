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

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const STRICT_OPERATORS = {
	"==": "===",
	"!=": "!==",
};

const LOGICAL_OPERATORS = {
	"==": "||",
	"!=": "&&",
};

/*
 * Node types whose value is guaranteed to be the same when it is read twice,
 * so that the operand can be duplicated in a suggestion. Reading a call or a
 * member expression a second time could observe a different value or run side
 * effects, so those operands only get the suggestion that replaces the
 * operator.
 */
const DUPLICABLE_NODE_TYPES = new Set([
	"Identifier",
	"ThisExpression",
	"MetaProperty",
	"Literal",
]);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		hasSuggestions: true,

		docs: {
			description:
				"Disallow `null` comparisons without type-checking operators",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-eq-null",
		},

		schema: [],

		messages: {
			unexpected: "Use '===' to compare with null.",
			replaceOperator:
				"Replace '{{actualOperator}}' with '{{expectedOperator}}' (no longer matches `undefined`).",
			strictNullCheck:
				"Compare strictly with `null` and `undefined` (keeps the current result).",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		return {
			BinaryExpression(node) {
				if (node.operator !== "==" && node.operator !== "!=") {
					return;
				}

				const nullIsLeft = astUtils.isNullLiteral(node.left);
				const nullIsRight = astUtils.isNullLiteral(node.right);

				if (!nullIsLeft && !nullIsRight) {
					return;
				}

				const otherOperand = nullIsLeft ? node.right : node.left;
				const operatorToken = sourceCode.getFirstTokenBetween(
					node.left,
					node.right,
					token => token.value === node.operator,
				);
				const expectedOperator = STRICT_OPERATORS[node.operator];

				/** @type {Array<Object>} */
				const suggest = [
					{
						messageId: "replaceOperator",
						data: {
							actualOperator: node.operator,
							expectedOperator,
						},
						fix: fixer =>
							fixer.replaceText(operatorToken, expectedOperator),
					},
				];

				/*
				 * Keeping the `undefined` match requires the operand to appear
				 * twice. Only offer that suggestion when reading the operand
				 * twice cannot change the result, and only when replacing the
				 * whole expression would not discard comments.
				 */
				if (
					nullIsLeft !== nullIsRight &&
					DUPLICABLE_NODE_TYPES.has(otherOperand.type) &&
					sourceCode.getCommentsInside(node).length === 0
				) {
					const operandText = sourceCode.getText(otherOperand);

					suggest.push({
						messageId: "strictNullCheck",
						fix: fixer =>
							fixer.replaceText(
								node,
								`${operandText} ${expectedOperator} null ${LOGICAL_OPERATORS[node.operator]} ${operandText} ${expectedOperator} undefined`,
							),
					});
				}

				context.report({
					node,
					messageId: "unexpected",
					suggest,
				});
			},
		};
	},
};
