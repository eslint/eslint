/**
 * @fileoverview The rule should warn against code that tries to use the === operator to compare against -0.
 * @author no-eq-neg-zero
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow use the === operator to compare against -0.",
            category: "Possible Errors",
            recommended: true
        },
        fixable: null,
        schema: []
    },

    create(context) {
        return {
            BinaryExpression(node) {
                if (/===?$/.test(node.operator) && (node.right.operator === "-") && node.right.argument.value === 0) {
                    context.report({ node, message: "disallow use the === operator to compare against -0." });
                }
            }
        };
    }
};
