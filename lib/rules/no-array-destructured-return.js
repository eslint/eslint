/**
 * @fileoverview Disallow array destructuring of return values.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow array destructuring of return values",
            category: "Best Practices",
            recommended: false
        },

        schema: []
    },

    create(context) {

        /**
         * Reports an error on the given node.
         * @param   {ASTNode} node The node to report on.
         * @returns {void}
         */
        function report(node) {
            context.report({
                node,
                message: "Array destructuring of return values is not allowed, use object destructuring instead."
            });
        }

        /**
         * Checks if the node passed in is an ArrayPattern node that is not allowed.
         * @param   {ASTNode} node The node to check.
         * @returns {boolean} `true` if disallowed.
         */
        function isDisallowedArrayDestructuring(node) {
            const containsRestOperator = node.elements &&
                                         node.elements.length > 0 &&
                                         node.elements[node.elements.length - 1].type === "RestElement";

            return node.type === "ArrayPattern" && !containsRestOperator;
        }

        /**
         * Checks if the node passed in is an expression that has a return value.
         * @param   {ASTNode} node The node to check.
         * @returns {boolean} `true` if the node is an expression with return value.
         */
        function isExpressionWithReturnValue(node) {
            return node.type === "CallExpression" || node.type === "NewExpression";
        }

        return {
            VariableDeclarator(node) {
                if (isDisallowedArrayDestructuring(node.id) && isExpressionWithReturnValue(node.init)) {
                    report(node.id);
                }
            },

            AssignmentExpression(node) {
                if (isDisallowedArrayDestructuring(node.left) && isExpressionWithReturnValue(node.right)) {
                    report(node.left);
                }
            }
        };

    }
};
