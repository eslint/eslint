/**
 * @fileoverview Rule to flag use of ternary operators.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow ternary operators",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-ternary"
        },

        schema: [],

        messages: {
            noTernaryOperator: "Ternary operator used."
        }
    },

    create(context) {

        return {

            ConditionalExpression(node) {
                context.report({ node, messageId: "noTernaryOperator" });
            }

        };

    }
};
