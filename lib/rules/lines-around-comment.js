/**
 * @fileoverview Enforces empty lines around comments.
 * @author Jamund Ferguson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const lodash = require("lodash"),
    astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const LT = `[${Array.from(astUtils.LINEBREAKS).join("")}]`;
const PADDING_LINE_SEQUENCE = new RegExp(
    String.raw`^(\s*?${LT})\s*${LT}(\s*;?)$`,
    "u"
);

/**
 * Return an array with with any line numbers that are empty.
 * @param {Array} lines An array of each line of the file.
 * @returns {Array} An array of line numbers.
 */
function getEmptyLineNums(lines) {
    const emptyLines = lines.map((line, i) => ({
        code: line.trim(),
        num: i + 1
    })).filter(line => !line.code).map(line => line.num);

    return emptyLines;
}

/**
 * Return an array with with any line numbers that contain comments.
 * @param {Array} comments An array of comment tokens.
 * @returns {Array} An array of line numbers.
 */
function getCommentLineNums(comments) {
    const lines = [];

    comments.forEach(token => {
        const start = token.loc.start.line;
        const end = token.loc.end.line;

        lines.push(start, end);
    });
    return lines;
}

/**
 * This returns the concatenation of the first 2 captured strings.
 * @param {string} _ Unused. Whole matched string.
 * @param {string} trailingSpaces The trailing spaces of the first line.
 * @param {string} indentSpaces The indentation spaces of the last line.
 * @returns {string} The concatenation of trailingSpaces and indentSpaces.
 * @private
 */
function replacerToRemovePaddingLines(_, trailingSpaces, indentSpaces) {
    return trailingSpaces + indentSpaces;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "require empty lines around comments",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/lines-around-comment"
        },

        fixable: "whitespace",

        schema: [
            {
                type: "object",
                properties: {
                    beforeBlockComment: {
                        type: "boolean"
                    },
                    afterBlockComment: {
                        type: "boolean"
                    },
                    beforeLineComment: {
                        type: "boolean"
                    },
                    afterLineComment: {
                        type: "boolean"
                    },
                    allowBlockStart: {
                        type: "boolean",
                        default: false
                    },
                    allowBlockEnd: {
                        type: "boolean",
                        default: false
                    },
                    allowClassStart: {
                        type: "boolean"
                    },
                    allowClassEnd: {
                        type: "boolean"
                    },
                    allowObjectStart: {
                        type: "boolean"
                    },
                    allowObjectEnd: {
                        type: "boolean"
                    },
                    allowArrayStart: {
                        type: "boolean"
                    },
                    allowArrayEnd: {
                        type: "boolean"
                    },
                    ignorePattern: {
                        type: "string"
                    },
                    applyDefaultIgnorePatterns: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            "expected-after": "Expected line after comment.",
            "unexpected-after": "Unexpected line after comment.",
            "expected-before": "Expected line before comment.",
            "unexpected-before": "Unexpected line before comment."
        }
    },

    create(context) {

        const options = Object.assign({}, context.options[0]);
        const ignorePattern = options.ignorePattern;
        const defaultIgnoreRegExp = astUtils.COMMENTS_IGNORE_PATTERN;
        const customIgnoreRegExp = new RegExp(ignorePattern, "u");
        const applyDefaultIgnorePatterns = options.applyDefaultIgnorePatterns !== false;

        options.beforeBlockComment = "beforeBlockComment" in options ? options.beforeBlockComment : true;

        const sourceCode = context.getSourceCode();

        const lines = sourceCode.lines,
            comments = sourceCode.getAllComments(),
            commentLines = getCommentLineNums(comments),
            emptyLines = getEmptyLineNums(lines),
            commentAndEmptyLines = commentLines.concat(emptyLines);

        /**
         * Returns whether or not comments are on lines starting with or ending with code
         * @param {token} token The comment token to check.
         * @returns {boolean} True if the comment is not alone.
         */
        function codeAroundComment(token) {
            let currentToken = token;

            do {
                currentToken = sourceCode.getTokenBefore(currentToken, { includeComments: true });
            } while (currentToken && astUtils.isCommentToken(currentToken));

            if (currentToken && astUtils.isTokenOnSameLine(currentToken, token)) {
                return true;
            }

            currentToken = token;
            do {
                currentToken = sourceCode.getTokenAfter(currentToken, { includeComments: true });
            } while (currentToken && astUtils.isCommentToken(currentToken));

            if (currentToken && astUtils.isTokenOnSameLine(token, currentToken)) {
                return true;
            }

            return false;
        }

        /**
         * Returns whether or not comments are inside a node type or not.
         * @param {ASTNode} parent The Comment parent node.
         * @param {string} nodeType The parent type to check against.
         * @returns {boolean} True if the comment is inside nodeType.
         */
        function isParentNodeType(parent, nodeType) {
            return parent.type === nodeType ||
                (parent.body && parent.body.type === nodeType) ||
                (parent.consequent && parent.consequent.type === nodeType);
        }

        /**
         * Returns the parent node that contains the given token.
         * @param {token} token The token to check.
         * @returns {ASTNode} The parent node that contains the given token.
         */
        function getParentNodeOfToken(token) {
            return sourceCode.getNodeByRangeIndex(token.range[0]);
        }

        /**
         * Returns whether or not comments are at the parent start or not.
         * @param {token} token The Comment token.
         * @param {string} nodeType The parent type to check against.
         * @returns {boolean} True if the comment is at parent start.
         */
        function isCommentAtParentStart(token, nodeType) {
            const parent = getParentNodeOfToken(token);

            return parent && isParentNodeType(parent, nodeType) &&
                    token.loc.start.line - parent.loc.start.line === 1;
        }

        /**
         * Returns whether or not comments are at the parent end or not.
         * @param {token} token The Comment token.
         * @param {string} nodeType The parent type to check against.
         * @returns {boolean} True if the comment is at parent end.
         */
        function isCommentAtParentEnd(token, nodeType) {
            const parent = getParentNodeOfToken(token);

            return parent && isParentNodeType(parent, nodeType) &&
                    parent.loc.end.line - token.loc.end.line === 1;
        }

        /**
         * Returns whether or not comments are at the block start or not.
         * @param {token} token The Comment token.
         * @returns {boolean} True if the comment is at block start.
         */
        function isCommentAtBlockStart(token) {
            return isCommentAtParentStart(token, "ClassBody") || isCommentAtParentStart(token, "BlockStatement") || isCommentAtParentStart(token, "SwitchCase");
        }

        /**
         * Returns whether or not comments are at the block end or not.
         * @param {token} token The Comment token.
         * @returns {boolean} True if the comment is at block end.
         */
        function isCommentAtBlockEnd(token) {
            return isCommentAtParentEnd(token, "ClassBody") || isCommentAtParentEnd(token, "BlockStatement") || isCommentAtParentEnd(token, "SwitchCase") || isCommentAtParentEnd(token, "SwitchStatement");
        }

        /**
         * Returns whether or not comments are at the class start or not.
         * @param {token} token The Comment token.
         * @returns {boolean} True if the comment is at class start.
         */
        function isCommentAtClassStart(token) {
            return isCommentAtParentStart(token, "ClassBody");
        }

        /**
         * Returns whether or not comments are at the class end or not.
         * @param {token} token The Comment token.
         * @returns {boolean} True if the comment is at class end.
         */
        function isCommentAtClassEnd(token) {
            return isCommentAtParentEnd(token, "ClassBody");
        }

        /**
         * Returns whether or not comments are at the object start or not.
         * @param {token} token The Comment token.
         * @returns {boolean} True if the comment is at object start.
         */
        function isCommentAtObjectStart(token) {
            return isCommentAtParentStart(token, "ObjectExpression") || isCommentAtParentStart(token, "ObjectPattern");
        }

        /**
         * Returns whether or not comments are at the object end or not.
         * @param {token} token The Comment token.
         * @returns {boolean} True if the comment is at object end.
         */
        function isCommentAtObjectEnd(token) {
            return isCommentAtParentEnd(token, "ObjectExpression") || isCommentAtParentEnd(token, "ObjectPattern");
        }

        /**
         * Returns whether or not comments are at the array start or not.
         * @param {token} token The Comment token.
         * @returns {boolean} True if the comment is at array start.
         */
        function isCommentAtArrayStart(token) {
            return isCommentAtParentStart(token, "ArrayExpression") || isCommentAtParentStart(token, "ArrayPattern");
        }

        /**
         * Returns whether or not comments are at the array end or not.
         * @param {token} token The Comment token.
         * @returns {boolean} True if the comment is at array end.
         */
        function isCommentAtArrayEnd(token) {
            return isCommentAtParentEnd(token, "ArrayExpression") || isCommentAtParentEnd(token, "ArrayPattern");
        }

        /**
         * Checks if a comment token has lines around it (ignores inline comments)
         * @param {token} token The Comment token.
         * @param {Object} opts Options to determine the newline.
         * @param {boolean} opts.after Should have a newline after this line.
         * @param {boolean} opts.before Should have a newline before this line.
         * @returns {void}
         */
        function checkForEmptyLine(token, opts) {
            if (applyDefaultIgnorePatterns && defaultIgnoreRegExp.test(token.value)) {
                return;
            }

            if (ignorePattern && customIgnoreRegExp.test(token.value)) {
                return;
            }

            const after = opts.after,
                before = opts.before;

            const prevLineNum = token.loc.start.line - 1,
                nextLineNum = token.loc.end.line + 1,
                commentIsNotAlone = codeAroundComment(token);

            const blockStartAllowed = options.allowBlockStart &&
                    isCommentAtBlockStart(token) &&
                    !(options.allowClassStart === false &&
                    isCommentAtClassStart(token)),
                blockEndAllowed = options.allowBlockEnd && isCommentAtBlockEnd(token) && !(options.allowClassEnd === false && isCommentAtClassEnd(token)),
                classStartAllowed = options.allowClassStart && isCommentAtClassStart(token),
                classEndAllowed = options.allowClassEnd && isCommentAtClassEnd(token),
                objectStartAllowed = options.allowObjectStart && isCommentAtObjectStart(token),
                objectEndAllowed = options.allowObjectEnd && isCommentAtObjectEnd(token),
                arrayStartAllowed = options.allowArrayStart && isCommentAtArrayStart(token),
                arrayEndAllowed = options.allowArrayEnd && isCommentAtArrayEnd(token);

            const exceptionStartAllowed = blockStartAllowed || classStartAllowed || objectStartAllowed || arrayStartAllowed;
            const exceptionEndAllowed = blockEndAllowed || classEndAllowed || objectEndAllowed || arrayEndAllowed;

            // we ignore all inline comments
            if (commentIsNotAlone) {
                return;
            }

            const previousTokenOrComment = sourceCode.getTokenBefore(token, { includeComments: true });
            const nextTokenOrComment = sourceCode.getTokenAfter(token, { includeComments: true });

            // check for newline before
            if (typeof before === "boolean" && !exceptionStartAllowed && previousTokenOrComment &&
                    !(astUtils.isCommentToken(previousTokenOrComment) && astUtils.isTokenOnSameLine(previousTokenOrComment, token))) {
                if (before && !lodash.includes(commentAndEmptyLines, prevLineNum)) {
                    const lineStart = token.range[0] - token.loc.start.column;
                    const range = [lineStart, lineStart];

                    context.report({
                        node: token,
                        messageId: "expected-before",
                        fix(fixer) {
                            return fixer.insertTextBeforeRange(range, "\n");
                        }
                    });
                }
                if (!before && lodash.includes(emptyLines, prevLineNum)) {
                    const start = previousTokenOrComment.range[1];
                    const end = token.range[0];
                    const text = context.getSourceCode().text
                        .slice(start, end)
                        .replace(PADDING_LINE_SEQUENCE, replacerToRemovePaddingLines);

                    context.report({
                        node: token,
                        messageId: "unexpected-before",
                        fix(fixer) {
                            return fixer.replaceTextRange([start, end], text);
                        }
                    });
                }
            }

            // check for newline after
            if (typeof after === "boolean" && !exceptionEndAllowed && nextTokenOrComment &&
                    !(astUtils.isCommentToken(nextTokenOrComment) && astUtils.isTokenOnSameLine(token, nextTokenOrComment))) {
                if (after && !lodash.includes(commentAndEmptyLines, nextLineNum)) {
                    context.report({
                        node: token,
                        messageId: "expected-after",
                        fix(fixer) {
                            return fixer.insertTextAfter(token, "\n");
                        }
                    });
                }
                if (!after && lodash.includes(emptyLines, nextLineNum)) {
                    const start = token.range[1];
                    const end = nextTokenOrComment.range[0];
                    const text = context.getSourceCode().text
                        .slice(start, end)
                        .replace(PADDING_LINE_SEQUENCE, replacerToRemovePaddingLines);

                    context.report({
                        node: token,
                        messageId: "unexpected-after",
                        fix(fixer) {
                            return fixer.replaceTextRange([start, end], text);
                        }
                    });
                }
            }

        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            Program() {
                comments.forEach(token => {
                    if (token.type === "Line") {
                        if (typeof options.beforeLineComment === "boolean" || typeof options.afterLineComment === "boolean") {
                            checkForEmptyLine(token, {
                                after: options.afterLineComment,
                                before: options.beforeLineComment
                            });
                        }
                    } else if (token.type === "Block") {
                        if (typeof options.beforeBlockComment === "boolean" || typeof options.afterBlockComment === "boolean") {
                            checkForEmptyLine(token, {
                                after: options.afterBlockComment,
                                before: options.beforeBlockComment
                            });
                        }
                    }
                });
            }
        };
    }
};
