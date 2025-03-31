/**
 * @fileoverview Rule to disallow empty functions.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALLOW_OPTIONS = Object.freeze([
	"functions",
	"arrowFunctions",
	"generatorFunctions",
	"methods",
	"generatorMethods",
	"getters",
	"setters",
	"constructors",
	"asyncFunctions",
	"asyncMethods",
	"privateConstructors",
	"protectedConstructors",
	"decoratedFunctions",
	"overrideMethods",
]);

/**
 * Gets the kind of a given function node.
 * @param {ASTNode} node A function node to get. This is one of
 *      an ArrowFunctionExpression, a FunctionDeclaration, or a
 *      FunctionExpression.
 * @returns {string} The kind of the function. This is one of "functions",
 *      "arrowFunctions", "generatorFunctions", "asyncFunctions", "methods",
 *      "generatorMethods", "asyncMethods", "getters", "setters", "constructors",
 *      "privateConstructors", "protectedConstructors", "decoratedFunctions", or
 *      "overrideMethods".
 */
function getKind(node) {
	const parent = node.parent;
	let kind;

	if (node.type === "ArrowFunctionExpression") {
		return "arrowFunctions";
	}

	// Detects main kind.
	if (parent.type === "Property") {
		if (parent.kind === "get") {
			return "getters";
		}
		if (parent.kind === "set") {
			return "setters";
		}
		kind = parent.method ? "methods" : "functions";
	} else if (parent.type === "MethodDefinition") {
		if (parent.kind === "get") {
			return "getters";
		}
		if (parent.kind === "set") {
			return "setters";
		}
		if (parent.kind === "constructor") {
			if (parent.accessibility === "private") {
				return "privateConstructors";
			}
			if (parent.accessibility === "protected") {
				return "protectedConstructors";
			}
			return "constructors";
		}

		if (parent.override) {
			return "overrideMethods";
		}

		if (parent.decorators?.length > 0) {
			return "decoratedFunctions";
		}

		kind = "methods";
	} else {
		kind = "functions";
	}

	// Detects prefix.
	let prefix;

	if (node.generator) {
		prefix = "generator";
	} else if (node.async) {
		prefix = "async";
	} else {
		return kind;
	}
	return prefix + kind[0].toUpperCase() + kind.slice(1);
}

/**
 * Checks if a constructor function has parameter properties.
 * @param {ASTNode} node The function node to examine.
 * @returns {boolean} True if the constructor has parameter properties, false otherwise.
 */
function isParameterPropertiesConstructor(node) {
	return node.params.some(param => param.type === "TSParameterProperty");
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		dialects: ["javascript", "typescript"],
		language: "javascript",
		type: "suggestion",

		defaultOptions: [{ allow: [] }],

		docs: {
			description: "Disallow empty functions",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-empty-function",
		},

		schema: [
			{
				type: "object",
				properties: {
					allow: {
						type: "array",
						items: { enum: ALLOW_OPTIONS },
						uniqueItems: true,
					},
				},
				additionalProperties: false,
			},
		],

		messages: {
			unexpected: "Unexpected empty {{name}}.",
		},
	},

	create(context) {
		const [{ allow }] = context.options;
		const sourceCode = context.sourceCode;

		/**
		 * Reports a given function node if the node matches the following patterns.
		 *
		 * - Not allowed by options.
		 * - The body is empty.
		 * - The body doesn't have any comments.
		 * @param {ASTNode} node A function node to report. This is one of
		 *      an ArrowFunctionExpression, a FunctionDeclaration, or a
		 *      FunctionExpression.
		 * @returns {void}
		 */
		function reportIfEmpty(node) {
			const kind = getKind(node);
			const name = astUtils.getFunctionNameWithKind(node);
			const innerComments = sourceCode.getTokens(node.body, {
				includeComments: true,
				filter: astUtils.isCommentToken,
			});

			const isAllowed =
				allow.includes(kind) ||
				(kind === "privateConstructors" &&
					allow.includes("constructors")) ||
				(kind === "protectedConstructors" &&
					allow.includes("constructors")) ||
				(kind === "decoratedFunctions" && allow.includes("methods")) ||
				(kind === "overrideMethods" && allow.includes("methods"));

			if (
				!isAllowed &&
				node.body.type === "BlockStatement" &&
				node.body.body.length === 0 &&
				innerComments.length === 0 &&
				!isParameterPropertiesConstructor(node)
			) {
				context.report({
					node,
					loc: node.body.loc,
					messageId: "unexpected",
					data: { name },
				});
			}
		}

		return {
			ArrowFunctionExpression: reportIfEmpty,
			FunctionDeclaration: reportIfEmpty,
			FunctionExpression: reportIfEmpty,
		};
	},
};
