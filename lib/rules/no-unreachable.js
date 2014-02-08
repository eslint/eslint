/**
 * @fileoverview Checks for unreachable code due to return, throws, break, and continue.
 * @author Joel Feenstra
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------


function report(context, node, unreachableType) {
    context.report(node, "Found unexpected statement after a {{type}}.", { type: unreachableType });
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    function checkForUnreachable(node) {
        switch (node.type) {
        case "ReturnStatement":
            return "return";
        case "ThrowStatement":
            return "throw";
        case "ContinueStatement":
            return "continue";
        case "BreakStatement":
            return "break";
        default:
            return false;
        }
    }

    /**
     * Checks if a node is an exception for no-unreachable because of variable/function hoisting
     * @param {ASTNode} node The AST node to check.
     * @returns {boolean} if the node doesn't trigger unreachable
     * @private
     */
    function isUnreachableAllowed(node) {
        return node.type === "FunctionDeclaration" ||
            node.type === "VariableDeclaration" &&
            node.declarations.every(function(declaration){
                return declaration.type === "VariableDeclarator" && declaration.init === null;
            });
    }

    /**
     * Loops through a field of a node and checks if its children fulfill conditions to trigger the unreachable report.
     * @param {ASTNode} node The AST node to check.
     * @param {string} field The field that represents the children of the node.
     * @returns {void}
     * @private
     */
    function checkNodeFieldForUnreachable(node, field) {
        var i, unreachableType = false;
        for (i = 1; i < node[field].length; i++) {
            unreachableType = unreachableType || checkForUnreachable(node[field][i - 1]);
            if (unreachableType && !isUnreachableAllowed(node[field][i])) {
                report(context, node[field][i], unreachableType);
            }
        }
    }

    return {
        "BlockStatement": function(node) {
            checkNodeFieldForUnreachable(node, "body");
        },

        "SwitchCase": function(node) {
            checkNodeFieldForUnreachable(node, "consequent");
        }
    };

};
