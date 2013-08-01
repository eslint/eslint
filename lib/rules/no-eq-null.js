/**
 * @fileoverview Rule to flag comparisons to null without a type-checking
 * operator.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    return {

        "BinaryExpression": function(node) {
            var badOperator = node.operator === "==" || node.operator === "!=";

            if (node.right.type === "Literal" && node.right.raw === "null" && badOperator ||
                    node.left.type === "Literal" && node.left.raw === "null" && badOperator) {
                context.report(node, "Use ‘===’ to compare with ‘null’.");
            }
        }
    };

};
