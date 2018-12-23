/**
 * @fileoverview Reports useless `catch` clauses that just rethrow their error.
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow unnecessary `catch` clauses",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-useless-catch"
        },

        schema: []
    },

    create(context) {
        return {
            CatchClause(node) {
                if (
                    node.param.type === "Identifier" &&
                    node.body.body.length &&
                    node.body.body[0].type === "ThrowStatement" &&
                    node.body.body[0].argument.type === "Identifier" &&
                    node.body.body[0].argument.name === node.param.name
                ) {
                    if (node.parent.finalizer) {
                        context.report({
                            node,
                            message: "Unnecessary catch clause."
                        });
                    } else {
                        context.report({
                            node: node.parent,
                            message: "Unnecessary try/catch wrapper."
                        });
                    }
                }
            }
        };
    }
};
