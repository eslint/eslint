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
                                    const oldQuote = text[0];
                                    const textNoQuotes = text.slice(1, -1);
                                    const escapeBackticks = textNoQuotes.replaceAll("`", "\\`");
                                    const unescapeQuotes = escapeBackticks.replaceAll(`\\${oldQuote}`, oldQuote);
                                    // eslint-disable-next-line require-unicode-regexp -- Needs fixing, adding the unicode flag results in "Incomplete quantifier" parsing error
                                    const backTicksInsideCurly = /(?<=\${)\\`([^`]*)\\`(?=})/gi;
                                    const unescapeTemplates = unescapeQuotes.replaceAll(backTicksInsideCurly, "`$1`");
                                    const newText = `\`${unescapeTemplates}\``;

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
