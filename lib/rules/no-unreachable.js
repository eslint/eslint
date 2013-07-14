/**
 * @fileoverview Checks for unreachable code due to return, throws, break, and continue.
 * @author Joel Feenstra
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    function checkForUnreachable(node) {
        if (node.type === "ReturnStatement") {
            return "return";
        } else if (node.type === "ThrowStatement") {
            return "throw";
        } else if (node.type === "ContinueStatement") {
            return "continue";
        } else if (node.type === "BreakStatement") {
            return "break";
        }
        return false;
    }

    return {
        "BlockStatement": function(node) {
            var unreachableType = false;
            for (i = 1; i < node.body.length; i++) {
                unreachableType = unreachableType || checkForUnreachable(node.body[i - 1]);
                context.report(node.body[i], "Found unexpected statement after a " + unreachableType + ".");
            }
        },

        "SwitchCase": function(node) {
            var unreachableType = false;
            for (i = 1; i < node.consequent.length; i++) {
                unreachableType = unreachableType || checkForUnreachable(node.consequent[i - 1]);
                context.report(node.consequent[i], "Found unexpected statement after a " + unreachableType + ".");
            }
        }
    };

};
