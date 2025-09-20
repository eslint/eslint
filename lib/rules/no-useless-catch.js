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
								const tryBlockText = sourceCode
									.getText()
									.slice(
										firstToken.range[1],
										lastToken.range[0],
									);

								// Check if the next sibling is on the same line
								const parent = node.parent.parent;
								let isNextSiblingOnSameLine = false;

								// Check for next sibling if we're in a statement list
								if (parent.body && Array.isArray(parent.body)) {
									const tryStatementIndex =
										parent.body.indexOf(node.parent);
									const nextSibling =
										parent.body[tryStatementIndex + 1];
									if (nextSibling) {
										isNextSiblingOnSameLine =
											astUtils.isTokenOnSameLine(
												lastToken,
												firstToken,
											);
									}
								}

								if (
									isInStatementList &&
									!isNextSiblingOnSameLine
								) {
									return fixer.replaceText(
										node.parent,
										`${tryBlockText}`,
									);
								}

								/*
								 * In single statement context, wrap the remaining statements in braces
								 * to preserve the control flow
								 */
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
