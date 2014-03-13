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

    function checkForReturnStatement(node, alternate) {
        if (node.type === "ReturnStatement") {
            context.report(alternate, "Unexpected 'else' after 'return'​.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {

        "IfStatement": function(node) {

            // Don't bother finding a ReturnStatement, if there's no `else`
            // or if the alternate is also an if (indicating an else if).
            if (node.alternate && node.consequent && node.alternate.type !== "IfStatement") {

                // If we have a BlockStatement, check each consequent body node.
                if (node.consequent.type === "BlockStatement") {
                    node.consequent.body.forEach(function (bodyNode) {
                        checkForReturnStatement(bodyNode, node.alternate);
                    });

                // If not a block statement, make sure the consequent isn't a
                // ReturnStatement
                } else {
                    checkForReturnStatement(node.consequent, node.alternate);
                }
            }
        }

    };

};
