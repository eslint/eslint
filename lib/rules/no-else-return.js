/**
 * @fileoverview Rule to flag `else` after a `return` in `if`
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function displayReport(node) {
        context.report(node, "Unexpected 'else' after 'return'.");
    }

    function checkForReturnStatement(node, alternate, noReport) {
        if (node.type === "ReturnStatement") {
            if (noReport) {
                return true;
            }
            displayReport(alternate);
        }
    }

    function checkIfForReturn(node, noReport) {
        // Don't bother finding a ReturnStatement, if there's no `else`
        // or if the alternate is also an if (indicating an else if).
        if (node.alternate && node.consequent && node.alternate.type !== "IfStatement") {
            var nestedReturn = false;
            // If we have a BlockStatement, check each consequent body node.
            if (node.consequent.type === "BlockStatement") {
                node.consequent.body.forEach(function (bodyNode) {
                    if (bodyNode.type === "IfStatement") {
                        nestedReturn = checkIfForReturn(bodyNode, true);
                        if (nestedReturn && !noReport) { // Suppress recursive reports
                            displayReport(node.alternate);
                        }
                    } else {
                        nestedReturn = checkForReturnStatement(bodyNode, node.alternate, noReport);
                    }
                });
            // If not a block or if statement, make sure the consequent isn't a ReturnStatement
            } else {
                nestedReturn = checkForReturnStatement(node.consequent, node.alternate, noReport);
            }
            return nestedReturn;
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {

        "IfStatement": function (node) {
            checkIfForReturn(node);
        }

    };

};
