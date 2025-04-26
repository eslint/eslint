/**
 * @fileoverview Disallow construction of dense arrays using the Array constructor
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const {
	getVariableByName,
	isClosingParenToken,
	isOpeningParenToken,
	isStartOfExpressionStatement,
	needsPrecedingSemicolon,
} = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		dialects: ["javascript", "typescript"],
		language: "javascript",
		type: "suggestion",

		docs: {
			description: "Disallow `Array` constructors",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-array-constructor",
		},

		fixable: "code",

		hasSuggestions: true,

		schema: [],

		messages: {
			preferLiteral: "The array literal notation [] is preferable.",
			useLiteral: "Replace with an array literal.",
			useLiteralAfterSemicolon:
				"Replace with an array literal, add preceding semicolon.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		/**
		 * Checks whether comments exist between the array constructor and its elements.
		 * This function examines different parts of an array constructor node to determine if any comments are present in the following locations:
		 * - Between the `new` keyword and the `Array` identifier.
		 * - Between the opening parenthesis `(` and the `Array` identifier.
		 * - Between the `Array` identifier and the closing parenthesis `)`.
		 * - Between the closing parenthesis `)` and the opening parenthesis `(` of the arguments.
		 * @param {ASTNode} node The array constructor node to check. This can be either a
		 * `CallExpression` (for `Array()`) or a `NewExpression` (for `new Array()`).
		 * @returns {boolean} `true` if comments exist in any of the checked locations, `false` otherwise.
		 */
		function hasCommentsInArrayConstructor(node) {
			const calleeToken = node.callee;

			if (node.type === "NewExpression") {
				const newToken = sourceCode.getFirstToken(node);
				if (sourceCode.commentsExistBetween(newToken, calleeToken)) {
					return true;
				}
			}

			let lastRelevantToken = calleeToken;

			const tokenBefore = sourceCode.getTokenBefore(calleeToken);
			if (tokenBefore && isOpeningParenToken(tokenBefore)) {
				if (sourceCode.commentsExistBetween(tokenBefore, calleeToken)) {
					return true;
				}

				const tokenAfter = sourceCode.getTokenAfter(calleeToken);
				if (tokenAfter && isClosingParenToken(tokenAfter)) {
					if (
						sourceCode.commentsExistBetween(calleeToken, tokenAfter)
					) {
						return true;
					}
					lastRelevantToken = tokenAfter;
				}
			}

			const lastToken = sourceCode.getLastToken(node);
			let currentToken = lastRelevantToken;

			do {
				currentToken = sourceCode.getTokenAfter(currentToken);
				if (!currentToken || currentToken === lastToken) {
					break;
				}
			} while (!isOpeningParenToken(currentToken));

			if (currentToken) {
				if (
					sourceCode.commentsExistBetween(
						lastRelevantToken,
						currentToken,
					)
				) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Gets the text between the calling parentheses of a CallExpression or NewExpression.
		 * @param {ASTNode} node A CallExpression or NewExpression node.
		 * @returns {string} The text between the calling parentheses, or an empty string if there are none.
		 */
		function getArgumentsText(node) {
			const lastToken = sourceCode.getLastToken(node);

			if (!isClosingParenToken(lastToken)) {
				return "";
			}

			let firstToken = node.callee;

			do {
				firstToken = sourceCode.getTokenAfter(firstToken);
				if (!firstToken || firstToken === lastToken) {
					return "";
				}
			} while (!isOpeningParenToken(firstToken));

			return sourceCode.text.slice(
				firstToken.range[1],
				lastToken.range[0],
			);
		}

		/**
		 * Disallow construction of dense arrays using the Array constructor
		 * @param {ASTNode} node node to evaluate
		 * @returns {void}
		 * @private
		 */
		function check(node) {
			if (
				node.callee.type !== "Identifier" ||
				node.callee.name !== "Array" ||
				node.typeArguments ||
				(node.arguments.length === 1 &&
					node.arguments[0].type !== "SpreadElement")
			) {
				return;
			}

			const variable = getVariableByName(
				sourceCode.getScope(node),
				"Array",
			);

			/*
			 * Check if `Array` is a predefined global variable: predefined globals have no declarations,
			 * meaning that the `identifiers` list of the variable object is empty.
			 */
			if (variable && variable.identifiers.length === 0) {
				const argsText = getArgumentsText(node);
				let fixText;
				let messageId;

				const nonSpreadCount = node.arguments.reduce(
					(count, arg) =>
						arg.type !== "SpreadElement" ? count + 1 : count,
					0,
				);

				const shouldSuggest =
					(node.arguments.length > 0 && nonSpreadCount < 2) ||
					hasCommentsInArrayConstructor(node);

				/*
				 * Check if the suggested change should include a preceding semicolon or not.
				 * Due to JavaScript's ASI rules, a missing semicolon may be inserted automatically
				 * before an expression like `Array()` or `new Array()`, but not when the expression
				 * is changed into an array literal like `[]`.
				 */
				if (
					isStartOfExpressionStatement(node) &&
					needsPrecedingSemicolon(sourceCode, node)
				) {
					fixText = `;[${argsText}]`;
					messageId = "useLiteralAfterSemicolon";
				} else {
					fixText = `[${argsText}]`;
					messageId = "useLiteral";
				}

				context.report({
					node,
					messageId: "preferLiteral",
					fix(fixer) {
						if (shouldSuggest) {
							return null;
						}

						return fixer.replaceText(node, fixText);
					},
					suggest: [
						{
							messageId,
							fix(fixer) {
								if (shouldSuggest) {
									return fixer.replaceText(node, fixText);
								}

								return null;
							},
						},
					],
				});
			}
		}

		return {
			CallExpression: check,
			NewExpression: check,
		};
	},
};
