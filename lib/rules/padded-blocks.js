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

    create(context) {
        const options = {};
        const config = context.options[0] || "always";

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

        const ALWAYS_MESSAGE = "Block must be padded by blank lines.",
            NEVER_MESSAGE = "Block must not be padded by blank lines.";

        const sourceCode = context.getSourceCode();

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
            const tokenStartLine = token.loc.start.line,
                expectedFirstLine = tokenStartLine + 2;
            let first = token;

            do {
                first = sourceCode.getTokenAfter(first, { includeComments: true });
            } while (isComment(first) && first.loc.start.line === tokenStartLine);

            const firstLine = first.loc.start.line;

            return expectedFirstLine <= firstLine;
        }

        /**
         * Checks if the given token is preceeded by a blank line.
         * @param {Token} token The token to check
         * @returns {boolean} Whether or not the token is preceeded by a blank line
         */
        function isTokenBottomPadded(token) {
            const blockEnd = token.loc.end.line,
                expectedLastLine = blockEnd - 2;
            let last = token;

            do {
                last = sourceCode.getTokenBefore(last, { includeComments: true });
            } while (isComment(last) && last.loc.end.line === blockEnd);

            const lastLine = last.loc.end.line;

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
            const openBrace = getOpenBrace(node),
                closeBrace = sourceCode.getLastToken(node),
                blockHasTopPadding = isTokenTopPadded(openBrace),
                blockHasBottomPadding = isTokenBottomPadded(closeBrace);

            if (requirePaddingFor(node)) {
                if (!blockHasTopPadding) {
                    context.report({
                        node,
                        loc: { line: openBrace.loc.start.line, column: openBrace.loc.start.column },
                        fix(fixer) {
                            return fixer.insertTextAfter(openBrace, "\n");
                        },
                        message: ALWAYS_MESSAGE
                    });
                }
                if (!blockHasBottomPadding) {
                    context.report({
                        node,
                        loc: { line: closeBrace.loc.end.line, column: closeBrace.loc.end.column - 1 },
                        fix(fixer) {
                            return fixer.insertTextBefore(closeBrace, "\n");
                        },
                        message: ALWAYS_MESSAGE
                    });
                }
            } else {
                if (blockHasTopPadding) {
                    const nextToken = sourceCode.getTokenAfter(openBrace, { includeComments: true });

                    context.report({
                        node,
                        loc: { line: openBrace.loc.start.line, column: openBrace.loc.start.column },
                        fix(fixer) {

                            // FIXME: The start of this range is sometimes larger than the end.
                            // https://github.com/eslint/eslint/issues/8116
                            return fixer.replaceTextRange([openBrace.end, nextToken.start - nextToken.loc.start.column], "\n");
                        },
                        message: NEVER_MESSAGE
                    });
                }

                if (blockHasBottomPadding) {
                    const previousToken = sourceCode.getTokenBefore(closeBrace, { includeComments: true });

                    context.report({
                        node,
                        loc: { line: closeBrace.loc.end.line, column: closeBrace.loc.end.column - 1 },
                        message: NEVER_MESSAGE,
                        fix(fixer) {
                            return fixer.replaceTextRange([previousToken.end, closeBrace.start - closeBrace.loc.start.column], "\n");
                        }
                    });
                }
            }
        }

        const rule = {};

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
