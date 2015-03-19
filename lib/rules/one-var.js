/**
 * @fileoverview A rule to ensure the use of a single variable declaration.
 * @author Ian Christian Myers
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var MODE = context.options[0];

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    var functionStack = [];

    function startFunction() {
        functionStack.push(false);
    }

    function endFunction() {
        functionStack.pop();
    }

    function oneDeclaration(node) {
        if (functionStack[functionStack.length - 1]) {
            context.report(node, "Combine this with the previous 'var' statement.");
        } else {
            functionStack[functionStack.length - 1] = true;
        }
    }

    function onlyUndefinedDeclarations(node) {
        var allundefined = node.declarations.every(function(dec) {
            return dec.init === null;
        });

        if (!allundefined) {
            context.report(node, "Only undefined declarations allowed on a single 'var'.");
        }
    }

    function multipleSingleDeclarations(node) {
        if (node.declarations.length > 1) {

            if (MODE === "only-undefined") {
                onlyUndefinedDeclarations(node);
            } else {
                // MODE: never
                context.report(node, "Multiple declarations on a single 'var'.");
            }
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

        "VariableDeclaration": MODE === "never" || MODE === "only-undefined" ?
            multipleSingleDeclarations :
            oneDeclaration,

        "Program:exit": endFunction,
        "FunctionDeclaration:exit": endFunction,
        "FunctionExpression:exit": endFunction,
        "ArrowFunctionExpression:exit": endFunction
    };

};
