/**
 * @fileoverview A rule to suggest using of the spread operator instead of `.apply()`.
 * @author Toru Nagashima
 */

"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a node is a `.apply()` for variadic.
 * @param {ASTNode} node - A CallExpression node to check.
 * @returns {boolean} Whether or not the node is a `.apply()` for variadic.
 */
function isVariadicApplyCalling(node) {
    return (
        node.callee.type === "MemberExpression" &&
        node.callee.property.type === "Identifier" &&
        node.callee.property.name === "apply" &&
        node.callee.computed === false &&
        node.arguments.length === 2 &&
        node.arguments[1].type !== "ArrayExpression" &&
        node.arguments[1].type !== "SpreadElement"
    );
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require spread operators instead of `.apply()`",
            category: "ECMAScript 6",
            recommended: false
        },

        schema: [],

        fixable: "code"
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            CallExpression(node) {
                if (!isVariadicApplyCalling(node)) {
                    return;
                }

                const applied = node.callee.object;
                const expectedThis = (applied.type === "MemberExpression") ? applied.object : null;
                const thisArg = node.arguments[0];

                if (astUtils.isValidThisArg(expectedThis, thisArg, sourceCode)) {
                    context.report({
                        node,
                        message: "Use the spread operator instead of '.apply()'.",
                        fix(fixer) {
                            if (expectedThis && expectedThis.type !== "Identifier") {

                                // Don't fix cases where the `this` value could be a computed expression.
                                return null;
                            }

                            const propertyDot = sourceCode.getFirstTokenBetween(applied, node.callee.property, token => token.value === ".");

                            return fixer.replaceTextRange([propertyDot.range[0], node.range[1]], `(...${sourceCode.getText(node.arguments[1])})`);
                        }
                    });
                }
            }
        };
    }
};
