/**
 * @fileoverview A rule to disallow `this` keywords outside of classes or class-like objects.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var stack = [],
        sourceCode = context.getSourceCode();

    /**
     * Gets the current checking context.
     *
     * The return value has a flag that whether or not `this` keyword is valid.
     * The flag is initialized when got at the first time.
     *
     * @returns {{valid: boolean}}
     *   an object which has a flag that whether or not `this` keyword is valid.
     */
    stack.getCurrent = function() {
        var current = this[this.length - 1];
        if (!current.init) {
            current.init = true;
            current.valid = !astUtils.isDefaultThisBinding(
                current.node,
                sourceCode);
        }
        return current;
    };

    /**
     * Pushs new checking context into the stack.
     *
     * The checking context is not initialized yet.
     * Because most functions don't have `this` keyword.
     * When `this` keyword was found, the checking context is initialized.
     *
     * @param {ASTNode} node - A function node that was entered.
     * @returns {void}
     */
    function enterFunction(node) {
        // `this` can be invalid only under strict mode.
        stack.push({
            init: !context.getScope().isStrict,
            node: node,
            valid: true
        });
    }

    /**
     * Pops the current checking context from the stack.
     * @returns {void}
     */
    function exitFunction() {
        stack.pop();
    }

    return {
        // `this` is invalid only under strict mode.
        // Modules is always strict mode.
        "Program": function(node) {
            var scope = context.getScope();
            var features = context.ecmaFeatures;

            stack.push({
                init: true,
                node: node,
                valid: !(
                    scope.isStrict ||
                    features.modules ||
                    (features.globalReturn && scope.childScopes[0].isStrict)
                )
            });
        },
        "Program:exit": function() {
            stack.pop();
        },

        "FunctionDeclaration": enterFunction,
        "FunctionDeclaration:exit": exitFunction,
        "FunctionExpression": enterFunction,
        "FunctionExpression:exit": exitFunction,

        // Reports if `this` of the current context is invalid.
        "ThisExpression": function(node) {
            var current = stack.getCurrent();
            if (current && !current.valid) {
                context.report(node, "Unexpected `this`.");
            }
        }
    };
};

module.exports.schema = [];
