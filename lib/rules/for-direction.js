/**
 * @fileoverview enforce `for` loop update clause moving the counter in the right direction.(for-direction)
 * @author Aladdin-ADD<hh_2013@foxmail.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { getStaticValue } = require("@eslint-community/eslint-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",

		docs: {
			description:
				"Enforce `for` loop update clause moving the counter in the right direction",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/for-direction",
		},

		fixable: null,
		schema: [],

		messages: {
			incorrectDirection:
				"The update clause in this loop moves the variable in the wrong direction.",
		},
	},

	create(context) {
		const { sourceCode } = context;

		/**
		 * report an error.
		 * @param {ASTNode} node the node to report.
		 * @returns {void}
		 */
		function report(node) {
			context.report({
				loc: {
					start: node.loc.start,
					end: sourceCode.getTokenBefore(node.body).loc.end,
				},
				messageId: "incorrectDirection",
			});
		}

		/**
		 * check the right side of the assignment
		 * @param {ASTNode} update UpdateExpression to check
		 * @param {number} dir expected direction that could either be turned around or invalidated
		 * @returns {number} return dir, the negated dir, or zero if the counter does not change or the direction is not clear
		 */
		function getRightDirection(update, dir) {
			const staticValue = getStaticValue(
				update.right,
				sourceCode.getScope(update),
			);

			if (
				staticValue &&
				["bigint", "boolean", "number"].includes(
					typeof staticValue.value,
				)
			) {
				const sign = Math.sign(Number(staticValue.value)) || 0; // convert NaN to 0

				return dir * sign;
			}
			return 0;
		}

		/**
		 * check UpdateExpression add/sub the counter
		 * @param {ASTNode} update UpdateExpression to check
		 * @param {string} counter variable name to check
		 * @returns {number} if add return 1, if sub return -1, if nochange, return 0
		 */
		function getUpdateDirection(update, counter) {
			if (
				update.argument.type === "Identifier" &&
				update.argument.name === counter
			) {
				if (update.operator === "++") {
					return 1;
				}
				if (update.operator === "--") {
					return -1;
				}
			}
			return 0;
		}

		/**
		 * check AssignmentExpression add/sub the counter
		 * @param {ASTNode} update AssignmentExpression to check
		 * @param {string} counter variable name to check
		 * @returns {number} if add return 1, if sub return -1, if nochange, return 0
		 */
		function getAssignmentDirection(update, counter) {
			if (update.left.name === counter) {
				if (update.operator === "+=") {
					return getRightDirection(update, 1);
				}
				if (update.operator === "-=") {
					return getRightDirection(update, -1);
				}
			}
			return 0;
		}
		/**
		 * Collects all expressions that modify the counter.
		 * @param {ASTNode} node The expression node to check.
		 * @param {string} counter The name of the counter variable.
		 * @returns {ASTNode[]} An array of modifying expressions.
		 */
		function getModifyingExpressions(node, counter) {
			if (node.type === "SequenceExpression") {
				return node.expressions.flatMap(expr =>
					getModifyingExpressions(expr, counter),
				);
			}
			if (
				node.type === "UpdateExpression" &&
				node.argument.type === "Identifier" &&
				node.argument.name === counter
			) {
				return [node];
			}
			if (
				node.type === "AssignmentExpression" &&
				node.left.type === "Identifier" &&
				node.left.name === counter
			) {
				return [node];
			}
			return [];
		}

		/**
		 * Determines the direction of a single update expression for the counter.
		 * @param {ASTNode} expr An expression node to check (UpdateExpression or AssignmentExpression).
		 * @param {string} counter The variable name of the counter.
		 * @returns {number} 1 if incrementing, -1 if decrementing, 0 if unknown or not modifying the counter.
		 */
		function getDirectionFromExpression(expr, counter) {
			if (expr.type === "UpdateExpression") {
				return getUpdateDirection(expr, counter);
			}
			if (expr.type === "AssignmentExpression") {
				return getAssignmentDirection(expr, counter);
			}
			return 0;
		}

		return {
			ForStatement(node) {
				if (
					node.test &&
					node.test.type === "BinaryExpression" &&
					node.update
				) {
					for (const counterPosition of ["left", "right"]) {
						if (node.test[counterPosition].type !== "Identifier") {
							continue;
						}

						const counter = node.test[counterPosition].name;
						const operator = node.test.operator;
						const update = node.update;

						let wrongDirection;

						if (operator === "<" || operator === "<=") {
							wrongDirection =
								counterPosition === "left" ? -1 : 1;
						} else if (operator === ">" || operator === ">=") {
							wrongDirection =
								counterPosition === "left" ? 1 : -1;
						} else {
							return;
						}

						const mutatingExpressions = getModifyingExpressions(
							update,
							counter,
						);

						if (
							mutatingExpressions.length === 1 &&
							getDirectionFromExpression(
								mutatingExpressions[0],
								counter,
							) === wrongDirection
						) {
							report(node);
						}
					}
				}
			},
		};
	},
};
