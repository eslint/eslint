/**
 * @fileoverview A rule to disallow unnecessary `.call()` and `.apply()`.
 * @author Toru Nagashima
 */

"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a node is a `.call()`/`.apply()`.
 * @param {ASTNode} node - A CallExpression node to check.
 * @returns {boolean} Whether or not the node is a `.call()`/`.apply()`.
 */
function isCallOrNonVariadicApply(node) {
    return (
        node.callee.type === "MemberExpression" &&
        node.callee.property.type === "Identifier" &&
        node.callee.computed === false &&
        (
            (node.callee.property.name === "call" && node.arguments.length >= 1) ||
            (node.callee.property.name === "apply" && node.arguments.length === 2 && node.arguments[1].type === "ArrayExpression")
        )
    );
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow unnecessary calls to `.call()` and `.apply()`",
            category: "Best Practices",
            recommended: false
        },

        schema: []
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            CallExpression(node) {
                if (!isCallOrNonVariadicApply(node)) {
                    return;
                }

                const applied = node.callee.object;
                const expectedThis = (applied.type === "MemberExpression") ? applied.object : null;
                const thisArg = node.arguments[0];

                if (astUtils.isValidThisArg(expectedThis, thisArg, sourceCode)) {
                    context.report({ node, message: "unnecessary '.{{name}}()'.", data: { name: node.callee.property.name } });
                }
            }
        };
    }
};
