/**
 * @fileoverview Warn when using template string syntax in regular strings
 * @author Jeroen Engels
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow template literal placeholder syntax in regular strings",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-template-curly-in-string"
        },

        schema: [],

        messages: {
            unexpectedTemplateExpression: "Unexpected template string expression.",
            convertToTemplate: "Convert to ES6 `template`."
        },
        hasSuggestions: true
    },

    create(context) {
        const regex = /\$\{[^}]+\}/u;
        const sourceCode = context.getSourceCode();

        return {
            Literal(node) {
                if (typeof node.value === "string" && regex.test(node.value)) {
                    context.report({
                        node,
                        messageId: "unexpectedTemplateExpression",
                        suggest: [
                            {
                                messageId: "convertToTemplate",
                                fix: fixer => {
                                    const text = sourceCode.getText(node);
                                    const textNoQuotes = text.slice(1, -1);
                                    const newText = `\`${textNoQuotes}\``;

                                    return fixer.replaceText(node, newText);
                                }
                            }
                        ]
                    });
                }
            }
        };

    }
};
