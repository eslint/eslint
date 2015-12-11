/**
 * @fileoverview A rule to ensure blank lines within blocks.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 * @copyright 2014 Mathias Schreck. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var requirePadding = context.options[0] !== "never";

    var ALWAYS_MESSAGE = "Block must be padded by blank lines.",
        NEVER_MESSAGE = "Block must not be padded by blank lines.";

    /**
     * Retrieves an array of all comments defined inside the given node.
     * @param {ASTNode} node The AST node.
     * @returns {ASTNode[]} An array of comment nodes.
     */
    function getCommentsInNode(node) {
        var allComments = context.getAllComments();

        return allComments.filter(function(comment) {
            return node.range[0] < comment.range[0] &&
                node.range[1] > comment.range[1];
        });
    }

    /**
     * Checks if the location of a node or token is before the location of another node or token
     * @param {ASTNode|Token} a The node or token to check if its location is before b.
     * @param {ASTNode|Token} b The node or token which will be compared with a.
     * @returns {boolean} True if a is located before b.
     */
    function isLocatedBefore(a, b) {
        return a.range[1] < b.range[0];
    }

    /**
     * Checks if the given non empty block node has a blank line before its first child node.
     * @param {ASTNode} node The AST node of a BlockStatement.
     * @returns {boolean} Whether or not the block starts with a blank line.
     */
    function isBlockTopPadded(node) {
        var blockStart = node.loc.start.line,
            firstToken = node.body[0],
            expectedFirstLine = blockStart + 2,
            comments = getCommentsInNode(node),
            firstComment = comments[0],
            firstLine;

        if (firstComment && isLocatedBefore(firstComment, firstToken)) {
            firstToken = firstComment;
        }
        firstLine = firstToken.loc.start.line;
        var lineDiff = firstLine - expectedFirstLine + 1;

        return [lineDiff, firstToken];
    }

    /**
     * Checks if the given non empty block node has a blank line after its last child node.
     * @param {ASTNode} node The AST node of a BlockStatement.
     * @returns {boolean} Whether or not the block ends with a blank line.
     */
    function isBlockBottomPadded(node) {
        var blockEnd = node.loc.end.line,
            last = node.body[node.body.length - 1],
            lastToken = context.getLastToken(last),
            lastLine = lastToken.loc.end.line,
            expectedLastLine = blockEnd - 2,
            comments = getCommentsInNode(node),
            lastComment = comments[comments.length - 1];

        if (lastComment && isLocatedBefore(lastToken, lastComment)) {
            last = lastComment;
        }
        lastLine = last.loc.end.line;
        var lineDiff = expectedLastLine - lastLine + 1;
        return [lineDiff, last];
    }

    /**
     * Checks the given BlockStatement node to be padded if the block is not empty.
     * @param {ASTNode} node The AST node of a BlockStatement.
     * @returns {void} undefined.
     */
    function checkPadding(node) {
        if (node.body.length > 0) {

            var blockTopPadding = isBlockTopPadded(node);
            var blockBottomPadding = isBlockBottomPadded(node);

            var blockDiffTopPadding = blockTopPadding[0],
                blockDiffBottomPadding = blockBottomPadding[0],
                blockTopPaddingLine = blockTopPadding[1],
                blockBottomPaddingLine = blockBottomPadding[1];

            if (requirePadding) {
                if (blockDiffTopPadding < 1) {
                    context.report({
                        fix: function(fixer) {
                            var newLines = new Array(2 - blockDiffTopPadding).join("\n");
                            return fixer.insertTextBefore(blockTopPaddingLine, newLines);
                        }, node: node, message: ALWAYS_MESSAGE});
                }

                if (blockDiffBottomPadding < 1) {
                    context.report({
                        fix: function(fixer) {
                            var newLines = new Array(2 - blockDiffBottomPadding).join("\n");
                            return fixer.insertTextAfter(blockBottomPaddingLine, newLines);
                        },
                        node: node,
                        loc: node.loc.end,
                        message: ALWAYS_MESSAGE
                    });
                }
            } else {
                if (blockDiffTopPadding >= 1) {
                    context.report({
                        fix: function(fixer) {
                            return fixer.removeRange([blockTopPaddingLine.range[0] - blockDiffTopPadding, blockTopPaddingLine.range[0]]);
                        },
                        node: node,
                        message: NEVER_MESSAGE
                    });
                }

                if (blockDiffBottomPadding >= 1) {
                    context.report({
                        fix: function(fixer) {
                            return fixer.removeRange([blockBottomPaddingLine.range[1], blockBottomPaddingLine.range[1] + blockDiffBottomPadding]);
                        },
                        node: node,
                        loc: node.loc.end,
                        message: NEVER_MESSAGE
                    });
                }
            }
        }
    }

    return {
        "BlockStatement": checkPadding
    };

};

module.exports.schema = [
    {
        "enum": ["always", "never"]
    }
];
