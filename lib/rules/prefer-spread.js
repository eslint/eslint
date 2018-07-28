/**
 * @fileoverview A rule to suggest using of the spread operator instead of `.apply()`.
 * @author Toru Nagashima
 */

"use strict";

const astUtils = require("../util/ast-utils");

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


/**
 * Checks whether or not `thisArg` is not changed by `.apply()`.
 * @param {ASTNode|null} expectedThis - The node that is the owner of the applied function.
 * @param {ASTNode} thisArg - The node that is given to the first argument of the `.apply()`.
 * @param {RuleContext} context - The ESLint rule context object.
 * @returns {boolean} Whether or not `thisArg` is not changed by `.apply()`.
 */
function isValidThisArg(expectedThis, thisArg, context) {
    if (!expectedThis) {
        return astUtils.isNullOrUndefined(thisArg);
    }
    return astUtils.equalTokens(expectedThis, thisArg, context);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require spread operators instead of `.apply()`",
            category: "ECMAScript 6",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-spread"
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

                if (isValidThisArg(expectedThis, thisArg, sourceCode)) {
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
