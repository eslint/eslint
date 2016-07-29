/**
 * @fileoverview enforce a maximum file length
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let lodash = require("lodash");
let astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce a maximum number of lines per file",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [
            {
                oneOf: [
                    {
                        type: "integer",
                        minimum: 0
                    },
                    {
                        type: "object",
                        properties: {
                            max: {
                                type: "integer",
                                minimum: 0
                            },
                            skipComments: {
                                type: "boolean"
                            },
                            skipBlankLines: {
                                type: "boolean"
                            }
                        },
                        additionalProperties: false
                    }
                ]
            }
        ]
    },

    create: function(context) {
        let option = context.options[0],
            max = 300;

        if (typeof option === "object" && option.hasOwnProperty("max") && typeof option.max === "number") {
            max = option.max;
        }

        if (typeof option === "number") {
            max = option;
        }

        let skipComments = option && option.skipComments;
        let skipBlankLines = option && option.skipBlankLines;

        let sourceCode = context.getSourceCode();

        /**
         * Returns whether or not a token is a comment node type
         * @param {Token} token The token to check
         * @returns {boolean} True if the token is a comment node
         */
        function isCommentNodeType(token) {
            return token && (token.type === "Block" || token.type === "Line");
        }

        /**
         * Returns the line numbers of a comment that don't have any code on the same line
         * @param {Node} comment The comment node to check
         * @returns {int[]} The line numbers
         */
        function getLinesWithoutCode(comment) {
            let start = comment.loc.start.line;
            let end = comment.loc.end.line;

            let token;

            token = comment;
            do {
                token = sourceCode.getTokenOrCommentBefore(token);
            } while (isCommentNodeType(token));

            if (token && astUtils.isTokenOnSameLine(token, comment)) {
                start += 1;
            }

            token = comment;
            do {
                token = sourceCode.getTokenOrCommentAfter(token);
            } while (isCommentNodeType(token));

            if (token && astUtils.isTokenOnSameLine(comment, token)) {
                end -= 1;
            }

            if (start <= end) {
                return lodash.range(start, end + 1);
            }
            return [];
        }

        return {
            "Program:exit": function() {
                let lines = sourceCode.lines.map(function(text, i) {
                    return { lineNumber: i + 1, text: text };
                });

                if (skipBlankLines) {
                    lines = lines.filter(function(l) {
                        return l.text.trim() !== "";
                    });
                }

                if (skipComments) {
                    let comments = sourceCode.getAllComments();

                    let commentLines = lodash.flatten(comments.map(function(comment) {
                        return getLinesWithoutCode(comment);
                    }));

                    lines = lines.filter(function(l) {
                        return !lodash.includes(commentLines, l.lineNumber);
                    });
                }

                if (lines.length > max) {
                    context.report({
                        loc: { line: 1, column: 0 },
                        message: "File must be at most " + max + " lines long"
                    });
                }
            }
        };
    }
};
