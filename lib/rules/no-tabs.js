/**
 * @fileoverview Rule to check for tabs inside a file
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const tabRegex = /\t+/gu;
const isCommentRegex = /^[\s]*(\/\/)/u;
const anyNonWhitespaceRegex = /\S/u;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "disallow all tabs",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-tabs"
        },
        schema: [{
            type: "object",
            properties: {
                allowIndentationTabs: {
                    type: "boolean",
                    default: false
                },
                ignoreTabsOnComments: {
                    type: "boolean",
                    default: false
                }
            },
            additionalProperties: false
        }]
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const allowIndentationTabs = context.options && context.options[0] && context.options[0].allowIndentationTabs;
        const ignoreTabsOnComments = context.options && context.options[0] && context.options[0].ignoreTabsOnComments;

        return {
            Program(node) {
                sourceCode.getLines().forEach((line, index) => {
                    let match;

                    while ((match = tabRegex.exec(line)) !== null) {
                        if (ignoreTabsOnComments && isCommentRegex.test(line)) {
                            continue;
                        }
                        if (allowIndentationTabs && !anyNonWhitespaceRegex.test(line.slice(0, match.index))) {
                            continue;
                        }

                        context.report({
                            node,
                            loc: {
                                line: index + 1,
                                column: match.index
                            },
                            message: "Unexpected tab character."
                        });
                    }
                });
            }
        };
    }
};
