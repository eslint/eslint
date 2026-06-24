/**
 * @fileoverview Rule to disallow use of the new operator with global non-constructor functions
 * @author Sosuke Suzuki
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const nonConstructorGlobalFunctionNames = ["Symbol", "BigInt"];

/**
 * Gets the non-constructor global name when a constructor call uses globalThis.
 * @param {ASTNode} node A callee node to check.
 * @param {SourceCode} sourceCode The source code object.
 * @returns {string|null} The non-constructor global name.
 */
function getGlobalThisNonConstructorName(node, sourceCode) {
	const callee = astUtils.skipChainExpression(node);

	if (
		callee.type !== "MemberExpression" ||
		!astUtils.isSpecificId(callee.object, "globalThis") ||
		!sourceCode.isGlobalReference(callee.object)
	) {
		return null;
	}

	const propertyName = astUtils.getStaticPropertyName(callee);

	return nonConstructorGlobalFunctionNames.includes(propertyName)
		? propertyName
		: null;
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
				"Disallow `new` operators with global non-constructor functions",
			recommended: true,
			url: "https://eslint.org/docs/latest/rules/no-new-native-nonconstructor",
		},

		schema: [],

		messages: {
			noNewNonconstructor:
				"`{{name}}` cannot be called as a constructor.",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;

		return {
			NewExpression(node) {
				const nonConstructorName = getGlobalThisNonConstructorName(
					node.callee,
					sourceCode,
				);

				if (nonConstructorName) {
					context.report({
						node: node.callee,
						messageId: "noNewNonconstructor",
						data: { name: nonConstructorName },
					});
				}
			},

			"Program:exit"(node) {
				const globalScope = sourceCode.getScope(node);

				for (const nonConstructorName of nonConstructorGlobalFunctionNames) {
					const variable = globalScope.set.get(nonConstructorName);

					if (variable && variable.defs.length === 0) {
						variable.references.forEach(ref => {
							const idNode = ref.identifier;
							const parent = idNode.parent;

							if (
								parent &&
								parent.type === "NewExpression" &&
								parent.callee === idNode
							) {
								context.report({
									node: idNode,
									messageId: "noNewNonconstructor",
									data: { name: nonConstructorName },
								});
							}
						});
					}
				}
			},
		};
	},
};
