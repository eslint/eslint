/**
 * @fileoverview Disallow sparse arrays
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {


    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "ArrayExpression": function(node) {

            var emptySpot = node.elements.some(function(value) {
                return value === null;
            });

            if (emptySpot) {
                context.report(node, "Unexpected comma in middle of array.");
            }
        }

    };

};
