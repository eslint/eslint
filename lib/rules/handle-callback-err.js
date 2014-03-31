/**
 * @fileoverview Ensure handling of errors when we know they exist.
 * @author Jamund Ferguson
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var errorArgument = context.options[0] || "err";
    var callbacks = [];
    var scopes = 0;

    /**
     * Check the arguments to see if we need to start tracking the error object.
     * @param {ASTNode} node The AST node to check.
     * @returns {void}
     */
    function startFunction(node) {

        // keep track of nested scopes
        scopes++;

        // check if the first argument matches our argument name
        var firstArg = node.params && node.params[0];
        if (firstArg && firstArg.name === errorArgument) {
            callbacks.push({handled: false, depth: scopes});
        }
    }

    /**
     * At the end of a function check to see if the error was handled.
     * @param {ASTNode} node The AST node to check.
     * @returns {void}
     */
    function endFunction(node) {

        var callback = callbacks[callbacks.length - 1] || {};

        // check if a callback is ending, if so pop it off the stack
        if (callback.depth === scopes) {
            callbacks.pop();

            // check if there were no handled errors since the last callback
            if (!callback.handled) {
                context.report(node, "Expected error to be handled.");
            }
        }

        // less nested functions
        scopes--;

    }

    /**
     * Check to see if we're handling the error object properly.
     * @param {ASTNode} node The AST node to check.
     * @returns {void}
     */
    function checkForError(node) {

        // make sure the node's name matches our error argument name
        var isAboutError = node.name === errorArgument;

        // we don't consider these use cases as "handling" the error
        var doNotCount = ["FunctionDeclaration", "FunctionExpression", "CatchClause"];

        // make sure this identifier isn't used as part of one of them
        var isHandled = doNotCount.indexOf(node.parent.type) === -1;

        // record that this callback handled its error
        if (callbacks.length > 0 && isAboutError && isHandled) {
            callbacks[callbacks.length - 1].handled = true;
        }
    }

    return {
        "FunctionDeclaration": startFunction,
        "FunctionExpression": startFunction,
        "Identifier": checkForError,
        "FunctionDeclaration:exit": endFunction,
        "FunctionExpression:exit": endFunction
    };

};