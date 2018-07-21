/**
 * @fileoverview Rule to flag nested ternary expressions
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow nested ternary expressions",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-nested-ternary"
        },

        schema: [{
            type: "object",
            properties: {
                allowAlternate: {
                    type: "boolean"
                }
            },
            additionalProperties: false
        }]
    },

    create(context) {

        const option = context.options[0];
        let ALLOW_ALTERNATE = false;

        if (typeof option === "object" && option.hasOwnProperty("allowAlternate") && typeof option.allowAlternate === "boolean") {
            ALLOW_ALTERNATE = option.allowAlternate;
        }

        return {
            ConditionalExpression(node) {
                if (ALLOW_ALTERNATE) {
                    if (node.consequent.type === "ConditionalExpression") {
                        context.report({ node, message: "Do not nest ternary expressions." });
                    }
                } else {
                    if (node.alternate.type === "ConditionalExpression" ||
                            node.consequent.type === "ConditionalExpression") {
                        context.report({ node, message: "Do not nest ternary expressions." });
                    }
                }
            }
        };
    }
};
