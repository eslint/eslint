/**
 * @fileoverview Rule to flag statements that use != and == instead of !== and ===
 * @author Josh Perez
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function isTypeOf(node) {
    return [node.left, node.right].some(function(node) {
        return node.type === "UnaryExpression" && node.operator === "typeof";
    });
}

function bothAreSameTypeLiterals(node) {
    return node.left.type === "Literal" && node.right.type === "Literal" && typeof node.left.value === typeof node.right.value;
}

module.exports = function(context) {

    return {
        "BinaryExpression": function(node) {
            var operator = node.operator;

            if (isTypeOf(node) || bothAreSameTypeLiterals(node)) {
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
