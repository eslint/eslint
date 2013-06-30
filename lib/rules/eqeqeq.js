/**
 * @fileoverview Rule to flag statements that use != and == instead of !== and ===
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "BinaryExpression": function(node) {
            var operator = node.operator;

            if (operator === "==") {
                context.report(node, "Unexpected use of ==, use === instead.");
            } else if (operator === "!=") {
                context.report(node, "Unexpected use of !=, use !== instead.");
            }
        }
    };
};
