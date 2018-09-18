/**
 * @fileoverview Disallow hardcoded values via RegExp
 * @author Grigory Gorshkov
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow hardcoded values via RegExp",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-hardcoded-values"
        },

        schema: [
            {
                type: "object",
                properties: {
                    pattern: {
                        type: "string"
                    },
                    ignorePattern: {
                        type: "string"
                    }
                },
                required: ["pattern"]
            }
        ]
    },

    create(context) {
        const config = context.options[0] || {};
        const { pattern } = config;

        return {

            Literal(node) {
                const { value } = node;

                if (pattern && value && typeof value === "string" && value.indexOf(pattern) !== -1) {
                    context.report({
                        node,
                        message: "Value of a string '{{value}}' matches pattern '{{pattern}}' and is considered a hardcode.",
                        data: { value, pattern }
                    });
                }
            }
        };

    }
};
