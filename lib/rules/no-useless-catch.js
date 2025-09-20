/**
 * @fileoverview Reports useless `catch` clauses that just rethrow their error.
 * @author Teddy Katz
 */

"use strict";

const astUtils = require("./utils/ast-utils");

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
							fix: fixer => fixer.remove(node),
						});
					} else {
						context.report({
							node: node.parent,
							messageId: "unnecessaryCatch",
							fix(fixer) {
								const tryBlock = node.parent.block;
								const sourceCode = context.sourceCode;
								const firstToken =
									sourceCode.getFirstToken(tryBlock);
								const lastToken =
									sourceCode.getLastToken(tryBlock);
								const isInStatementList =
									astUtils.STATEMENT_LIST_PARENTS.has(
										node.parent.parent.type,
									);

								if (isInStatementList) {
									// In statement list context, just remove the try-catch wrapper
									return fixer.replaceText(
										node.parent,
										sourceCode
											.getText()
											.slice(
												firstToken.range[1],
												lastToken.range[0],
											),
									);
								}

								/*
								 * In single statement context, wrap the remaining statements in braces
								 * to preserve the control flow
								 */
								const tryBlockText = sourceCode
									.getText()
									.slice(
										firstToken.range[1],
										lastToken.range[0],
									);
								return fixer.replaceText(
									node.parent,
									`{${tryBlockText}}`,
								);
							},
						});
					}
				}
			},
		};
	},
};
