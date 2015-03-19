/**
 * @fileoverview A rule to ensure the use of a single variable declaration.
 * @author Ian Christian Myers
 * @copyright 2015 Danny Fritz. All rights reserved.
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var MODE = context.options[0] || "always";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    var functionStack = [];

    /**
     * Increments the functionStack counter.
     * @returns {void}
     * @private
     */
    function startFunction() {
        functionStack.push(false);
    }

    /**
     * Decrements the functionStack counter.
     * @returns {void}
     * @private
     */
    function endFunction() {
        functionStack.pop();
    }

    /**
     * Determines if there is more than one var statement in the current scope.
     * @returns {boolean} Returns true if it is the first var declaration, false if not.
     * @private
     */
    function hasOnlyOneVar() {
        if (functionStack[functionStack.length - 1]) {
            return true;
        } else {
            functionStack[functionStack.length - 1] = true;
            return false;
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "Program": startFunction,
        "FunctionDeclaration": startFunction,
        "FunctionExpression": startFunction,
        "ArrowFunctionExpression": startFunction,

        "VariableDeclaration": function(node) {
            var declarationCount = node.declarations.length;
            if (MODE === "never") {
                if (declarationCount > 1) {
                    context.report(node, "Split 'var' declaration into multiple statements.");
                }
            } else {
                if (hasOnlyOneVar()) {
                    context.report(node, "Combine this with the previous 'var' statement.");
                }
            }
        },

        "Program:exit": endFunction,
        "FunctionDeclaration:exit": endFunction,
        "FunctionExpression:exit": endFunction,
        "ArrowFunctionExpression:exit": endFunction
    };

};
