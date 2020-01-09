/**
 * @fileoverview Rule to enforce declarations in program or function body root.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow variable or `function` declarations in nested blocks",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-inner-declarations"
        },

        schema: [
            {
                enum: ["functions", "both"]
            }
        ],

        messages: {
            moveDeclToRoot: "Move {{type}} declaration to {{body}} root."
        }
    },

    create(context) {

        /**
         * Find the nearest Program or Function ancestor node.
         * @returns {Object} Ancestor's type and distance from node.
         */
        function nearestBody() {
            const ancestors = context.getAncestors();
            let ancestor = ancestors.pop(),
                generation = 1;

            while (ancestor && ["Program", "FunctionDeclaration",
                "FunctionExpression", "ArrowFunctionExpression"
            ].indexOf(ancestor.type) < 0) {
                generation += 1;
                ancestor = ancestors.pop();
            }

            return {

                // Type of containing ancestor
                type: ancestor.type,

                // Separation between ancestor and node
                distance: generation
            };
        }

        /**
         * Ensure that a given node is at a program or function body's root.
         * @param {ASTNode} node Declaration node to check.
         * @returns {void}
         */
        function check(node) {
            const body = nearestBody(),
                valid = ((body.type === "Program" && body.distance === 1) ||
                    body.distance === 2);

            if (!valid) {
                context.report({
                    node,
                    messageId: "moveDeclToRoot",
                    data: {
                        type: (node.type === "FunctionDeclaration" ? "function" : "variable"),
                        body: (body.type === "Program" ? "program" : "function body")
                    }
                });
            }
        }

        return {

            FunctionDeclaration: check,
            VariableDeclaration(node) {
                if (context.options[0] === "both" && node.kind === "var") {
                    check(node);
                }
            }

        };

    }
};
