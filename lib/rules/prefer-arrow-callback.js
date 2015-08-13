/**
 * @fileoverview A rule to suggest using arrow functions as callbacks.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checkes whether or not a given node is a callback.
 * @param {ASTNode} node - A node to check.
 * @returns {object}
 *   {boolean} retv.isCallback - `true` if the node is a callback.
 *   {boolean} retv.isLexicalThis - `true` if the node is with `.bind(this)`.
 */
function getCallbackInfo(node) {
    var retv = {isCallback: false, isLexicalThis: false};
    var parent = node.parent;
    while (node != null) {
        switch (parent.type) {
            // Checks parents recursively.
            case "LogicalExpression":
            case "ConditionalExpression":
                break;

            // Checks whether the parent node is `.bind(this)` call.
            case "MemberExpression":
                if (parent.object === node &&
                    !parent.property.computed &&
                    parent.property.type === "Identifier" &&
                    parent.property.name === "bind" &&
                    parent.parent.type === "CallExpression" &&
                    parent.parent.callee === parent
                ) {
                    retv.isLexicalThis = (
                        parent.parent.arguments.length === 1 &&
                        parent.parent.arguments[0].type === "ThisExpression"
                    );
                    node = parent;
                    parent = parent.parent;
                } else {
                    return retv;
                }
                break;

            // Checks whether the node is a callback.
            case "CallExpression":
            case "NewExpression":
                if (parent.callee !== node) {
                    retv.isCallback = true;
                }
                return retv;

            default:
                return retv;
        }

        node = parent;
        parent = parent.parent;
    }

    /* istanbul ignore next */
    throw new Error("unreachable");
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    // {Array<boolean>}
    // This stack stores flags that function scopes have one or more ThisExpressions or not.
    var stack = [];

    /**
     * Pushes new function scope with `false` flag.
     * That `false` is meaning the scope does not have ThisExpression.
     * @returns {void}
     */
    function enterScope() {
        stack.push(false);
    }

    /**
     * Pops a function scope from the stack.
     * @returns {boolean} `true` if the function scope has one or more ThisExpressions.
     */
    function exitScope() {
        return stack.pop();
    }

    return {
        "Program": function() {
            stack = [];
        },

        ThisExpression: function() {
            stack[stack.length - 1] = true;
        },

        FunctionDeclaration: enterScope,
        "FunctionDeclaration:exit": exitScope,

        FunctionExpression: enterScope,
        "FunctionExpression:exit": function(node) {
            var hasThisKeyword = exitScope();
            var info = getCallbackInfo(node);

            if (!node.generator &&
                info.isCallback &&
                (!hasThisKeyword || info.isLexicalThis)
            ) {
                context.report(node, "Unexpected function expression.");
            }
        }
    };
};

module.exports.schema = [];
