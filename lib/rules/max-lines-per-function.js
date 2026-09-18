/**
 * @fileoverview A rule to set the maximum number of line of code in a function.
 * @author Pete Ward <peteward44@gmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");
const { upperCaseFirst } = require("../shared/string-utils");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const OPTIONS_SCHEMA = {
	type: "object",
	properties: {
		max: {
			type: "integer",
			minimum: 0,
		},
		skipComments: {
			type: "boolean",
		},
		skipBlankLines: {
			type: "boolean",
		},
		IIFEs: {
			type: "boolean",
		},
	},
	additionalProperties: false,
};

const OPTIONS_OR_INTEGER_SCHEMA = {
	oneOf: [
		OPTIONS_SCHEMA,
		{
			type: "integer",
			minimum: 1,
		},
	],
};

/**
 * Gets the numbers of the lines that contain nothing but comments and whitespace.
 * @param {SourceCode} sourceCode The source code.
 * @returns {Set<number>} The numbers of the comment-only lines.
 */
function getCommentOnlyLines(sourceCode) {
	const codeLines = new Set();

	for (const token of sourceCode.ast.tokens) {
		for (
			let line = token.loc.start.line;
			line <= token.loc.end.line;
			line++
		) {
			codeLines.add(line);
		}
	}

	const commentOnlyLines = new Set();

	for (const comment of sourceCode.getAllComments()) {
		for (
			let line = comment.loc.start.line;
			line <= comment.loc.end.line;
			line++
		) {
			if (!codeLines.has(line)) {
				commentOnlyLines.add(line);
			}
		}
	}

	return commentOnlyLines;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description:
				"Enforce a maximum number of lines of code in a function",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/max-lines-per-function",
		},

		schema: [OPTIONS_OR_INTEGER_SCHEMA],

		defaultOptions: [50],

		messages: {
			exceed: "{{name}} has too many lines ({{lineCount}}). Maximum allowed is {{maxLines}}.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const lines = sourceCode.lines;

		const option = context.options[0];
		let maxLines = 50;
		let skipComments = false;
		let skipBlankLines = false;
		let IIFEs = false;

		if (typeof option === "object") {
			maxLines = typeof option.max === "number" ? option.max : 50;
			skipComments = !!option.skipComments;
			skipBlankLines = !!option.skipBlankLines;
			IIFEs = !!option.IIFEs;
		} else if (typeof option === "number") {
			maxLines = option;
		}

		const commentOnlyLines = skipComments
			? getCommentOnlyLines(sourceCode)
			: null;

		//--------------------------------------------------------------------------
		// Helpers
		//--------------------------------------------------------------------------

		/**
		 * Identifies is a node is a FunctionExpression which is part of an IIFE
		 * @param {ASTNode} node Node to test
		 * @returns {boolean} True if it's an IIFE
		 */
		function isIIFE(node) {
			return (
				(node.type === "FunctionExpression" ||
					node.type === "ArrowFunctionExpression") &&
				node.parent &&
				node.parent.type === "CallExpression" &&
				node.parent.callee === node
			);
		}

		/**
		 * Identifies is a node is a FunctionExpression which is embedded within a MethodDefinition or Property
		 * @param {ASTNode} node Node to test
		 * @returns {boolean} True if it's a FunctionExpression embedded within a MethodDefinition or Property
		 */
		function isEmbedded(node) {
			if (!node.parent) {
				return false;
			}
			if (node !== node.parent.value) {
				return false;
			}
			if (node.parent.type === "MethodDefinition") {
				return true;
			}
			if (node.parent.type === "Property") {
				return (
					node.parent.method === true ||
					node.parent.kind === "get" ||
					node.parent.kind === "set"
				);
			}
			return false;
		}

		/**
		 * Count the lines in the function
		 * @param {ASTNode} funcNode Function AST node
		 * @returns {void}
		 * @private
		 */
		function processFunction(funcNode) {
			const node = isEmbedded(funcNode) ? funcNode.parent : funcNode;

			if (!IIFEs && isIIFE(node)) {
				return;
			}
			let lineCount = 0;

			for (let i = node.loc.start.line - 1; i < node.loc.end.line; ++i) {
				if (skipComments && commentOnlyLines.has(i + 1)) {
					continue;
				}

				if (skipBlankLines && /^\s*$/u.test(lines[i])) {
					continue;
				}

				lineCount++;
			}

			if (lineCount > maxLines) {
				const name = upperCaseFirst(
					astUtils.getFunctionNameWithKind(funcNode),
				);

				context.report({
					node,
					loc: astUtils.getFunctionHeadLoc(funcNode, sourceCode),
					messageId: "exceed",
					data: { name, lineCount, maxLines },
				});
			}
		}

		//--------------------------------------------------------------------------
		// Public API
		//--------------------------------------------------------------------------

		return {
			FunctionDeclaration: processFunction,
			FunctionExpression: processFunction,
			ArrowFunctionExpression: processFunction,
		};
	},
};
