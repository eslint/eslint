/**
 * @fileoverview Reports useless `catch` clauses that just rethrow their error.
 * @author Teddy Katz
 */

"use strict";

const astUtils = require("./utils/ast-utils");

/**
 * Tokens that continue the previous statement when they start an expression.
 * Same set as `no-else-return`: (, [, /, +, `, or -.
 */
const CONTINUATION_PATTERN = /^[([/+`-]/u;

/**
 * Checks whether an expression statement starts with a token that continues the previous statement.
 * @param {ASTNode} stmt The statement to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} `true` if the statement starts with `(`, `[`, `/`, `+`, `` ` ``, or `-`.
 */
function startsWithContinuationToken(stmt, sourceCode) {
	if (!stmt || stmt.type !== "ExpressionStatement") {
		return false;
	}

	const stmtFirstToken = sourceCode.getFirstToken(stmt);

	return CONTINUATION_PATTERN.test(stmtFirstToken.value);
}

/**
 * Returns the list of statements that contains a node.
 * `SwitchCase` stores that list on `consequent` rather than `body`.
 * @param {ASTNode} node A statement-list parent.
 * @returns {ASTNode[]} The statements.
 */
function getStatementList(node) {
	return node.type === "SwitchCase" ? node.consequent : node.body;
}

/**
 * Checks whether the fixer would delete a comment.
 * Comments inside the `try` block are kept. A `finally` block removes only the
 * `catch` clause, so comments outside that clause stay.
 * @param {SourceCode} sourceCode The source code object.
 * @param {ASTNode} catchNode The catch clause.
 * @returns {boolean} `true` if applying the fix would remove a comment.
 */
function hasCommentsThatWouldBeRemoved(sourceCode, catchNode) {
	if (sourceCode.getCommentsInside(catchNode).length > 0) {
		return true;
	}

	const tryStatement = catchNode.parent;

	// Only the catch clause is removed, so comments around the try block stay.
	if (tryStatement.finalizer) {
		return false;
	}

	const tryBlock = tryStatement.block;
	const openingBrace = sourceCode.getFirstToken(tryBlock);
	const closingBrace = sourceCode.getLastToken(tryBlock);

	return sourceCode
		.getCommentsInside(tryStatement)
		.some(
			comment =>
				comment.range[0] < openingBrace.range[1] ||
				comment.range[1] > closingBrace.range[0],
		);
}

/**
 * Checks whether the try block directly declares `using` or `await using`.
 * Unwrapping those changes when the resource is disposed, and it is a syntax
 * error at script top level or directly in a `case`.
 * @param {ASTNode} tryBlock The try block.
 * @returns {boolean} `true` if a direct using declaration is present.
 */
function hasDirectUsingDeclaration(tryBlock) {
	return tryBlock.body.some(
		statement =>
			statement.type === "VariableDeclaration" &&
			(statement.kind === "using" || statement.kind === "await using"),
	);
}

/**
 * Checks whether unwrapping the try block would turn a string into a directive.
 * This happens when the try is in a function or script, every statement before
 * it is a directive, and the try body starts with a string.
 * @param {ASTNode} tryStatement The try statement.
 * @param {ASTNode[]} statementList The list that contains the try statement.
 * @returns {boolean} `true` if unwrapping would extend the directive prologue.
 */
function wouldIntroduceDirective(tryStatement, statementList) {
	const parent = tryStatement.parent;
	const canHoldDirectives =
		parent.type === "Program" ||
		(parent.type === "BlockStatement" &&
			astUtils.isFunction(parent.parent));

	if (!canHoldDirectives) {
		return false;
	}

	const firstStatement = tryStatement.block.body[0];

	if (
		!firstStatement ||
		firstStatement.type !== "ExpressionStatement" ||
		firstStatement.expression.type !== "Literal" ||
		typeof firstStatement.expression.value !== "string"
	) {
		return false;
	}

	const index = statementList.indexOf(tryStatement);

	return statementList
		.slice(0, index)
		.every(statement => astUtils.isDirective(statement));
}

/**
 * Names declared directly in a block. Unwrapping the block moves these into the surrounding scope.
 * @param {Scope} scope The surrounding scope.
 * @param {ASTNode} block The block that would be removed.
 * @returns {string[]} The declared names.
 */
function getBlockBindingNames(scope, block) {
	const blockScope = scope.childScopes.find(
		({ block: blockNode }) => blockNode === block,
	);

	return blockScope ? blockScope.variables.map(({ name }) => name) : [];
}

/**
 * Checks whether the try block should stay wrapped so the fix keeps the same behavior.
 * @param {ASTNode} tryStatement The try statement.
 * @param {ASTNode[]} statementList The list that contains the try statement.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} `true` if the braces should be kept.
 */
function shouldKeepBlock(tryStatement, statementList, sourceCode) {
	const tryBlock = tryStatement.block;
	const index = statementList.indexOf(tryStatement);
	const nextStatement = statementList[index + 1];

	if (
		nextStatement &&
		tryStatement.loc.end.line === nextStatement.loc.start.line
	) {
		return true;
	}

	if (
		startsWithContinuationToken(tryBlock.body[0], sourceCode) ||
		startsWithContinuationToken(nextStatement, sourceCode)
	) {
		return true;
	}

	if (hasDirectUsingDeclaration(tryBlock)) {
		return true;
	}

	return wouldIntroduceDirective(tryStatement, statementList);
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
		/*
		 * Fixes in one pass are checked against the original scope, so two
		 * sibling tries can both look safe and then declare the same name.
		 * Track names already merged by an earlier fix in this pass.
		 */
		const claimedNames = new Map();

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
					const canFix =
						node.body.body.length === 1 &&
						!hasCommentsThatWouldBeRemoved(sourceCode, node);

					if (node.parent.finalizer) {
						context.report({
							node,
							messageId: "unnecessaryCatchClause",
							fix: canFix ? fixer => fixer.remove(node) : null,
						});
					} else {
						context.report({
							node: node.parent,
							messageId: "unnecessaryCatch",
							fix: canFix
								? function (fixer) {
										const tryStatement = node.parent;
										const tryBlock = tryStatement.block;
										const currentScope =
											sourceCode.getScope(tryStatement);

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
										const parent = tryStatement.parent;
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

										// Not a statement list, or unwrapping would change behavior.
										if (
											!isInStatementList ||
											shouldKeepBlock(
												tryStatement,
												getStatementList(parent),
												sourceCode,
											)
										) {
											return fixer.replaceText(
												tryStatement,
												`{${tryBlockText}}`,
											);
										}

										const names = getBlockBindingNames(
											currentScope,
											tryBlock,
										);
										const claimed =
											claimedNames.get(currentScope) ||
											new Set();

										/*
										 * An earlier fix in this pass already
										 * merges one of these names. Keep the
										 * braces so the name stays in its block.
										 */
										if (
											names.some(name =>
												claimed.has(name),
											)
										) {
											return fixer.replaceText(
												tryStatement,
												`{${tryBlockText}}`,
											);
										}

										names.forEach(name =>
											claimed.add(name),
										);
										claimedNames.set(currentScope, claimed);

										return fixer.replaceText(
											tryStatement,
											tryBlockText,
										);
									}
								: null,
						});
					}
				}
			},
		};
	},
};
