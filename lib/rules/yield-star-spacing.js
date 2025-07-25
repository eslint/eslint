/**
 * @fileoverview Rule to check the spacing around the * in yield* expressions.
 * @author Bryan Smith
 * @deprecated in ESLint v8.53.0
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		deprecated: {
			message: "Formatting rules are being moved out of ESLint core.",
			url: "https://eslint.org/blog/2023/10/deprecating-formatting-rules/",
			deprecatedSince: "8.53.0",
			availableUntil: "10.0.0",
			replacedBy: [
				{
					message:
						"ESLint Stylistic now maintains deprecated stylistic core rules.",
					url: "https://eslint.style/guide/migration",
					plugin: {
						name: "@stylistic/eslint-plugin",
						url: "https://eslint.style",
					},
					rule: {
						name: "yield-star-spacing",
						url: "https://eslint.style/rules/yield-star-spacing",
					},
				},
			],
		},
		type: "layout",

		docs: {
			description:
				"Require or disallow spacing around the `*` in `yield*` expressions",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/yield-star-spacing",
		},

		fixable: "whitespace",

		schema: [
			{
				oneOf: [
					{
						enum: ["before", "after", "both", "neither"],
					},
					{
						type: "object",
						properties: {
							before: { type: "boolean" },
							after: { type: "boolean" },
						},
						additionalProperties: false,
					},
				],
			},
		],
		messages: {
			missingBefore: "Missing space before *.",
			missingAfter: "Missing space after *.",
			unexpectedBefore: "Unexpected space before *.",
			unexpectedAfter: "Unexpected space after *.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		const mode = (function (option) {
			if (!option || typeof option === "string") {
				return {
					before: { before: true, after: false },
					after: { before: false, after: true },
					both: { before: true, after: true },
					neither: { before: false, after: false },
				}[option || "after"];
			}
			return option;
		})(context.options[0]);

		/**
		 * Checks the spacing between two tokens before or after the star token.
		 * @param {string} side Either "before" or "after".
		 * @param {Token} leftToken `function` keyword token if side is "before", or
		 *     star token if side is "after".
		 * @param {Token} rightToken Star token if side is "before", or identifier
		 *     token if side is "after".
		 * @returns {void}
		 */
		function checkSpacing(side, leftToken, rightToken) {
			if (
				sourceCode.isSpaceBetweenTokens(leftToken, rightToken) !==
				mode[side]
			) {
				const after = leftToken.value === "*";
				const spaceRequired = mode[side];
				const node = after ? leftToken : rightToken;
				let messageId;

				if (spaceRequired) {
					messageId =
						side === "before" ? "missingBefore" : "missingAfter";
				} else {
					messageId =
						side === "before"
							? "unexpectedBefore"
							: "unexpectedAfter";
				}

				context.report({
					node,
					messageId,
					fix(fixer) {
						if (spaceRequired) {
							if (after) {
								return fixer.insertTextAfter(node, " ");
							}
							return fixer.insertTextBefore(node, " ");
						}
						return fixer.removeRange([
							leftToken.range[1],
							rightToken.range[0],
						]);
					},
				});
			}
		}

		/**
		 * Enforces the spacing around the star if node is a yield* expression.
		 * @param {ASTNode} node A yield expression node.
		 * @returns {void}
		 */
		function checkExpression(node) {
			if (!node.delegate) {
				return;
			}

			const tokens = sourceCode.getFirstTokens(node, 3);
			const yieldToken = tokens[0];
			const starToken = tokens[1];
			const nextToken = tokens[2];

			checkSpacing("before", yieldToken, starToken);
			checkSpacing("after", starToken, nextToken);
		}

		return {
			YieldExpression: checkExpression,
		};
	},
};
