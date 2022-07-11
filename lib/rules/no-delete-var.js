/**
 * @fileoverview Rule to flag when deleting variables
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow deleting variables",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-delete-var"
        },

        schema: [],

        messages: {
            unexpected: "Variables should not be deleted."
        }
    },

    create(context) {

        return {

            UnaryExpression(node) {
                if (node.operator === "delete" && node.argument.type === "Identifier") {
                    context.report({ node, messageId: "unexpected" });
                }
            }
        };

    }
};
