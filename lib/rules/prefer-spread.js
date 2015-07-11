/**
 * @fileoverview A rule to suggest using of the spread operator instead of `.apply()`.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether or not a node is a `.apply()`.
 * @param {ASTNode} node - A CallExpression node to check.
 * @returns {boolean} Whether or not the node is a `.apply()`.
 */
function isApplyCalling(node) {
    return (
        node.callee.type === "MemberExpression" &&
        node.callee.property.type === "Identifier" &&
        node.callee.property.name === "apply" &&
        node.callee.computed === false &&
        node.arguments.length === 2
    );
}

/**
 * Checks whether or not a node is `null` or `undefined`.
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} Whether or not the node is a `null` or `undefined`.
 */
function isNullOrUndefined(node) {
    return (
        (node.type === "Literal" && node.value === null) ||
        (node.type === "Identifier" && node.name === "undefined") ||
        (node.type === "UnaryExpression" && node.operator === "void")
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
    if (expectedThis == null) {
        return isNullOrUndefined(thisArg);
    }
    return context.getSource(expectedThis) === context.getSource(thisArg);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    return {
        "CallExpression": function(node) {
            if (!isApplyCalling(node)) {
                return;
            }

            var applied = node.callee.object;
            var expectedThis = (applied.type === "MemberExpression") ? applied.object : null;
            var thisArg = node.arguments[0];

            if (isValidThisArg(expectedThis, thisArg, context)) {
                context.report(node, "use the spread operator instead of the \".apply()\".");
            }
        }
    };
};

module.exports.schema = [];
