/**
 * @fileoverview A rule to suggest using template literals instead of string concatenation.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the top binary expression node in parents of a given node.
 * @param {ASTNode} node - A node to get.
 * @returns {ASTNode} the top binary expression node in parents of a given node.
 */
function getTopBinaryExpression(node) {
    while (node.parent.type === "BinaryExpression") {
        node = node.parent;
    }
    return node;
}

/**
 * Checks whether or not a given binary expression has non literal.
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} `true` if the node has non literal.
 */
function hasNonLiteral(node) {
    if (node.type === "BinaryExpression") {
        return hasNonLiteral(node.left) || hasNonLiteral(node.right);
    }
    return node.type !== "Literal";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var done = Object.create(null);

    return {
        Program: function() {
            done = Object.create(null);
        },

        Literal: function(node) {
            if (typeof node.value !== "string" ||
                node.parent.type !== "BinaryExpression" ||
                node.parent.operator !== "+"
            ) {
                return;
            }

            var topBinaryExpr = getTopBinaryExpression(node.parent);

            // Checks whether or not this node had been checked already.
            if (done[topBinaryExpr.range[0]]) {
                return;
            }
            done[topBinaryExpr.range[0]] = true;

            if (hasNonLiteral(topBinaryExpr)) {
                context.report(
                    topBinaryExpr,
                    "Unexpected string concatenation.");
            }
        }
    };
};

module.exports.schema = [];
