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
		 * Converts static values into comparable numbers.
		 * @param {unknown} value Value to normalize.
		 * @returns {number|null} Comparable number or null if unsupported.
		 */
		function toComparableNumber(value) {
			if (
				typeof value !== "number" &&
				typeof value !== "bigint" &&
				typeof value !== "boolean"
			) {
				return null;
			}

			const result = Number(value);

			return Number.isNaN(result) ? null : result;
		}

		/**
		 * Gets a static comparable value for a node.
		 * @param {ASTNode} node Node to evaluate.
		 * @returns {number|null} Comparable number or null if not static.
		 */
		function getStaticComparableValue(node) {
			const staticValue = getStaticValue(node, sourceCode.getScope(node));

			if (!staticValue) {
				return null;
			}

			return toComparableNumber(staticValue.value);
		}

		/**
		 * Gets the initial counter value from the for-loop initializer.
		 * @param {ASTNode} node The ForStatement node.
		 * @param {string} counter The counter identifier name.
		 * @returns {number|null} Comparable initial value or null if unknown.
		 */
		function getInitialCounterValue(node, counter) {
			if (!node.init) {
				return null;
			}

			if (node.init.type === "VariableDeclaration") {
				for (const declarator of node.init.declarations) {
					if (
						declarator.id.type === "Identifier" &&
						declarator.id.name === counter &&
						declarator.init
					) {
						return getStaticComparableValue(declarator.init);
					}
				}

				return null;
			}

			if (
				node.init.type === "AssignmentExpression" &&
				node.init.left.type === "Identifier" &&
				node.init.left.name === counter
			) {
				return getStaticComparableValue(node.init.right);
			}

			return null;
		}

		/**
		 * Checks if the loop condition is statically false on first evaluation.
		 * @param {ASTNode} node The ForStatement node.
		 * @param {"left"|"right"} counterPosition Position of the counter in the condition.
		 * @param {string} counter The counter identifier name.
		 * @returns {boolean} True if the condition is statically false.
		 */
		function isInitialConditionStaticallyFalse(
			node,
			counterPosition,
			counter,
		) {
			const counterValue = getInitialCounterValue(node, counter);
			const boundaryNode =
				counterPosition === "left" ? node.test.right : node.test.left;
			const boundaryValue = getStaticComparableValue(boundaryNode);

			if (counterValue === null || boundaryValue === null) {
				return false;
			}

			const leftValue =
				counterPosition === "left" ? counterValue : boundaryValue;
			const rightValue =
				counterPosition === "left" ? boundaryValue : counterValue;

			switch (node.test.operator) {
				case "<":
					return !(leftValue < rightValue);
				case "<=":
					return !(leftValue <= rightValue);
				case ">":
					return !(leftValue > rightValue);
				case ">=":
					return !(leftValue >= rightValue);
				default:
					return false;
			}
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
						let updateDirection = 0;

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

						if (update.type === "UpdateExpression") {
							updateDirection = getUpdateDirection(update, counter);
						} else if (update.type === "AssignmentExpression") {
							updateDirection = getAssignmentDirection(
								update,
								counter,
							);
						}

						if (!updateDirection) {
							continue;
						}

						if (
							isInitialConditionStaticallyFalse(
								node,
								counterPosition,
								counter,
							)
						) {
							report(node);
							return;
						}

						if (updateDirection === wrongDirection) {
							report(node);
							return;
						}
					}
				}
			},
		};
	},
};
