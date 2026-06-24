/**
 * @fileoverview Rule to enforce description with the `Symbol` object
 * @author Jarek Rencz
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
 * Determines whether a callee references globalThis.Symbol.
 * @param {ASTNode} node The callee node to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {boolean} `true` if the callee references globalThis.Symbol.
 */
function isGlobalThisSymbolCallee(node, sourceCode) {
	const callee = astUtils.skipChainExpression(node);

	return (
		callee.type === "MemberExpression" &&
		astUtils.isSpecificId(callee.object, "globalThis") &&
		sourceCode.isGlobalReference(callee.object) &&
		astUtils.getStaticPropertyName(callee) === "Symbol"
	);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "suggestion",

		docs: {
			description: "Require symbol descriptions",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/symbol-description",
		},
		fixable: null,
		schema: [],
		messages: {
			expected: "Expected Symbol to have a description.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		/**
		 * Reports if node does not conform the rule in case rule is set to
		 * report missing description
		 * @param {ASTNode} node A CallExpression node to check.
		 * @returns {void}
		 */
		function checkArgument(node) {
			if (node.arguments.length === 0) {
				context.report({
					node,
					messageId: "expected",
				});
			}
		}

		return {
			CallExpression(node) {
				if (isGlobalThisSymbolCallee(node.callee, sourceCode)) {
					checkArgument(node);
				}
			},

			"Program:exit"(node) {
				const scope = sourceCode.getScope(node);
				const variable = astUtils.getVariableByName(scope, "Symbol");

				if (variable && variable.defs.length === 0) {
					variable.references.forEach(reference => {
						const idNode = reference.identifier;

						if (astUtils.isCallee(idNode)) {
							checkArgument(idNode.parent);
						}
					});
				}
			},
		};
	},
};
