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

/**
 * Checks whether the given node is an identifier, `this`, or a chain of property accesses
 * starting from one of them, which can be repeated without side effects.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is a simple reference.
 */
function isSimpleReference(node) {
	switch (node.type) {
		case "Identifier":
		case "ThisExpression":
			return true;

		case "ChainExpression":
			return isSimpleReference(node.expression);

		case "MemberExpression":
			return (
				isSimpleReference(node.object) &&
				(!node.computed ||
					node.property.type === "Literal" ||
					isSimpleReference(node.property))
			);

		default:
			return false;
	}
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

				const isNullOnRight = astUtils.isNullLiteral(node.right);

				if (!isNullOnRight && !astUtils.isNullLiteral(node.left)) {
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
							*fix(fixer) {
								const operand = isNullOnRight
									? node.left
									: node.right;
								const isUndefinedGlobal =
									astUtils.getVariableByName(
										sourceCode.getScope(node),
										"undefined",
									)?.defs.length === 0;

								if (
									!isSimpleReference(operand) ||
									!isUndefinedGlobal
								) {
									return;
								}

								const logicalOperator =
									node.operator === "==" ? "||" : "&&";
								const operandText = sourceCode.getText(operand);
								const undefinedComparison = isNullOnRight
									? `${operandText} ${expectedOperator} undefined`
									: `undefined ${expectedOperator} ${operandText}`;
								const needsParens =
									!astUtils.isParenthesised(
										sourceCode,
										node,
									) &&
									(node.parent.type === "BinaryExpression" ||
										(node.parent.type ===
											"LogicalExpression" &&
											node.parent.operator !==
												logicalOperator));

								if (needsParens) {
									yield fixer.insertTextBefore(
										node,
										astUtils.isStartOfExpressionStatement(
											node,
										) &&
											astUtils.needsPrecedingSemicolon(
												sourceCode,
												node,
											)
											? ";("
											: "(",
									);
								}

								yield fixer.replaceText(
									operatorToken,
									expectedOperator,
								);
								yield fixer.insertTextAfter(
									node,
									` ${logicalOperator} ${undefinedComparison}${needsParens ? ")" : ""}`,
								);
							},
						},
					],
				});
			},
		};
	},
};
