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
     * @param {ASTNode} node
     * @returns {boolean} if the node doesn't trigger unreachable
     */
    function isUnreachableAllowed(node) {
        // check for FunctionDeclaration
        var isAllowed = node.type === "FunctionDeclaration";

        if (!isAllowed && node.type === "VariableDeclaration") {
            // check that every declaration is variable declaration with no init
            isAllowed = node.declarations.every(function(declaration){
                return declaration.type === "VariableDeclarator" && declaration.init === null;
            });
        }

        return isAllowed;
    }

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
