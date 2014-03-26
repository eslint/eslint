/**
 * @fileoverview Rule to flag statements that use != and == instead of !== and ===
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function isTypeOf(node) {
        return [node.left, node.right].some(function(node) {
            return node.type === "UnaryExpression" && node.operator === "typeof";
        });
    }

    function bothAreSameTypeLiterals(node) {
        return node.left.type === "Literal" && node.right.type === "Literal" &&
                typeof node.left.value === typeof node.right.value;
    }

    function isNullCheck(node) {
        return (node.right.type === "Literal" && node.right.value === null) ||
                (node.left.type === "Literal" && node.left.value === null);
    }

    return {
        "BinaryExpression": function(node) {
            var operator = node.operator;

            if (context.options[0] === "smart" && (isTypeOf(node) ||
                    bothAreSameTypeLiterals(node)) || isNullCheck(node)) {
                return;
            }

            if (operator === "==") {
                context.report(node, "Expected '===' and instead saw '=='.");
            } else if (operator === "!=") {
                context.report(node, "Expected '!==' and instead saw '!='.");
            }
        }
    };
};
