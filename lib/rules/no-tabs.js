/**
 * @fileoverview Rule to check for tabs inside a file
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const tabRegex = /\t+/gu;
const anyNonWhitespaceRegex = /\S/u;

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "layout",
        fixable: "whitespace",

        docs: {
            description: "Disallow all tabs",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-tabs"
        },
        schema: [{
            type: "object",
            properties: {
                allowIndentationTabs: {
                    type: "boolean",
                    default: false
                }
            },
            additionalProperties: false
        }],

        messages: {
            unexpectedTab: "Unexpected tab character."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const allowIndentationTabs = context.options && context.options[0] && context.options[0].allowIndentationTabs;

        return {
            Program(node) {
                const lineComments = new Map();

                /*
                 * If indentation tabs are allowed then make a map of a line comments by their line
                 * and column. We will use this to splice out the comment marker in order to allow
                 * for tabs in "commented out" code.
                 */
                if (allowIndentationTabs) {
                    for (const comment of sourceCode.getAllComments()) {
                        if (comment.type === "Line") {
                            lineComments.set(comment.loc.start.line, comment.loc.start.column);
                        }
                    }
                }

                sourceCode.getLines().forEach((line, index) => {
                    let match;

                    while ((match = tabRegex.exec(line)) !== null) {
                        const matchIndex = match.index;
                        const matchLength = match[0].length;

                        if (allowIndentationTabs) {
                            const commentColumn = lineComments.get(index + 1);
                            let lineToTab;

                            if (typeof commentColumn === "undefined" || match.index < commentColumn) {
                                lineToTab = line.slice(0, match.index);
                            } else {

                                // Slice out the comment "//" marker
                                lineToTab = line.slice(0, commentColumn) + line.slice(commentColumn + 2, matchIndex);
                            }

                            if (!anyNonWhitespaceRegex.test(lineToTab)) {
                                continue;
                            }
                        }

                        context.report({
                            node,
                            fix(fixer) {
                                const startIndex = sourceCode.getIndexFromLoc({ line: index + 1, column: matchIndex });

                                return fixer.replaceTextRange([startIndex, startIndex + matchLength], " ".repeat(matchLength));
                            },
                            loc: {
                                start: {
                                    line: index + 1,
                                    column: match.index
                                },
                                end: {
                                    line: index + 1,
                                    column: match.index + match[0].length
                                }
                            },
                            messageId: "unexpectedTab"
                        });
                    }
                });
            }
        };
    }
};
