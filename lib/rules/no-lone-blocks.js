/**
 * @fileoverview Rule to flag blocks with no reason to exist
 * @author Brandon Mills
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {
        "BlockStatement": function (node) {
            // Check for any occurrence of BlockStatement > BlockStatement or
            // Program > BlockStatement
            var parent = context.getAncestors().pop();
            if (parent.type === "BlockStatement" || parent.type === "Program") {
                context.report(node, "Block is nested inside another block.");
            }
        }
    };

};
