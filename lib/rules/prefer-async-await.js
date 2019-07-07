/**
 * @fileoverview Prefer async/await over .then()
 * @author Elad Shahar
 * @author Alexander Lichter
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determine if a node is accessing a `then` property
 * @private
 * @param {ASTNode} node - node to test
 * @returns {boolean} True if `node` is a `then` property access
 */
function isThenPropertyAccess(node) {
    return node.property.type === "Identifier" && node.property.name === "then";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "require usage of async/await over .then()",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-async-await"
        },
        schema: [],
        messages: {
            unexpected: "Prefer using async/await over .then()."
        }
    },

    create(context) {
        return {
            MemberExpression(node) {
                if (isThenPropertyAccess(node)) {
                    context.report({ node: node.property, messageId: "unexpected" });
                }
            }
        };
    }
};
