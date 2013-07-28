/**
 * @fileoverview Rule to flag comparison where left part is the same as the right
 * part.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    return {

        "BinaryExpression": function(node) {

            if (node.left.name === node.right.name) {
                context.report(node, "Comparing to itself is potentially pointless");
            }
        }
    };

};
