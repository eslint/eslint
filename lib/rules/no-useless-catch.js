/**
 * @fileoverview Reports useless `catch` clauses that just rethrow their error.
 * @author Teddy Katz
 */

"use strict";

const astUtils = require("./utils/ast-utils");

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
										const currentScope =
											sourceCode.getScope(node.parent);

										// Check for name collisions before applying fix
										if (
											!astUtils.isSafeFromNameCollisions(
												tryBlock,
												currentScope,
											)
										) {
											return null;
										}

										const firstToken =
											sourceCode.getFirstToken(tryBlock);
										const lastToken =
											sourceCode.getLastToken(tryBlock);
										const parent = node.parent.parent;
										const isInStatementList =
											astUtils.STATEMENT_LIST_PARENTS.has(
												parent.type,
											);
										const tryBlockText = sourceCode
											.getText()
											.slice(
												firstToken.range[1],
												lastToken.range[0],
											);

										// If not in a statement list, wrap in braces to preserve control flow
										if (!isInStatementList) {
											return fixer.replaceText(
												node.parent,
												`{${tryBlockText}}`,
											);
										}

										const tryStatementIndex =
											parent.body.indexOf(node.parent);
										const nextStatement =
											parent.body[tryStatementIndex + 1];

										/*
										 * If the next statement is on the same line as the try-catch,
										 * we need to wrap in braces to avoid parsing issues
										 */
										if (
											nextStatement &&
											node.parent.loc.end.line ===
												nextStatement.loc.start.line
										) {
											return fixer.replaceText(
												node.parent,
												`{${tryBlockText}}`,
											);
										}

										// Check if try block or next statement starts with [ or {
										if (
											startsWithBracketOrBrace(
												tryBlock.body[0],
												sourceCode,
											) ||
											startsWithBracketOrBrace(
												nextStatement,
												sourceCode,
											)
										) {
											return fixer.replaceText(
												node.parent,
												`{${tryBlockText}}`,
											);
										}

										return fixer.replaceText(
											node.parent,
											tryBlockText,
										);
									},
						});
					}
				}
			},
		};
	},
};
