/**
 * @fileoverview Reports useless `catch` clauses that just rethrow their error.
 * @author Teddy Katz
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
			description: "Disallow unnecessary `catch` clauses",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-useless-catch",
		},

		fixable: "code",

		schema: [],

		messages: {
			unnecessaryCatchClause: "Unnecessary catch clause.",
			unnecessaryCatch: "Unnecessary try/catch wrapper.",
		},
	},

	create(context) {
		const { sourceCode } = context;

		return {
			CatchClause(node) {
				if (
					node.param &&
					node.param.type === "Identifier" &&
					node.body.body.length &&
					node.body.body[0].type === "ThrowStatement" &&
					node.body.body[0].argument.type === "Identifier" &&
					node.body.body[0].argument.name === node.param.name
				) {
					if (node.parent.finalizer) {
						context.report({
							node,
							messageId: "unnecessaryCatchClause",
							fix(fixer) {
								const tryBlock = node.parent.block;
								const tryBlockClose =
									sourceCode.getLastToken(tryBlock);
								const catchClose =
									sourceCode.getLastToken(node);

								return fixer.removeRange([
									tryBlockClose.range[1],
									catchClose.range[1],
								]);
							},
						});
					} else {
						context.report({
							node: node.parent,
							messageId: "unnecessaryCatch",
							fix(fixer) {
								const tryNode = node.parent;
								const tryBlock = tryNode.block;
								const openBrace =
									sourceCode.getFirstToken(tryBlock);
								const closeBrace =
									sourceCode.getLastToken(tryBlock);
								const innerText = sourceCode
									.getText()
									.slice(
										openBrace.range[1],
										closeBrace.range[0],
									);

								return fixer.replaceText(
									tryNode,
									innerText.trim(),
								);
							},
						});
					}
				}
			},
		};
	},
};
