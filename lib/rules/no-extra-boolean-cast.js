/**
 * @fileoverview Rule to flag unnecessary double negation in Boolean contexts
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");
const eslintUtils = require("@eslint-community/eslint-utils");

const precedence = astUtils.getPrecedence;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether a token starts a function or class expression,
 * which would be parsed as a declaration at the start of a statement
 * or after `export default`.
 * @param {SourceCode} sourceCode The source code object.
 * @param {Token} token The first token of the expression.
 * @param {ASTNode} node The node that contains the expression.
 * @returns {boolean} Whether the token starts a function or class expression.
 */
function startsFunctionOrClass(sourceCode, token, node) {
	if (
		token.type === "Keyword" &&
		(token.value === "function" || token.value === "class")
	) {
		return true;
	}

	const nextToken = sourceCode.getTokenAfter(token);

	return (
		(token.type === "Identifier" || token.type === "Keyword") &&
		token.value === "async" &&
		Boolean(nextToken) &&
		nextToken.range[1] <= node.range[1] &&
		nextToken.type === "Keyword" &&
		nextToken.value === "function"
	);
}

/**
 * Checks whether a token at the start of a line would continue the expression on the previous line.
 * @param {Token} token The token to check.
 * @returns {boolean} Whether the token can continue the previous expression.
 */
function canContinueExpression(token) {
	return (
		token.type === "Template" ||
		token.type === "RegularExpression" ||
		(token.type === "Punctuator" &&
			["(", "[", "+", "-"].includes(token.value))
	);
}

/**
 * Checks whether a token would continue an expression that ends with a postfix `++` or `--`.
 * A postfix `++` or `--` ends the statement before `(` or `[`, but `+`, `-` and `/` continue it.
 * @param {Token} token The first token of the new expression.
 * @param {Token|null} tokenBefore The token before the new expression.
 * @returns {boolean} Whether the token would continue the expression.
 */
function continuesPostfixUpdate(token, tokenBefore) {
	return (
		Boolean(tokenBefore) &&
		tokenBefore.type === "Punctuator" &&
		(tokenBefore.value === "++" || tokenBefore.value === "--") &&
		(token.type === "RegularExpression" ||
			(token.type === "Punctuator" &&
				(token.value === "+" || token.value === "-")))
	);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		defaultOptions: [{}],

		docs: {
			description: "Disallow unnecessary boolean casts",
			recommended: true,
			frozen: true,
			url: "https://eslint.org/docs/latest/rules/no-extra-boolean-cast",
		},

		schema: [
			{
				anyOf: [
					{
						type: "object",
						properties: {
							enforceForInnerExpressions: {
								type: "boolean",
							},
						},
						additionalProperties: false,
					},

					// deprecated
					{
						type: "object",
						properties: {
							enforceForLogicalOperands: {
								type: "boolean",
							},
						},
						additionalProperties: false,
					},
				],
			},
		],
		fixable: "code",

		messages: {
			unexpectedCall: "Redundant Boolean call.",
			unexpectedNegation: "Redundant double negation.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const [{ enforceForLogicalOperands, enforceForInnerExpressions }] =
			context.options;

		// Node types which have a test which will coerce values to booleans.
		const BOOLEAN_NODE_TYPES = new Set([
			"IfStatement",
			"DoWhileStatement",
			"WhileStatement",
			"ConditionalExpression",
			"ForStatement",
		]);

		/**
		 * Check if a node is a Boolean function or constructor.
		 * @param {ASTNode} node the node
		 * @returns {boolean} If the node is Boolean function or constructor
		 */
		function isBooleanFunctionOrConstructorCall(node) {
			// Boolean(<bool>) and new Boolean(<bool>)
			return (
				(node.type === "CallExpression" ||
					node.type === "NewExpression") &&
				node.callee.type === "Identifier" &&
				node.callee.name === "Boolean" &&
				sourceCode.isGlobalReference(node.callee)
			);
		}

		/**
		 * Check if a node is in a context where its value would be coerced to a boolean at runtime.
		 * @param {ASTNode} node The node
		 * @returns {boolean} If it is in a boolean context
		 */
		function isInBooleanContext(node) {
			return (
				(isBooleanFunctionOrConstructorCall(node.parent) &&
					node === node.parent.arguments[0]) ||
				(BOOLEAN_NODE_TYPES.has(node.parent.type) &&
					node === node.parent.test) ||
				// !<bool>
				(node.parent.type === "UnaryExpression" &&
					node.parent.operator === "!")
			);
		}

		/**
		 * Checks whether the node is a context that should report an error
		 * Acts recursively if it is in a logical context
		 * @param {ASTNode} node the node
		 * @returns {boolean} If the node is in one of the flagged contexts
		 */
		function isInFlaggedContext(node) {
			if (node.parent.type === "ChainExpression") {
				return isInFlaggedContext(node.parent);
			}

			/*
			 * legacy behavior - enforceForLogicalOperands will only recurse on
			 * logical expressions, not on other contexts.
			 * enforceForInnerExpressions will recurse on logical expressions
			 * as well as the other recursive syntaxes.
			 */

			if (enforceForLogicalOperands || enforceForInnerExpressions) {
				if (node.parent.type === "LogicalExpression") {
					if (
						node.parent.operator === "||" ||
						node.parent.operator === "&&"
					) {
						return isInFlaggedContext(node.parent);
					}

					// Check the right hand side of a `??` operator.
					if (
						enforceForInnerExpressions &&
						node.parent.operator === "??" &&
						node.parent.right === node
					) {
						return isInFlaggedContext(node.parent);
					}
				}
			}

			if (enforceForInnerExpressions) {
				if (
					node.parent.type === "ConditionalExpression" &&
					(node.parent.consequent === node ||
						node.parent.alternate === node)
				) {
					return isInFlaggedContext(node.parent);
				}

				/*
				 * Check last expression only in a sequence, i.e. if ((1, 2, Boolean(3))) {}, since
				 * the others don't affect the result of the expression.
				 */
				if (
					node.parent.type === "SequenceExpression" &&
					node.parent.expressions.at(-1) === node
				) {
					return isInFlaggedContext(node.parent);
				}
			}

			return isInBooleanContext(node);
		}

		/**
		 * Check if a node has comments inside.
		 * @param {ASTNode} node The node to check.
		 * @returns {boolean} `true` if it has comments inside.
		 */
		function hasCommentsInside(node) {
			return Boolean(sourceCode.getCommentsInside(node).length);
		}

		/**
		 * Checks if the given node is wrapped in grouping parentheses. Parentheses for constructs such as if() don't count.
		 * @param {ASTNode} node The node to check.
		 * @returns {boolean} `true` if the node is parenthesized.
		 * @private
		 */
		function isParenthesized(node) {
			return eslintUtils.isParenthesized(1, node, sourceCode);
		}

		/**
		 * Determines whether the given node needs to be parenthesized when replacing the previous node.
		 * It assumes that `previousNode` is the node to be reported by this rule, so it has a limited list
		 * of possible parent node types. By the same assumption, the node's role in a particular parent is already known.
		 * @param {ASTNode} previousNode Previous node.
		 * @param {ASTNode} node The node to check.
		 * @throws {Error} (Unreachable.)
		 * @returns {boolean} `true` if the node needs to be parenthesized.
		 */
		function needsParens(previousNode, node) {
			if (previousNode.parent.type === "ChainExpression") {
				return needsParens(previousNode.parent, node);
			}

			if (isParenthesized(previousNode)) {
				// parentheses around the previous node will stay, so there is no need for an additional pair
				return false;
			}

			// parent of the previous node will become parent of the replacement node
			const parent = previousNode.parent;

			switch (parent.type) {
				case "CallExpression":
				case "NewExpression":
					return node.type === "SequenceExpression";
				case "IfStatement":
				case "DoWhileStatement":
				case "WhileStatement":
				case "ForStatement":
				case "SequenceExpression":
					return false;
				case "ConditionalExpression":
					if (previousNode === parent.test) {
						return precedence(node) <= precedence(parent);
					}
					if (
						previousNode === parent.consequent ||
						previousNode === parent.alternate
					) {
						return (
							precedence(node) <
							precedence({ type: "AssignmentExpression" })
						);
					}

					/* c8 ignore next */
					throw new Error(
						"Ternary child must be test, consequent, or alternate.",
					);
				case "UnaryExpression":
					return precedence(node) < precedence(parent);
				case "LogicalExpression":
					if (
						astUtils.isMixedLogicalAndCoalesceExpressions(
							node,
							parent,
						)
					) {
						return true;
					}
					if (previousNode === parent.left) {
						return precedence(node) < precedence(parent);
					}
					return precedence(node) <= precedence(parent);

				/* c8 ignore next */
				default:
					throw new Error(`Unexpected parent type: ${parent.type}`);
			}
		}

		/**
		 * Replaces `targetNode` (`!!arg` or `Boolean(arg)`) with `argument`, adding parentheses,
		 * a preceding semicolon, or adjacent-token spacing when needed to keep the output valid.
		 * @param {RuleFixer} fixer The fixer object.
		 * @param {ASTNode} targetNode The node to replace.
		 * @param {ASTNode} argument The inner expression node.
		 * @returns {Fix} The fix object.
		 */
		function replaceWithArgument(fixer, targetNode, argument) {
			const firstReplacementToken = sourceCode.getFirstToken(argument);
			const lastReplacementToken = sourceCode.getLastToken(argument);
			const tokenBefore = sourceCode.getTokenBefore(targetNode);
			const tokenAfter = sourceCode.getTokenAfter(targetNode);
			const isStartOfExpressionStatement =
				astUtils.isStartOfExpressionStatement(targetNode);

			/*
			 * `{` cannot start an expression statement or the concise body of an arrow function,
			 * and `function`, `async function`, or `class` cannot start an expression statement
			 * or follow `export default`.
			 */
			const shouldParenthesize =
				needsParens(targetNode, argument) ||
				(!isParenthesized(targetNode) &&
					(((isStartOfExpressionStatement ||
						(tokenBefore &&
							astUtils.isKeywordToken(tokenBefore) &&
							tokenBefore.value === "default")) &&
						startsFunctionOrClass(
							sourceCode,
							firstReplacementToken,
							argument,
						)) ||
						((isStartOfExpressionStatement ||
							(tokenBefore &&
								astUtils.isArrowToken(tokenBefore))) &&
							astUtils.isOpeningBraceToken(
								firstReplacementToken,
							))));

			const replacement = shouldParenthesize
				? `(${sourceCode.getText(argument)})`
				: sourceCode.getText(argument);

			let prefix = "";
			let suffix = "";

			if (!shouldParenthesize) {
				if (
					tokenBefore &&
					tokenBefore.range[1] === targetNode.range[0] &&
					!astUtils.canTokensBeAdjacent(
						tokenBefore,
						firstReplacementToken,
					)
				) {
					prefix = " ";
				}

				if (
					tokenAfter &&
					targetNode.range[1] === tokenAfter.range[0] &&
					!astUtils.canTokensBeAdjacent(
						lastReplacementToken,
						tokenAfter,
					)
				) {
					suffix = " ";
				}
			}

			if (
				!prefix &&
				isStartOfExpressionStatement &&
				(((shouldParenthesize ||
					canContinueExpression(firstReplacementToken)) &&
					astUtils.needsPrecedingSemicolon(sourceCode, targetNode)) ||
					(!shouldParenthesize &&
						continuesPostfixUpdate(
							firstReplacementToken,
							tokenBefore,
						)))
			) {
				prefix = ";";
			}

			return fixer.replaceText(
				targetNode,
				`${prefix}${replacement}${suffix}`,
			);
		}

		return {
			UnaryExpression(node) {
				const parent = node.parent;

				// Exit early if it's guaranteed not to match
				if (
					node.operator !== "!" ||
					parent.type !== "UnaryExpression" ||
					parent.operator !== "!"
				) {
					return;
				}

				if (isInFlaggedContext(parent)) {
					context.report({
						node: parent,
						messageId: "unexpectedNegation",
						fix(fixer) {
							if (hasCommentsInside(parent)) {
								return null;
							}

							return replaceWithArgument(
								fixer,
								parent,
								node.argument,
							);
						},
					});
				}
			},

			CallExpression(node) {
				if (
					node.callee.type !== "Identifier" ||
					node.callee.name !== "Boolean" ||
					!sourceCode.isGlobalReference(node.callee)
				) {
					return;
				}

				if (isInFlaggedContext(node)) {
					context.report({
						node,
						messageId: "unexpectedCall",
						fix(fixer) {
							const parent = node.parent;

							if (node.arguments.length === 0) {
								if (
									parent.type === "UnaryExpression" &&
									parent.operator === "!"
								) {
									/*
									 * !Boolean() -> true
									 */

									if (hasCommentsInside(parent)) {
										return null;
									}

									const replacement = "true";
									let prefix = "";
									let suffix = "";
									const tokenBefore =
										sourceCode.getTokenBefore(parent);
									const tokenAfter =
										sourceCode.getTokenAfter(parent);

									if (
										tokenBefore &&
										tokenBefore.range[1] ===
											parent.range[0] &&
										!astUtils.canTokensBeAdjacent(
											tokenBefore,
											replacement,
										)
									) {
										prefix = " ";
									}

									if (
										tokenAfter &&
										parent.range[1] ===
											tokenAfter.range[0] &&
										!astUtils.canTokensBeAdjacent(
											replacement,
											tokenAfter,
										)
									) {
										suffix = " ";
									}

									return fixer.replaceText(
										parent,
										prefix + replacement + suffix,
									);
								}

								/*
								 * Boolean() -> false
								 */

								if (hasCommentsInside(node)) {
									return null;
								}

								return fixer.replaceText(node, "false");
							}

							if (node.arguments.length === 1) {
								const argument = node.arguments[0];

								if (
									argument.type === "SpreadElement" ||
									hasCommentsInside(node)
								) {
									return null;
								}

								/*
								 * Boolean(expression) -> expression
								 */

								return replaceWithArgument(
									fixer,
									node,
									argument,
								);
							}

							// two or more arguments
							return null;
						},
					});
				}
			},
		};
	},
};
