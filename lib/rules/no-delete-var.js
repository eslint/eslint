/**
 * @fileoverview Rule to flag when deleting variables
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "UnaryExpression": function(node) {
            if (node.operator === "delete" && node.argument.type === "Identifier") {
                context.report(node, "Variables should not be deleted​.");
            }
        }
    };

};
