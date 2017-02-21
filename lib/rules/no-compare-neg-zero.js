/**
 * @fileoverview The rule should warn against code that tries to compare against -0.
 * @author no-compare-neg-zero
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow compare against -0.",
            category: "Possible Errors",
            recommended: false
        },
        fixable: null,
        schema: []
    },

    create(context) {

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Checks a given node is -0
         *
         * @param {ASTNode} node - A node to check.
         * @returns {boolean} `true` if the node is -0.
         */
        function isNegZero(node) {
            return node.type === "UnaryExpression" && node.operator === "-" && node.argument.type === "Literal" && node.argument.value === 0;
        }

        return {
            BinaryExpression(node) {
                if (/^(?:[<>]|[!=]=)=?$/.test(node.operator)) {
                    if (isNegZero(node.left) || isNegZero(node.right)) {
                        context.report({
                            node,
                            message: "disallow use the {{operator}} operator to compare against -0.",
                            data: { operator: node.operator }
                        });
                    }
                }
            }
        };
    }
};
