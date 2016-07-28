/**
 * @fileoverview A rule to ensure blank lines within blocks.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var choiceType = {
    enum: ["always", "never"]
};

var insideOptions = {
    type: "object",
    properties: {
        blocks: choiceType,
        switches: choiceType,
        classes: choiceType
    },
    additionalProperties: false,
    minProperties: 1
};

module.exports = {
    meta: {
        docs: {
            description: "require or disallow padding within and outside blocks",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                oneOf: [
                    choiceType,
                    insideOptions,
                    {
                        type: "object",
                        properties: {
                            above: choiceType,
                            below: choiceType,
                            inside: {
                                oneOf: [choiceType, insideOptions]
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
        var options = { inside: {} };
        var config = context.options[0] || "always";

        if (typeof config === "string") {
            options.inside.blocks = config === "always";
        } else if (config.hasOwnProperty("blocks") ||
            config.hasOwnProperty("switches") ||
            config.hasOwnProperty("classes")) {

            if (config.hasOwnProperty("blocks")) {
                options.inside.blocks = config.blocks === "always";
            }
            if (config.hasOwnProperty("switches")) {
                options.inside.switches = config.switches === "always";
            }
            if (config.hasOwnProperty("classes")) {
                options.inside.classes = config.classes === "always";
            }
        } else {
            var inside = config.inside;

            if (inside) {
                if (inside.hasOwnProperty("switches")) {
                    options.inside.switches = inside.switches === "always";
                }
                if (inside.hasOwnProperty("switches")) {
                    options.inside.switches = inside.switches === "always";
                }
                if (inside.hasOwnProperty("classes")) {
                    options.inside.classes = inside.classes === "always";
                }
            } else {

                // To maintain backwards compatibility, we enable block
                // checking if no inside options are explicitly set:
                config.inside.blocks = true;
            }

            if (config.hasOwnProperty("above")) {
                options.above = config.above === "always";
            }
            if (config.hasOwnProperty("below")) {
                options.below = config.below === "always";
            }
        }

        var sourceCode = context.getSourceCode();

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
            var tokenStartLine = token.loc.start.line,
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
            var blockEnd = token.loc.end.line,
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
         * Checks if a node should be padded on the inside,
         * according to the rule config.
         * @param {ASTNode} node The AST node to check.
         * @returns {boolean} True if the node should be padded, false otherwise.
         */
        function requireInsidePaddingFor(node) {
            switch (node.type) {
                case "BlockStatement":
                    return options.inside.blocks;
                case "SwitchStatement":
                    return options.inside.switches;
                case "ClassBody":
                    return options.inside.classes;

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
        function checkInsidePadding(node) {
            var openBrace = getOpenBrace(node),
                closeBrace = sourceCode.getLastToken(node),
                blockHasTopPadding = isTokenTopPadded(openBrace),
                blockHasBottomPadding = isTokenBottomPadded(closeBrace),
                ALWAYS_MESSAGE = "Block must be padded by blank lines on the inside.",
                NEVER_MESSAGE = "Block must not be padded by blank lines on the inside.";

            if (requireInsidePaddingFor(node)) {
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
                    var nextToken = sourceCode.getTokenOrCommentAfter(openBrace);

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
                    var previousToken = sourceCode.getTokenOrCommentBefore(closeBrace);

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

        /**
         * Finds the node that "dominates" the given BlockStatement node.
         * Example:
         * Here we're interested in the node corresponding to the VariableDeclaration:
         * var a = function() {}
         *
         * Here we're interested in the IfStatement node:
         * if (a) {}
         * @param  {ASTNode} node The ASTNode we're finding the parent for
         * @returns {ASTNode} node
         */
        function findBlockStartNode(node) {
            var parent = node.parent,
                types = [
                    "SwitchStatement",
                    "ClassBody",
                    "BlockStatement",
                    "Program"
                ];

            return types.indexOf(parent.type) === -1 ? findBlockStartNode(parent) : node;
        }

        /**
         * Checks if the given node is padded on the outside, if required.
         * @param {ASTNode} node AST node
         * @returns {void} undefined.
         */
        function checkOutsidePadding(node) {
            var ALWAYS_MESSAGE = "Block must be padded by blank lines on the outside.",
                NEVER_MESSAGE = "Block must not be padded by blank lines on the outside.",
                startNode = findBlockStartNode(node),
                firstToken = sourceCode.getFirstToken(startNode),
                closeBrace = sourceCode.getLastToken(node),
                tokenBefore = sourceCode.getTokenOrCommentBefore(firstToken),
                tokenAfter = sourceCode.getTokenOrCommentAfter(closeBrace),
                checkAbove = options.hasOwnProperty("above"),
                checkBelow = options.hasOwnProperty("below"),
                blockHasAbovePadding,
                blockHasBelowPadding;

            // Ignore if this is the first block in a program or another block:
            if (checkAbove && tokenBefore && tokenBefore.value !== "{") {
                blockHasAbovePadding = isTokenBottomPadded(firstToken);
                if (options.above && !blockHasAbovePadding) {
                    context.report({
                        node: node,
                        loc: { line: firstToken.loc.start.line, column: firstToken.loc.start.column },

                        // If there's a block below and we're checking it later,
                        // skip the fix for now:
                        fix: (tokenBefore.value !== "}" || !checkBelow) && function(fixer) {
                            return fixer.insertTextBefore(startNode, "\n");
                        },
                        message: ALWAYS_MESSAGE
                    });
                } else if (!options.above && blockHasAbovePadding) {
                    context.report({
                        node: node,
                        loc: { line: firstToken.loc.start.line, column: firstToken.loc.start.column },
                        fix: (tokenBefore.value !== "}" || !checkBelow) && function(fixer) {
                            return fixer.replaceTextRange([tokenBefore.end, startNode.start], "\n");
                        },
                        message: NEVER_MESSAGE
                    });
                }
            }

            // Ignore if this is the final block in a program or another block:
            if (checkBelow && tokenAfter && tokenAfter.value !== "}") {
                blockHasBelowPadding = isTokenTopPadded(closeBrace);
                if (options.below && !blockHasBelowPadding) {
                    context.report({
                        node: node,
                        loc: {line: closeBrace.loc.end.line, column: closeBrace.loc.end.column - 1 },
                        fix: function(fixer) {
                            return fixer.insertTextAfter(closeBrace, "\n");
                        },
                        message: ALWAYS_MESSAGE
                    });
                } else if (!options.below && blockHasBelowPadding) {
                    context.report({
                        node: node,
                        loc: {line: closeBrace.loc.end.line, column: closeBrace.loc.end.column - 1 },
                        fix: function(fixer) {
                            return fixer.replaceTextRange([closeBrace.end, tokenAfter.start], "\n");
                        },
                        message: NEVER_MESSAGE
                    });
                }
            }
        }

        var rule = {};
        var checkOutside = options.hasOwnProperty("above") || options.hasOwnProperty("below");

        if (options.inside.hasOwnProperty("switches") || checkOutside) {
            rule.SwitchStatement = function(node) {
                if (checkOutside) {
                    checkOutsidePadding(node);
                }
                if (node.cases.length === 0) {
                    return;
                }
                if (options.inside.hasOwnProperty("switches")) {
                    checkInsidePadding(node);
                }
            };
        }

        if (options.inside.hasOwnProperty("blocks") || checkOutside) {
            rule.BlockStatement = function(node) {
                if (checkOutside) {
                    checkOutsidePadding(node);
                }
                if (node.body.length === 0) {
                    return;
                }
                if (options.inside.hasOwnProperty("blocks")) {
                    checkInsidePadding(node);
                }
            };
        }

        if (options.inside.hasOwnProperty("classes") || checkOutside) {
            rule.ClassBody = function(node) {
                if (checkOutside) {
                    checkOutsidePadding(node);
                }
                if (node.body.length === 0) {
                    return;
                }
                if (options.inside.hasOwnProperty("classes")) {
                    checkInsidePadding(node);
                }
            };
        }

        return rule;
    }
};
