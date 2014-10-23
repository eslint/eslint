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

    /**
     * Display the context report when this rule is violated
     *
     * @param {object} node The node containing the 'else' statement
     * @returns {void}
     */
    function displayReport(node) {
        context.report(node, "Unexpected 'else' after 'return'.");
    }

    /**
     * Check the consequent for a return statement to see if the rule is violated
     *
     * @param {object} consequent The consequent of the if-statement node
     * @param {object} alternate The alternate of the if-statement node
     * @param {boolean} noReport If true, do not display report, just report nested violation
     * @returns {boolean} True if nested else-return has been found
     */
    function checkForReturnStatement(consequent, alternate, noReport) {
        if (consequent.type === "ReturnStatement") {
            if (noReport) {
                return true;
            }
            displayReport(alternate);
        }
        return false;
    }

    /**
     * Check the node to see if it has an unexpected else after a return in the consequent
     *
     * @param {object} node The node being checked for violations
     * @param {boolean} noReport If true, do not display report, just report nested violation
     * @returns {boolean} True if nested else-return has been found
     */
    function checkIfForReturn(node, noReport) {
        var nestedReturn = false;
        // Don't bother finding a ReturnStatement, if there's no `else`
        // or if the alternate is also an if (indicating an else if).
        if (node.alternate && node.consequent && node.alternate.type !== "IfStatement") {
            // If we have a BlockStatement, check each consequent body node.
            if (node.consequent.type === "BlockStatement") {
                node.consequent.body.forEach(function (bodyNode) {
                    var hadReturn;
                    if (bodyNode.type === "IfStatement") {
                        hadReturn = checkIfForReturn(bodyNode, true);
                        if (hadReturn && !noReport) { // Suppress recursive reports
                            displayReport(node.alternate);
                        }
                    } else {
                        hadReturn = checkForReturnStatement(bodyNode, node.alternate, noReport);
                    }
                    if (hadReturn) {
                        nestedReturn = true;
                    }
                });
                // If not a block or if statement, make sure the consequent isn't a ReturnStatement
            } else {
                nestedReturn = checkForReturnStatement(node.consequent, node.alternate, noReport);
            }
        }
        return nestedReturn;
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {

        "IfStatement": checkIfForReturn

    };

};
