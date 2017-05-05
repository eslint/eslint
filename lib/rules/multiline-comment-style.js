/**
 * @fileoverview enforce a particular style for multiline comments
 * @author Teddy Katz
 */
"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce a particular style for multiline comments",
            category: "Stylistic Issues",
            recommended: false
        },
        fixable: "whitespace",
        schema: [{ enum: ["starred-block", "separate-lines"] }]
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const option = context.options[0] || "starred-block";

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Gets a list of comment lines in a group
         * @param {Token[]} commentGroup A group of comments, containing either multiple line comments or a single block comment
         * @returns {string[]} A list of comment lines
         */
        function getCommentLines(commentGroup) {
            if (commentGroup[0].type === "Line") {
                return commentGroup.map(comment => comment.value);
            }
            return commentGroup[0].value
                .split(astUtils.LINEBREAK_MATCHER)
                .map(line => line.replace(/^\s*\*?/, ""));
        }

        /**
         * Converts a comment into starred-block form
         * @param {Token} firstComment The first comment of the group being converted
         * @param {string[]} commentLinesList A list of lines to appear in the new starred-block comment
         * @returns {string} A representation of the comment value in starred-block form, excluding start and end markers
         */
        function convertToStarredBlock(firstComment, commentLinesList) {
            const initialOffset = sourceCode.text.slice(firstComment.range[0] - firstComment.loc.start.column, firstComment.range[0]);
            const starredLines = commentLinesList.map(line => `${initialOffset} *${line}`);

            return `\n${starredLines.join("\n")}\n${initialOffset} `;
        }

        /**
         * Each method checks a group of comments to see if it's valid according to the given option.
         * @param {Token[]} commentGroup A list of comments that appear together. This will either contain a single
         * block comment or multiple line comments.
         * @returns {void}
         */
        const commentGroupCheckers = {
            "starred-block"(commentGroup) {
                const commentLines = getCommentLines(commentGroup);

                if (commentLines.some(value => value.includes("*/"))) {
                    return;
                }

                if (commentGroup.length > 1) {
                    context.report({
                        loc: {
                            start: commentGroup[0].loc.start,
                            end: commentGroup[commentGroup.length - 1].loc.end
                        },
                        message: "Expected a block comment instead of consecutive line comments.",
                        fix(fixer) {
                            return fixer.replaceTextRange(
                                [commentGroup[0].range[0], commentGroup[commentGroup.length - 1].range[1]],
                                `/*${convertToStarredBlock(commentGroup[0], commentLines)}*/`
                            );
                        }
                    });
                } else {
                    const block = commentGroup[0];
                    const lines = block.value.split(astUtils.LINEBREAK_MATCHER);
                    const expectedLinePrefix = `${sourceCode.text.slice(block.range[0] - block.loc.start.column, block.range[0])} *`;

                    if (!/^\*?\s*$/.test(lines[0])) {
                        const start = block.value.startsWith("*") ? block.range[0] + 1 : block.range[0];

                        context.report({
                            loc: {
                                start: block.loc.start,
                                end: { line: block.loc.start.line, column: block.loc.start.column + 2 }
                            },
                            message: "Expected a linebreak after '/*'.",
                            fix: fixer => fixer.insertTextAfterRange([start, start + 2], `\n${expectedLinePrefix}`)
                        });
                    }

                    if (!/^\s*$/.test(lines[lines.length - 1])) {
                        context.report({
                            loc: {
                                start: { line: block.loc.end.line, column: block.loc.end.column - 2 },
                                end: block.loc.end
                            },
                            message: "Expected a linebreak before '*/'.",
                            fix: fixer => fixer.replaceTextRange([block.range[1] - 2, block.range[1]], `\n${expectedLinePrefix}/`)
                        });
                    }

                    // TODO: clean this up
                    for (let lineNumber = block.loc.start.line + 1; lineNumber <= block.loc.end.line; lineNumber++) {
                        const lineText = sourceCode.lines[lineNumber - 1];

                        if (!lineText.startsWith(expectedLinePrefix)) {
                            context.report({
                                loc: {
                                    start: { line: lineNumber, column: 0 },
                                    end: { line: lineNumber, column: sourceCode.lines[lineNumber - 1].length }
                                },
                                message: /^\s*\*/.test(lineText)
                                    ? "Expected this line to be aligned with the start of the comment."
                                    : "Expected a '*' at the start of this line.",
                                fix(fixer) {

                                    // TODO: Make this more readable, possibly by splitting it into two separate cases.
                                    const lineStartIndex = sourceCode.getIndexFromLoc({ line: lineNumber, column: 0 });
                                    const commentStartIndex = lineStartIndex + lineText.match(/^\s*\*? ?/)[0].length;
                                    const replacementText = lineNumber === block.loc.end.line ? expectedLinePrefix : `${expectedLinePrefix} `;

                                    return fixer.replaceTextRange([lineStartIndex, commentStartIndex], replacementText);
                                }
                            });
                        }
                    }
                }
            },
            "separate-lines"() {

                // TODO
            }
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            Program() {
                return sourceCode.getAllComments()
                    .filter(comment => comment.type !== "Shebang")
                    .filter(comment => !astUtils.COMMENTS_IGNORE_PATTERN.test(comment.value))
                    .filter(comment => {
                        const tokenBefore = sourceCode.getTokenBefore(comment, { includeComments: true });

                        return !tokenBefore || tokenBefore.loc.end.line < comment.loc.start.line;
                    })
                    .reduce((commentGroups, comment, index, commentList) => {
                        if (
                            comment.type === "Line" &&
                            index && commentList[index - 1].type === "Line" &&
                            sourceCode.getTokenBefore(comment, { includeComments: true }) === commentList[index - 1]
                        ) {
                            commentGroups[commentGroups.length - 1].push(comment);
                        } else {
                            commentGroups.push([comment]);
                        }

                        return commentGroups;
                    }, [])
                    .filter(commentGroup => !(commentGroup.length === 1 && commentGroup[0].loc.start.line === commentGroup[0].loc.end.line))
                    .forEach(commentGroupCheckers[option]);
            }
        };
    }
};
