/**
 * @fileoverview Rule to flag nested ternary expressions
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description: "Disallow nested ternary expressions",
			recommended: false,
			frozen: true,
			url: "https://eslint.org/docs/latest/rules/no-nested-ternary",
		},

		messages: {
			noNestedTernary: "Do not nest ternary expressions.",
		},

		schema: [
			{
				type: "object",
				properties: {
					allowConditionalType: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],

		defaultOptions: [
			{
				allowConditionalType: false,
			},
		],

		language: "javascript",

		dialects: ["javascript", "typescript"],
	},

	create(context) {
		const [{ allowConditionalType }] = context.options;

		return {
			ConditionalExpression(node) {
				if (
					node.alternate.type === "ConditionalExpression" ||
					node.consequent.type === "ConditionalExpression"
				) {
					context.report({
						node,
						messageId: "noNestedTernary",
					});
				}
			},

			TSConditionalType(node) {
				if (!allowConditionalType) {
					return;
				}

				if (
					node.falseType.type === "TSConditionalType" ||
					node.trueType.type === "TSConditionalType"
				) {
					context.report({
						node,
						messageId: "noNestedTernary",
					});
				}
			},
		};
	},
};
