/**
 * @fileoverview A rule to disallow unnecessary `.call()` and `.apply()`.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

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
 * Checks whether or not `thisArg` is not changed by `.call()`/`.apply()`.
 * @param {ASTNode|null} expectedThis - The node that is the owner of the applied function.
 * @param {ASTNode} thisArg - The node that is given to the first argument of the `.call()`/`.apply()`.
 * @param {RuleContext} context - The ESLint rule context object.
 * @returns {boolean} Whether or not `thisArg` is not changed by `.call()`/`.apply()`.
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
            if (!isCallOrNonVariadicApply(node)) {
                return;
            }

            var applied = node.callee.object;
            var expectedThis = (applied.type === "MemberExpression") ? applied.object : null;
            var thisArg = node.arguments[0];

            if (isValidThisArg(expectedThis, thisArg, context)) {
                context.report(
                    node,
                    "unnecessary \".{{name}}()\".",
                    {name: node.callee.property.name});
            }
        }
    };
};

module.exports.schema = [];
