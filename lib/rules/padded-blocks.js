/**
 * @fileoverview A rule to ensure blank lines within blocks.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require or disallow padding within blocks",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                oneOf: [
                    {
                        enum: ["always", "never"]
                    },
                    {
                        type: "object",
                        properties: {
                            blocks: {
                                enum: ["always", "never"]
                            },
                            switches: {
                                enum: ["always", "never"]
                            },
                            classes: {
                                enum: ["always", "never"]
                            }
                        },
                        additionalProperties: false,
                        minProperties: 1
                    }
                ]
            }
        ]
    },

    create: function(context) {
        let options = {};
        let config = context.options[0] || "always";

        if (typeof config === "string") {
            options.blocks = config === "always";
        } else {
            if (config.hasOwnProperty("blocks")) {
                options.blocks = config.blocks === "always";
            }
            if (config.hasOwnProperty("switches")) {
                options.switches = config.switches === "always";
            }
            if (config.hasOwnProperty("classes")) {
                options.classes = config.classes === "always";
            }
        }

        let ALWAYS_MESSAGE = "Block must be padded by blank lines.",
            NEVER_MESSAGE = "Block must not be padded by blank lines.";

        let sourceCode = context.getSourceCode();

        /**
         * Gets the open brace token from a given node.
         * @param {ASTNode} node - A BlockStatement or SwitchStatement node from which to get the open brace.
         * @returns {Token} The token of the open brace.
         */
        function getOpenBrace(node) {
            if (node.type === "SwitchStatement") {
                return sourceCode.getTokenBefore(node.cases[0]);
            }
            return sourceCode.getFirstToken(node);
        }

        /**
         * Checks if the given parameter is a comment node
         * @param {ASTNode|Token} node An AST node or token
         * @returns {boolean} True if node is a comment
         */
        function isComment(node) {
            return node.type === "Line" || node.type === "Block";
        }

        /**
         * Checks if the given token has a blank line after it.
         * @param {Token} token The token to check.
         * @returns {boolean} Whether or not the token is followed by a blank line.
         */
        function isTokenTopPadded(token) {
            let tokenStartLine = token.loc.start.line,
                expectedFirstLine = tokenStartLine + 2,
                first,
                firstLine;

            first = token;
            do {
                first = sourceCode.getTokenOrCommentAfter(first);
            } while (isComment(first) && first.loc.start.line === tokenStartLine);

            firstLine = first.loc.start.line;
            return expectedFirstLine <= firstLine;
        }

        /**
         * Checks if the given token is preceeded by a blank line.
         * @param {Token} token The token to check
         * @returns {boolean} Whether or not the token is preceeded by a blank line
         */
        function isTokenBottomPadded(token) {
            let blockEnd = token.loc.end.line,
                expectedLastLine = blockEnd - 2,
                last,
                lastLine;

            last = token;
            do {
                last = sourceCode.getTokenOrCommentBefore(last);
            } while (isComment(last) && last.loc.end.line === blockEnd);

            lastLine = last.loc.end.line;
            return lastLine <= expectedLastLine;
        }

        /**
         * Checks if a node should be padded, according to the rule config.
         * @param {ASTNode} node The AST node to check.
         * @returns {boolean} True if the node should be padded, false otherwise.
         */
        function requirePaddingFor(node) {
            switch (node.type) {
                case "BlockStatement":
                    return options.blocks;
                case "SwitchStatement":
                    return options.switches;
                case "ClassBody":
                    return options.classes;

                /* istanbul ignore next */
                default:
                    throw new Error("unreachable");
            }
        }

        /**
         * Checks the given BlockStatement node to be padded if the block is not empty.
         * @param {ASTNode} node The AST node of a BlockStatement.
         * @returns {void} undefined.
         */
        function checkPadding(node) {
            let openBrace = getOpenBrace(node),
                closeBrace = sourceCode.getLastToken(node),
                blockHasTopPadding = isTokenTopPadded(openBrace),
                blockHasBottomPadding = isTokenBottomPadded(closeBrace);

            if (requirePaddingFor(node)) {
                if (!blockHasTopPadding) {
                    context.report({
                        node: node,
                        loc: { line: openBrace.loc.start.line, column: openBrace.loc.start.column },
                        fix: function(fixer) {
                            return fixer.insertTextAfter(openBrace, "\n");
                        },
                        message: ALWAYS_MESSAGE
                    });
                }
                if (!blockHasBottomPadding) {
                    context.report({
                        node: node,
                        loc: {line: closeBrace.loc.end.line, column: closeBrace.loc.end.column - 1 },
                        fix: function(fixer) {
                            return fixer.insertTextBefore(closeBrace, "\n");
                        },
                        message: ALWAYS_MESSAGE
                    });
                }
            } else {
                if (blockHasTopPadding) {
                    let nextToken = sourceCode.getTokenOrCommentAfter(openBrace);

                    context.report({
                        node: node,
                        loc: { line: openBrace.loc.start.line, column: openBrace.loc.start.column },
                        fix: function(fixer) {
                            return fixer.replaceTextRange([openBrace.end, nextToken.start - nextToken.loc.start.column], "\n");
                        },
                        message: NEVER_MESSAGE
                    });
                }

                if (blockHasBottomPadding) {
                    let previousToken = sourceCode.getTokenOrCommentBefore(closeBrace);

                    context.report({
                        node: node,
                        loc: {line: closeBrace.loc.end.line, column: closeBrace.loc.end.column - 1 },
                        message: NEVER_MESSAGE,
                        fix: function(fixer) {
                            return fixer.replaceTextRange([previousToken.end, closeBrace.start - closeBrace.loc.start.column], "\n");
                        }
                    });
                }
            }
        }

        let rule = {};

        if (options.hasOwnProperty("switches")) {
            rule.SwitchStatement = function(node) {
                if (node.cases.length === 0) {
                    return;
                }
                checkPadding(node);
            };
        }

        if (options.hasOwnProperty("blocks")) {
            rule.BlockStatement = function(node) {
                if (node.body.length === 0) {
                    return;
                }
                checkPadding(node);
            };
        }

        if (options.hasOwnProperty("classes")) {
            rule.ClassBody = function(node) {
                if (node.body.length === 0) {
                    return;
                }
                checkPadding(node);
            };
        }

        return rule;
    }
};
