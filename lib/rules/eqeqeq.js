/**
 * @fileoverview Rule to flag statements that use != and == instead of !== and ===
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {
        "BinaryExpression": function(node) {
            var operator = node.operator;

            if (operator === "==") {
                context.report(node, "Expected '===' and instead saw '=='.");
            } else if (operator === "!=") {
                context.report(node, "Expected '!==' and instead saw '!='.");
            }
        }
    };
};
