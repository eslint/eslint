/**
 * @fileoverview disallow unncessary concatenation of template strings
 * @author Henry Zhu
 * @copyright 2015 Henry Zhu. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Get's the node's type if a Literal or string if a TemplateLiteral
 * @param {ASTNode} node - the node to check.
 * @returns {String} string
 */
function getType(node) {
    if (node.type === "Literal") {
        return typeof node.value;
    } else if (node.type === "TemplateLiteral") {
        return "string";
    }
}

/**
 * Checks whether or not a given binary expression has a string literal.
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} `true` if the node has a string literal.
 */
function hasStringLiteral(node) {
    if (node.type === "BinaryExpression") {
        return node.operator === "+" && (hasStringLiteral(node.left) || hasStringLiteral(node.right));
    }
    if (node.type === "UnaryExpression") {
        return false;
    }
    return getType(node) === "string";
}

/**
 * Get's the right most node on the left side of a BinaryExpression with + operator.
 * @param {ASTNode} node - A BinaryExpression node to check.
 * @returns {ASTNode} node
 */
function getLeft(node) {
    var left = node.left;
    while (left.type === "BinaryExpression" && left.operator === "+") {
        left = left.right;
    }
    return left;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    return {
        BinaryExpression: function(node) {
            // check if not concatenation
            if (node.operator !== "+") {
                return;
            }

            // account for the `foo + "a" + "b"` case
            var left = getLeft(node);
            var right = node.right;
            var leftWillBeString = hasStringLiteral(node.left);

            if (leftWillBeString && (left.type === "Literal" || left.type === "TemplateLiteral") &&
                (right.type === "Literal" || right.type === "TemplateLiteral")) {
                // check for multiline string concatenation
                if (left.loc.start.line !== right.loc.start.line) {
                    return;
                }

                // check for addition
                if (typeof left.value === "number" && typeof right.value === "number") {
                    return;
                }

                // move warning location to operator
                var operatorToken = context.getTokenAfter(left);
                while (operatorToken.value !== "+") {
                    operatorToken = context.getTokenAfter(operatorToken);
                }

                context.report(
                    node,
                    operatorToken.loc.start,
                    "Unexpected string concatenation of literals.");
            }
        }
    };

};

module.exports.schema = [];
