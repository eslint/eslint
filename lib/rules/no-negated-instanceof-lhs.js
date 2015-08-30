/**
 * @fileoverview A rule to disallow negated left operands of the `in` operator
 * @author Kevin Partington
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "BinaryExpression": function(node) {
            if (node.operator === "instanceof" && node.left.type === "UnaryExpression" && node.left.operator === "!") {
                context.report(node, "The `instanceof` expression's left operand is negated");
            }
        }
    };

};

module.exports.schema = [];
