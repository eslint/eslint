/**
 * @fileoverview Reports useless `catch` clauses that just rethrow their error.
 * @author Teddy Katz
 */

"use strict";

const astUtils = require("./utils/ast-utils");

/**
 * Helper function to check if a statement ends with semicolon
 * @param {ASTNode} stmt The statement to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} True if the statement ends with a semicolon.
 */
function endsWithSemicolon(stmt, sourceCode) {
	if (!stmt || stmt.type !== "ExpressionStatement") {
		return false;
	}
	const stmtLastToken = sourceCode.getLastToken(stmt);
	return stmtLastToken.type === "Punctuator" && stmtLastToken.value === ";";
}

/**
 * Helper function to check if a statement starts with [ or {
 * @param {ASTNode} stmt The statement to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} True if the statement starts with [ or {.
 */
function startsWithBracketOrBrace(stmt, sourceCode) {
	if (!stmt || stmt.type !== "ExpressionStatement") {
		return false;
	}
	const stmtFirstToken = sourceCode.getFirstToken(stmt);
	return stmtFirstToken.value === "[" || stmtFirstToken.value === "{";
}

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
											const tryStatementIndex = parent.body.indexOf(node.parent);
											const prevStatement = parent.body[tryStatementIndex - 1];
											const nextStatement = parent.body[tryStatementIndex + 1];

											// Check if try block starts with [ or { and previous statement doesn't end with semicolon
											if (startsWithBracketOrBrace(tryBlock.body[0], sourceCode) && !endsWithSemicolon(prevStatement, sourceCode)) {
												wouldCreateASI = true;
											}
											
											// Check if next statement starts with [ or { and try block doesn't end with semicolon
											if (!wouldCreateASI && startsWithBracketOrBrace(nextStatement, sourceCode) && !endsWithSemicolon(tryBlock.body.at(-1), sourceCode)) {
												wouldCreateASI = true;
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
