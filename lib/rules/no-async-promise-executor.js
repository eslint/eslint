/**
 * @fileoverview disallow using an async function as a Promise executor
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determines whether a callee references the global Promise constructor.
 * @param {ASTNode} node The callee node to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} `true` if the callee references the global Promise constructor.
 */
function isGlobalPromiseCallee(node, sourceCode) {
	const callee = astUtils.skipChainExpression(node);

	if (callee.type === "Identifier") {
		return (
			callee.name === "Promise" && sourceCode.isGlobalReference(callee)
		);
	}

	return (
		callee.type === "MemberExpression" &&
		astUtils.isSpecificId(callee.object, "globalThis") &&
		sourceCode.isGlobalReference(callee.object) &&
		astUtils.getStaticPropertyName(callee) === "Promise"
	);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",

		docs: {
			description:
				"Disallow using an async function as a Promise executor",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-async-promise-executor",
		},

		fixable: null,
		schema: [],
		messages: {
			async: "Promise executor functions should not be async.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		return {
			NewExpression(node) {
				const [executor] = node.arguments;

				if (
					!executor?.async ||
					!isGlobalPromiseCallee(node.callee, sourceCode)
				) {
					return;
				}

				context.report({
					node: sourceCode.getFirstToken(
						node.arguments[0],
						token => token.value === "async",
					),
					messageId: "async",
				});
			},
		};
	},
};
