/**
 * @fileoverview Rule to flag block statements that do not use the one true brace style
 * @author Ian Christian Myers
 */

"use strict";

const blocks = [
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
    "IfStatement",
    "TryStatement",
    "DoWhileStatement",
    "WhileStatement",
    "WithStatement",
    "ForStatement",
    "ForInStatement",
    "ForOfStatement",
    "SwitchStatement"
];

const styles = {
    "1tbs": blocks.reduce(function(acc, type) {
        acc[type] = "always";
        return acc;
    }, {}),

    allman: blocks.reduce(function(acc, type) {
        acc[type] = "never";
        return acc;
    }, {})
};

styles.stroustrup = Object.assign({
    noCuddledElse: true,
    noCuddledCatchFinally: true
}, styles["1tbs"]);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent brace style for blocks",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [
            {
                oneOf: [
                    { enum: ["1tbs", "stroustrup", "allman"] },
                    {
                        type: "object",
                        properties: blocks.reduce(function(acc, type) {
                            acc[type] = { enum: ["always", "never", "ignore"] };
                            return acc;
                        }, {})
                    }
                ]
            },
            {
                type: "object",
                properties: {
                    allowSingleLine: { type: "boolean" },
                    noCuddledElse: { type: "boolean" },
                    noCuddledCatchFinally: { type: "boolean" }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        let style = context.options[0] || "1tbs";

        const OPEN_MESSAGE = "Opening curly brace does not appear on the same line as controlling statement.",
            OPEN_MESSAGE_ALLMAN = "Opening curly brace appears on the same line as controlling statement.",
            BODY_MESSAGE = "Statement inside of curly braces should be on next line.",
            CLOSE_MESSAGE = "Closing curly brace does not appear on the same line as the subsequent block.",
            CLOSE_MESSAGE_SINGLE = "Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.",
            CLOSE_MESSAGE_STROUSTRUP_ALLMAN = "Closing curly brace appears on the same line as the subsequent block.";

        if (typeof style === "string") {
            style = styles[style];
        }

        const options = Object.assign({}, style, context.options[1]);

        blocks.forEach(function(type) {
            if (type in options) {
                if (options[type] === "ignore") {
                    delete options[type];
                } else {
                    options[type] = options[type] === "always";
                }
            }
        });

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Determines if a given node is a block statement.
         * @param {ASTNode} node The node to check.
         * @returns {boolean} True if the node is a block statement, false if not.
         * @private
         */
        function isBlock(node) {
            return node && node.type === "BlockStatement";
        }

        /**
         * Check if the token is an punctuator with a value of curly brace
         * @param {Object} token - Token to check
         * @returns {boolean} true if its a curly punctuator
         * @private
         */
        function isCurlyPunctuator(token) {
            return token.value === "{" || token.value === "}";
        }

        /**
         * Binds a list of properties to a function that verifies that the opening
         * curly brace is on the same line as its controlling statement of a given
         * node.
         * @param {ASTNode} node the node to check.
         * @param {boolean} expectSameLine whether the brace should start on the same line.
         * @param {ASTNode} parentNode the parent node.
         * @returns {void}
         * @private
         */
        function checkBlock(node, expectSameLine, parentNode) {
            if (!isBlock(node)) {
                return;
            }

            const previousToken = sourceCode.getTokenBefore(node);
            const curlyToken = sourceCode.getFirstToken(node);
            const curlyTokenEnd = sourceCode.getLastToken(node);
            const allOnSameLine = previousToken.loc.start.line === curlyTokenEnd.loc.start.line;

            if (allOnSameLine && options.allowSingleLine) {
                return;
            }

            const startSameLine = previousToken.loc.start.line === curlyToken.loc.start.line;

            if (startSameLine !== expectSameLine) {
                context.report({
                    node: parentNode || node,
                    message: startSameLine ? OPEN_MESSAGE_ALLMAN : OPEN_MESSAGE
                });
            }

            if (!node.body.length) {
                return;
            }

            if (curlyToken.loc.start.line === node.body[0].loc.start.line) {
                context.report({
                    node: node.body[0],
                    message: BODY_MESSAGE
                });
            }

            const lastToken = node.body[node.body.length - 1];
            const endOnSameLine = curlyTokenEnd.loc.start.line === lastToken.loc.start.line;

            if (endOnSameLine) {
                context.report({
                    node: lastToken,
                    message: CLOSE_MESSAGE_SINGLE
                });
            }
        }

        /**
         * Creates a block check for the given node.
         * @param {string} type the type of AST node.
         * @returns {Function} A function that will check the a node.
         * @private
         */
        function checkNode(type) {
            if (!(type in options)) {
                return () => {};
            }

            return function(node) {
                checkBlock(node.body, options[type], node);
            };
        }

        /**
         * Checks a given block for a cuddled keyword
         * @param {ASTNode} node the node to check.
         * @param {Object} previousToken the previous token.
         * @param {Object} firstToken the first token.
         * @param {boolean} expectSameLine whether the brace should be on the same line
         * @returns {void}
         * @private
         */
        function checkForCuddled(node, previousToken, firstToken, expectSameLine) {
            const closeOnSameLine = previousToken.loc.start.line === firstToken.loc.start.line;

            if (expectSameLine) {
                if (!closeOnSameLine && isCurlyPunctuator(previousToken)) {
                    context.report({
                        node,
                        message: CLOSE_MESSAGE
                    });
                }
            } else if (closeOnSameLine) {
                context.report({
                    node,
                    message: CLOSE_MESSAGE_STROUSTRUP_ALLMAN
                });
            }
        }

        /**
         * Enforces the configured brace style on IfStatements
         * @param {ASTNode} node An IfStatement node.
         * @returns {void}
         * @private
         */
        function checkIfStatement(node) {
            if (!("IfStatement" in options)) {
                return;
            }

            checkBlock(node.consequent, options.IfStatement, node);
            checkBlock(node.alternate, options.IfStatement, node);

            if (node.alternate) {
                const tokens = sourceCode.getTokensBefore(node.alternate, 2);

                checkForCuddled(node.alternate, tokens[0], tokens[1], options.IfStatement && !options.noCuddledElse && isBlock(node.consequent));
            }
        }

        /**
         * Enforces the configured brace style on TryStatements
         * @param {ASTNode} node A TryStatement node.
         * @returns {void}
         * @private
         */
        function checkTryStatement(node) {
            if (!("TryStatement" in options)) {
                return;
            }

            checkBlock(node.block, options.TryStatement, node);

            if (node.handler) {
                checkBlock(node.handler.body, options.TryStatement, node.handler);

                if (isBlock(node.handler.body)) {
                    const previousToken = sourceCode.getTokenBefore(node.handler),
                        firstToken = sourceCode.getFirstToken(node.handler);

                    checkForCuddled(node.handler, previousToken, firstToken, options.TryStatement && !options.noCuddledCatchFinally);
                }
            }

            if (node.finalizer) {
                checkBlock(node.finalizer, options.TryStatement, node);

                if (isBlock(node.finalizer)) {
                    const tokens = sourceCode.getTokensBefore(node.finalizer, 2);

                    checkForCuddled(node.finalizer, tokens[0], tokens[1], options.TryStatement && !options.noCuddledCatchFinally);
                }
            }
        }

        /**
         * Enforces the configured brace style on SwitchStatements
         * @param {ASTNode} node A SwitchStatement node.
         * @returns {void}
         * @private
         */
        function checkSwitchStatement(node) {
            if (!("SwitchStatement" in options)) {
                return;
            }

            let tokens;

            if (node.cases && node.cases.length) {
                tokens = sourceCode.getTokensBefore(node.cases[0], 2);
            } else {
                tokens = sourceCode.getLastTokens(node, 3);
            }

            const sameLine = tokens[0].loc.start.line === tokens[1].loc.start.line;

            if (options.SwitchStatement !== sameLine) {
                context.report({
                    node,
                    message: sameLine ? OPEN_MESSAGE_ALLMAN : OPEN_MESSAGE
                });
            }
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        return {
            FunctionDeclaration: checkNode("FunctionDeclaration"),
            FunctionExpression: checkNode("FunctionExpression"),
            ArrowFunctionExpression: checkNode("ArrowFunctionExpression"),
            IfStatement: checkIfStatement,
            TryStatement: checkTryStatement,
            DoWhileStatement: checkNode("DoWhileStatement"),
            WhileStatement: checkNode("WhileStatement"),
            WithStatement: checkNode("WithStatement"),
            ForStatement: checkNode("ForStatement"),
            ForInStatement: checkNode("ForInStatement"),
            ForOfStatement: checkNode("ForOfStatement"),
            SwitchStatement: checkSwitchStatement
        };
    }
};
