/**
 * @fileoverview Rule to warn about using dot notation instead of square bracket notation when possible.
 * @author Josh Perez
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const keywords = require("../util/keywords");

module.exports = {
    meta: {
        docs: {
            description: "enforce dot notation whenever possible",
            category: "Best Practices",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowKeywords: {
                        type: "boolean"
                    },
                    allowPattern: {
                        type: "string"
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const options = context.options[0] || {};
        const allowKeywords = options.allowKeywords === void 0 || !!options.allowKeywords;

        let allowPattern;

        if (options.allowPattern) {
            allowPattern = new RegExp(options.allowPattern);
        }

        return {
            MemberExpression(node) {
                if (
                    node.computed &&
                    node.property.type === "Literal" &&
                    validIdentifier.test(node.property.value) &&
                    (allowKeywords || keywords.indexOf(String(node.property.value)) === -1)
                ) {
                    if (!(allowPattern && allowPattern.test(node.property.value))) {
                        context.report({
                            node: node.property,
                            message: "[{{propertyValue}}] is better written in dot notation.",
                            data: {
                                propertyValue: JSON.stringify(node.property.value)
                            }
                        });
                    }
                }
                if (
                    !allowKeywords &&
                    !node.computed &&
                    keywords.indexOf(String(node.property.name)) !== -1
                ) {
                    context.report({
                        node: node.property,
                        message: ".{{propertyName}} is a syntax error.",
                        data: {
                            propertyName: node.property.name
                        }
                    });
                }
            }
        };
    }
};
