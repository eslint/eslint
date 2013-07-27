/**
 * @fileoverview Rule to flag comparisons to the value NaN
 * @author James Allardice
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {
        "BinaryExpression": function(node) {

            if (!/^[|&^]$/.test(node.operator) && node.left.name === "NaN" || node.right.name === "NaN") {
                context.report(node, "Use the isNaN function to compare with NaN.");
            }
        }
    };

};
