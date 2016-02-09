/**
 * @fileoverview Rule to enforce that all class methods use 'this'.
 * @author Patrick Williams
 * @copyright 2016 Patrick Williams. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var stack = [];

    /**
     * Initializes the current context to false and pushes it onto the stack.
     * These booleans represent whether 'this' has been used in the context.
     *
     * @returns {void}
     */
    function enterFunction() {
        stack.push(false);
    }

    /**
     * Checks if we are leaving a function that is a method, and reports if 'this' has not been used.
     * Static methods and the constructor are exempt.
     * Then pops the context off the stack.
     *
     * @param {ASTNode} node - A function node that was entered.
     * @returns {void}
     */
    function exitFunction(node) {
        var isThisUsed = stack[stack.length - 1];
        var isInstanceMethod = (
            !node.parent.static &&
            node.parent.type === "MethodDefinition" &&
            node.parent.key.name !== "constructor"
        );

        if (isInstanceMethod && !isThisUsed) {
            context.report(node, "Expected 'this' to be used by class method '" + node.parent.key.name + "'.");
        }
        stack.pop();

    }

    /**
     * Markes the current context as having used 'this'.
     *
     * @returns {void}
     */
    function markThisUsed() {
        if (stack.length) {
            stack[stack.length - 1] = true;
        }
    }

    return {
        "FunctionDeclaration": enterFunction,
        "FunctionDeclaration:exit": exitFunction,
        "FunctionExpression": enterFunction,
        "FunctionExpression:exit": exitFunction,
        "ThisExpression": markThisUsed
    };
};

module.exports.schema = [];
