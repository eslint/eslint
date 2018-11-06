/**
 * @fileoverview Rule to flag use of ternary operators.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow ternary operators",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-ternary"
        },

        schema: []
    },

    create(context) {

        return {

            ConditionalExpression(node) {
                context.report({ node, message: "Ternary operator used." });
            }

        };

    }
};
