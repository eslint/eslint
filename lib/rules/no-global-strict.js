/**
 * @fileoverview Rule to flag global strict mode.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "ExpressionStatement": function(node) {

            var parent = context.getAncestors().pop();

            if (node.expression.value === "use strict" && parent.type === "Program") {
                context.report(node, "Use the function form of \"use strict\".");
            }

        }
    };

};
