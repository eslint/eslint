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
					const sourceCode = context.sourceCode;
					const hasComments =
						sourceCode.getCommentsInside(node).length > 0;

					if (node.parent.finalizer) {
						context.report({
							node,
							messageId: "unnecessaryCatchClause",
							fix: hasComments
								? null
								: fixer => fixer.remove(node),
						});
					} else {
						context.report({
							node: node.parent,
							messageId: "unnecessaryCatch",
							fix: hasComments
								? null
									: function (fixer) {
										const tryBlock = node.parent.block;
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
										if (
											parent.body &&
											Array.isArray(parent.body)
										) {
											const tryStatementIndex =
												parent.body.indexOf(
													node.parent,
												);
											const nextSibling =
												parent.body[
													tryStatementIndex + 1
												];
											if (nextSibling) {
												isNextSiblingOnSameLine =
													astUtils.isTokenOnSameLine(
														lastToken,
														firstToken,
													);
											}
										}

										/*
										 * Check if removing the try-catch block would create ASI issues
										 */
										let wouldCreateASI = false;
										if (isInStatementList && !isNextSiblingOnSameLine) {
											/*
											 * Check if the try block starts with an array literal or object literal
											 * that could be misinterpreted due to ASI
											 */
											const tryBlockFirstStatement = tryBlock.body[0];
											if (tryBlockFirstStatement && tryBlockFirstStatement.type === "ExpressionStatement") {
												const tryFirstToken = sourceCode.getFirstToken(tryBlockFirstStatement);
												
												// Check if the try block starts with [ or { which could cause ASI issues
												if (tryFirstToken.value === "[" || tryFirstToken.value === "{") {
													// Check if the previous statement could be continued
													const prevStatement = parent.body[parent.body.indexOf(node.parent) - 1];
													if (prevStatement) {
														const prevLastToken = sourceCode.getLastToken(prevStatement);
														
														/*
														 * If the previous statement doesn't end with a semicolon and
														 * the try block starts with [ or {, it could create ASI issues
														 */
														if (prevLastToken.type !== "Punctuator" || prevLastToken.value !== ";") {
															wouldCreateASI = true;
														}
													}
												}
											}
											
											/*
											 * Also check if the next statement after the try-catch starts with [ or {
											 * which could cause ASI issues when the try block doesn't end with semicolon
											 */
											if (!wouldCreateASI) {
												const tryStatementIndex = parent.body.indexOf(node.parent);
												const nextStatement = parent.body[tryStatementIndex + 1];
												if (nextStatement && nextStatement.type === "ExpressionStatement") {
													const nextFirstToken = sourceCode.getFirstToken(nextStatement);
													if (nextFirstToken.value === "[" || nextFirstToken.value === "{") {
														// Check if the try block's last statement doesn't end with semicolon
														const tryLastStatement = tryBlock.body.at(-1);
														if (tryLastStatement && tryLastStatement.type === "ExpressionStatement") {
															const tryLastToken = sourceCode.getLastToken(tryLastStatement);
															if (tryLastToken.type !== "Punctuator" || tryLastToken.value !== ";") {
																wouldCreateASI = true;
															}
														}
													}
												}
											}
										}

										if (
											isInStatementList &&
											!isNextSiblingOnSameLine &&
											!wouldCreateASI
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
