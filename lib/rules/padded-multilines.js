/**
 * @fileoverview A rule to ensure blank lines around multi-line blocks
 * @author Jinxuan Zhu <https://github.com/zhujinxuan>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce blank lines shall around multi-line blocks",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/padded-multilines"
        },
        messages: {
            before: "Missing blank line before a multi-lines block",
            after: "Missing blank line after a multi-lines block"
        },
        fixable: "code",
        schema: [
            {
                type: "string",
                enum: ["return", "comment"]
            },
            {
                type: "string",
                enum: ["return", "comment"]
            }
        ]
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const lines = sourceCode.getLines();
        const { options = [] } = context;
        const hasReturn = options.includes("return");
        const hasComment = options.includes("comment");

        /**
         * Find the previous blank line or block start
         * @param{ASTNode} node The node to verify
         * @returns {number} the line number of blank line or block start
         */
        function findBeforeBlankOrStopLineNumber(node) {
            const { parent, loc } = node;
            let { line } = loc.start;
            const blockLine = parent.loc.start.line;

            while (line > blockLine) {
                const code = lines[line - 1];

                if (code.trim() === "") {
                    return line;
                }
                line--;
            }
            return blockLine;
        }

        /**
         * Is a line filled by comment
         * @param{number} line The line number of node
         * @param{Array<Comment>} comments All comments before node;
         * @returns {number|void} the line number ouside of the comment, or null if this line is not a comment
         */
        function isComment(line, comments) {
            const comment = comments.find(c => {
                const { start, end } = c.loc;

                return start.line <= line && line <= end.line;
            });

            if (!comment) {
                return null;
            }

            const { start, end } = comment.loc;
            const code = lines[line - 1];


            if (start.line === line) {
                const { column } = start;

                if (code.slice(0, column).trim() !== "") {
                    return null;
                }
            }

            if (end.line === line) {
                const { column } = end;

                if (code.slice(column).trim() !== "") {
                    return null;
                }
            }

            return end.line + 1;
        }

        /**
         * Generate Report before the node
         * @param{ASTNode} node The node to verify
         * @returns {void}
         */
        function reportBefore(node) {
            context.report({
                node,
                loc: node.loc.start,
                messageId: "before",
                fix(fixer) {
                    return fixer.insertTextBefore(node, "\n");
                }
            });
        }

        /**
         * Enforce blank like before a multi-lines block
         * @param{ASTNode} node The node to verify
         * @returns {void}
         */
        function checkBefore(node) {
            const { loc, parent } = node;

            if (parent.loc.start.line >= loc.start.line - 1) {
                return;
            }


            const blankLine = findBeforeBlankOrStopLineNumber(node);

            if (!hasComment) {
                if (blankLine < loc.start.line - 1) {
                    reportBefore(node);
                }
                return;
            }

            const comments = sourceCode.getCommentsBefore(node);

            for (let line = blankLine + 1; line < loc.start.line;) {
                line = isComment(line, comments);
                if (!line) {
                    reportBefore(node);
                    return;
                }
            }
        }

        /**
         * Generate Report after node
         * @param{ASTNode} node The node to verify
         * @returns {void}
         */
        function reportAfter(node) {
            context.report({
                node,
                loc: node.loc.end,
                messageId: "after",
                fix(fixer) {
                    return fixer.insertTextAfter(node, "\n");
                }
            });
        }

        /**
         * Enforce blank like after a multi-lines block
         * @param{ASTNode} node The node to verify
         * @returns {void}
         */
        function checkAfter(node) {
            const { loc, parent } = node;
            const { line } = loc.end;

            if (parent.loc.end.line <= line + 1) {
                return;
            }

            if (lines[line - 1].trim() === "" || lines[line].trim() === "") {
                return;
            }

            if (!hasReturn || parent.loc.end.line > line + 2) {
                reportAfter(node);
                return;
            }

            const token = context.getSourceCode().getTokenAfter(node);

            if (token.value === "return") {
                return;
            }
            reportAfter(node);
        }

        /**
         * Enforce blank line before and after multi-line blocks
         * @param{ASTNode} node The node to verify
         * @returns {void}
         */
        function check(node) {
            const { loc, parent } = node;

            if (loc.start.line === loc.end.line) {
                return;
            }

            if (!parent) {
                return;
            }

            if (parent.type !== "BlockStatement") {
                return;
            }

            checkBefore(node);
            checkAfter(node);
        }

        return {
            "*": check
        };
    }
};
