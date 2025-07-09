/**
 * @fileoverview Rule to enforce spacing in ternary expressions.
 * @author Dawson Huang
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "layout",
		docs: {
			description:
				"Enforce spacing around `?` and `:` in ternary expressions",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/ternary-spacing",
		},
		fixable: "whitespace",
		schema: [],
		messages: {
			expectedSpaceBeforeQuestion:
				"Expected exactly one space before '?'.",
			expectedSpaceAfterQuestion: "Expected exactly one space after '?'.",
			expectedSpaceBeforeColon: "Expected exactly one space before ':'.",
			expectedSpaceAfterColon: "Expected exactly one space after ':'.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		//--------------------------------------------------------------------------
		// Helpers
		//--------------------------------------------------------------------------

		/**
		 * Checks whether the given token is the first token on its line.
		 * @param {Token} token The token to check.
		 * @returns {boolean} True if the token is the first on the line, false otherwise.
		 */
		function isFirstTokenOnLine(token) {
			const prev = sourceCode.getTokenBefore(token, {
				includeComments: true,
			});
			return !prev || prev.loc.end.line < token.loc.start.line;
		}

		//--------------------------------------------------------------------------
		// Public
		//--------------------------------------------------------------------------

		return {
			ConditionalExpression(node) {
				const questionToken = sourceCode.getTokenBefore(
					node.consequent,
					token => token.value === "?",
				);
				const beforeQuestion = sourceCode.getTokenBefore(questionToken);
				const afterQuestion = sourceCode.getTokenAfter(questionToken);

				const colonToken = sourceCode.getTokenBefore(
					node.alternate,
					token => token.value === ":",
				);
				const beforeColon = sourceCode.getTokenBefore(colonToken);
				const afterColon = sourceCode.getTokenAfter(colonToken);

				// Check space before '?'
				const spaceBeforeQ =
					questionToken.range[0] - beforeQuestion.range[1];
				if (!isFirstTokenOnLine(questionToken) && spaceBeforeQ !== 1) {
					context.report({
						node,
						loc: questionToken.loc,
						messageId: "expectedSpaceBeforeQuestion",
						fix: fixer =>
							fixer.replaceTextRange(
								[
									beforeQuestion.range[1],
									questionToken.range[0],
								],
								" ",
							),
					});
				}

				// Check space after '?'
				const spaceAfterQ =
					afterQuestion.range[0] - questionToken.range[1];
				if (spaceAfterQ !== 1) {
					context.report({
						node,
						loc: questionToken.loc,
						messageId: "expectedSpaceAfterQuestion",
						fix: fixer =>
							fixer.replaceTextRange(
								[
									questionToken.range[1],
									afterQuestion.range[0],
								],
								" ",
							),
					});
				}

				// Check space before ':'
				const spaceBeforeC = colonToken.range[0] - beforeColon.range[1];
				if (!isFirstTokenOnLine(colonToken) && spaceBeforeC !== 1) {
					context.report({
						node,
						loc: colonToken.loc,
						messageId: "expectedSpaceBeforeColon",
						fix: fixer =>
							fixer.replaceTextRange(
								[beforeColon.range[1], colonToken.range[0]],
								" ",
							),
					});
				}

				// Check space after ':'
				const spaceAfterC = afterColon.range[0] - colonToken.range[1];
				if (spaceAfterC !== 1) {
					context.report({
						node,
						loc: colonToken.loc,
						messageId: "expectedSpaceAfterColon",
						fix: fixer =>
							fixer.replaceTextRange(
								[colonToken.range[1], afterColon.range[0]],
								" ",
							),
					});
				}
			},
		};
	},
};
