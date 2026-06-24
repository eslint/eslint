/**
 * @fileoverview Rule to flag when using constructor for wrapper objects
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const wrapperObjects = new Set(["String", "Number", "Boolean"]);

/**
 * Gets a wrapper object name from a globalThis member expression.
 * @param {ASTNode} node The callee node to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {string|null} The wrapper object name.
 */
function getGlobalThisWrapperName(node, sourceCode) {
	const callee = astUtils.skipChainExpression(node);

	if (
		callee.type !== "MemberExpression" ||
		!astUtils.isSpecificId(callee.object, "globalThis") ||
		!sourceCode.isGlobalReference(callee.object)
	) {
		return null;
	}

	const propertyName = astUtils.getStaticPropertyName(callee);

	return wrapperObjects.has(propertyName) ? propertyName : null;
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
				"Disallow `new` operators with the `String`, `Number`, and `Boolean` objects",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/no-new-wrappers",
		},

		schema: [],

		messages: {
			noConstructor: "Do not use {{fn}} as a constructor.",
		},
	},

	create(context) {
		const { sourceCode } = context;

		return {
			NewExpression(node) {
				const callee = astUtils.skipChainExpression(node.callee);
				const globalThisWrapperName = getGlobalThisWrapperName(
					callee,
					sourceCode,
				);

				if (globalThisWrapperName) {
					context.report({
						node,
						messageId: "noConstructor",
						data: { fn: globalThisWrapperName },
					});
					return;
				}

				if (
					callee.type === "Identifier" &&
					wrapperObjects.has(callee.name)
				) {
					const variable = astUtils.getVariableByName(
						sourceCode.getScope(node),
						callee.name,
					);

					if (variable && variable.identifiers.length === 0) {
						context.report({
							node,
							messageId: "noConstructor",
							data: { fn: callee.name },
						});
					}
				}
			},
		};
	},
};
