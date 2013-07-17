/**
 * @fileoverview Checks for unreachable code due to return, throws, break, and continue.
 * @author Joel Feenstra
 */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------



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

    return {
        "BlockStatement": function(node) {
            var i, unreachableType = false;
            for (i = 1; i < node.body.length; i++) {
                unreachableType = unreachableType || checkForUnreachable(node.body[i - 1]);
                if (unreachableType) {
                    context.report(node.body[i], "Found unexpected statement after a " + unreachableType + ".");
                }
            }
        },

        "SwitchCase": function(node) {
            var i, unreachableType = false;
            for (i = 1; i < node.consequent.length; i++) {
                unreachableType = unreachableType || checkForUnreachable(node.consequent[i - 1]);
                if (unreachableType) {
                    context.report(node.consequent[i], "Found unexpected statement after a " + unreachableType + ".");
                }
            }
        }
    };

};
