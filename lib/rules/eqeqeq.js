/**
 * @fileoverview Rule to flag statements that use != and == instead of !== and ===
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function isTypeOf(node) {
    if (node.left.type === "UnaryExpression" && node.left.operator === "typeof") {
        return true;
    } else if (node.right.type === "UnaryExpression" && node.right.operator === "typeof") {
        return true;
    }
    return false;
}

module.exports = function(context) {

    return {
        "BinaryExpression": function(node) {
            var operator = node.operator;

            if (isTypeOf(node)) {
                return;
            }

            if (operator === "==") {
                context.report(node, "Unexpected use of ==, use === instead.");
            } else if (operator === "!=") {
                context.report(node, "Unexpected use of !=, use !== instead.");
            }
        }
    };
};
