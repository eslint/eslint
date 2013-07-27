/**
 * @fileoverview Checks for unreachable code due to return, throws, break, and continue.
 * @author Joel Feenstra
 */

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

    "use strict";

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

    return {
        "BlockStatement": function(node) {
            var i, unreachableType = false;
            for (i = 1; i < node.body.length; i++) {
                unreachableType = unreachableType || checkForUnreachable(node.body[i - 1]);
                if (unreachableType) {
                    report(context, node.body[i], unreachableType);
                }
            }
        },

        "SwitchCase": function(node) {
            var i, unreachableType = false;
            for (i = 1; i < node.consequent.length; i++) {
                unreachableType = unreachableType || checkForUnreachable(node.consequent[i - 1]);
                if (unreachableType) {
                    report(context, node.consequent[i], unreachableType);
                }
            }
        }
    };

};
