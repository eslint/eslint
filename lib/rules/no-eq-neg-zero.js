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
            recommended: false
        },
        fixable: null,
        schema: []
    },

    create(context) {
        return {
            BinaryExpression(node) {

                /**
                 * Checks a given node is -0
                 *
                 * @param {ASTNode} n - A node to check.
                 * @returns {boolean} `true` if the node is -0.
                 */
                function eqNegZero(n) {
                    return n.type === "UnaryExpression" && n.operator === "-" && n.argument.type === "Literal" && n.argument.value === 0;
                }

                if (node.operator === "===") {
                    if (eqNegZero(node.left) || eqNegZero(node.right)) {
                        context.report({ node, message: "disallow use the === operator to compare against -0." });
                    }
                }

            }

        };
    }
};
