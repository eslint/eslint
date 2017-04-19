/**
 * @fileoverview This option sets a specific tab width for your code
 *
 * This rule has been ported and modified from nodeca.
 * @author Vitaly Puzrin
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const lodash = require("lodash");
const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/*
 * General rule strategy:
 * 1. An OffsetStorage instance stores a map of desired offsets, where each token has a specified offset from another
 *    specified token or to the first column.
 * 2. As the AST is traversed, modify the desired offsets of tokens accordingly. For example, when entering a
 *    BlockStatement, offset all of the tokens in the BlockStatement by 1 indent level from the opening curly
 *    brace of the BlockStatement.
 * 3. After traversing the AST, calculate the expected indentation levels of every token according to the
 *    OffsetStorage container.
 * 4. For each line, compare the expected indentation of the first token to the actual indentation in the file,
 *    and report the token if the two values are not equal.
 */

/**
 * A helper class to get token-based info related to indentation
 */
class TokenInfo {

    /**
     * @param {SourceCode} sourceCode A SourceCode object
     */
    constructor(sourceCode) {
        this.sourceCode = sourceCode;
        this.firstTokensByLineNumber = sourceCode.tokensAndComments.reduce((map, token) => {
            if (!map.has(token.loc.start.line)) {
                map.set(token.loc.start.line, token);
            }
            if (!map.has(token.loc.end.line)) {
                map.set(token.loc.end.line, token);
            }
            return map;
        }, new Map());
    }

    /**
     * Gets all tokens and comments
     * @returns {Token[]} A list of all tokens and comments
     */
    getAllTokens() {
        return this.sourceCode.tokensAndComments;
    }

    /**
    * Gets the first token on a given token's line
    * @param {Token|ASTNode} token a node or token
    * @returns {Token} The first token on the given line
    */
    getFirstTokenOfLine(token) {
        return this.firstTokensByLineNumber.get(token.loc.start.line);
    }

    /**
    * Determines whether a token is the first token in its line
    * @param {Token} token The token
    * @returns {boolean} `true` if the token is the first on its line
    */
    isFirstTokenOfLine(token) {
        return this.getFirstTokenOfLine(token) === token;
    }

    /**
     * Get the actual indent of a token
     * @param {Token} token Token to examine. This should be the first token on its line.
     * @returns {string} The indentation characters that precede the token
     */
    getTokenIndent(token) {
        return this.sourceCode.text.slice(token.range[0] - token.loc.start.column, token.range[0]);
    }
}

/**
 * A class to store information on desired offsets of tokens from each other
 */
class OffsetStorage {

    /**
     * @param {TokenInfo} tokenInfo a TokenInfo instance
     * @param {string} indentType The desired type of indentation (either "space" or "tab")
     * @param {number} indentSize The desired size of each indentation level
     */
    constructor(tokenInfo, indentType, indentSize) {
        this.tokenInfo = tokenInfo;
        this.indentType = indentType;
        this.indentSize = indentSize;

        /*
         * desiredOffsets, lockedFirstTokens, and desiredIndentCache conceptually map tokens to something else.
         * However, they're implemented as objects with range indices as keys because this improves performance as of Node 7.
         * This uses the assumption that no two tokens start at the same index in the program.
         *
         * The values of the desiredOffsets map are objects with the schema { offset: number, from: Token|null }.
         * These objects should not be mutated or exposed outside of OffsetStorage.
         */
        const NO_OFFSET = { offset: 0, from: null };

        this.desiredOffsets = tokenInfo.getAllTokens().reduce((desiredOffsets, token) => {
            desiredOffsets[token.range[0]] = NO_OFFSET;

            return desiredOffsets;
        }, Object.create(null));
        this.lockedFirstTokens = Object.create(null);
        this.desiredIndentCache = Object.create(null);
        this.ignoredTokens = new WeakSet();
    }

    /**
    * Sets the indent of one token to match the indent of another.
    * @param {Token} baseToken The first token
    * @param {Token} offsetToken The second token, whose indent should be matched to the first token
    * @returns {void}
    */
    matchIndentOf(baseToken, offsetToken) {
        if (baseToken !== offsetToken) {
            this.desiredOffsets[offsetToken.range[0]] = { offset: 0, from: baseToken };
        }
    }

    /**
     * Sets the offset column of token B to match the offset column of token A.
     * This is different from matchIndentOf because it matches a *column*, even if baseToken is not
     * the first token on its line.
     * @param {Token} baseToken The first token
     * @param {Token} offsetToken The second token, whose offset should be matched to the first token
     * @returns {void}
     */
    matchOffsetOf(baseToken, offsetToken) {

        /*
         * lockedFirstTokens is a map from a token whose indentation is controlled by the "first" option to
         * the token that it depends on. For example, with the `ArrayExpression: first` option, the first
         * token of each element in the array after the first will be mapped to the first token of the first
         * element. The desired indentation of each of these tokens is computed based on the desired indentation
         * of the "first" element, rather than through the normal offset mechanism.
         */
        this.lockedFirstTokens[offsetToken.range[0]] = baseToken;
    }

    /**
    * Sets the desired offset of a token
    * @param {Token} token The token
    * @param {Token} offsetFrom The token that this is offset from
    * @param {number} offset The desired indent level
    * @returns {void}
    */
    setDesiredOffset(token, offsetFrom, offset) {
        if (offsetFrom && token.loc.start.line === offsetFrom.loc.start.line) {
            this.matchIndentOf(offsetFrom, token);
        } else {
            this.desiredOffsets[token.range[0]] = { offset, from: offsetFrom };
        }
    }

    /**
    * Sets the desired offset of multiple tokens
    * @param {Token[]} tokens A list of tokens. These tokens should be consecutive.
    * @param {Token} offsetFrom The token that this is offset from
    * @param {number} offset The desired indent level
    * @returns {void}
    */
    setDesiredOffsets(tokens, offsetFrom, offset) {

        /*
         * TODO: (not-an-aardvark) This function is the main performance holdup for this rule. It works
         * by setting the desired offset of each token to the given amount relative to the parent, but it's
         * frequently called with a large list of tokens, and it takes time to set the offset for each token
         * individually. Since the tokens are always consecutive, it might be possible to improve performance
         * here by changing the data structure used to store offsets (e.g. allowing a *range* of tokens to
         * be offset rather than offsetting each token individually).
         */
        tokens.forEach(token => this.setDesiredOffset(token, offsetFrom, offset));
    }

    /**
    * Gets the desired indent of a token
    * @param {Token} token The token
    * @returns {number} The desired indent of the token
    */
    getDesiredIndent(token) {
        if (!(token.range[0] in this.desiredIndentCache)) {

            if (this.ignoredTokens.has(token)) {

                // If the token is ignored, use the actual indent of the token as the desired indent.
                // This ensures that no errors are reported for this token.
                this.desiredIndentCache[token.range[0]] = this.tokenInfo.getTokenIndent(token).length / this.indentSize;
            } else if (token.range[0] in this.lockedFirstTokens) {
                const firstToken = this.lockedFirstTokens[token.range[0]];

                this.desiredIndentCache[token.range[0]] =

                    // (indentation for the first element's line)
                    this.getDesiredIndent(this.tokenInfo.getFirstTokenOfLine(firstToken)) +

                        // (space between the start of the first element's line and the first element)
                        (firstToken.loc.start.column - this.tokenInfo.getFirstTokenOfLine(firstToken).loc.start.column) / this.indentSize;
            } else {
                const offsetInfo = this.desiredOffsets[token.range[0]];

                this.desiredIndentCache[token.range[0]] = offsetInfo.offset + (offsetInfo.from ? this.getDesiredIndent(offsetInfo.from) : 0);
            }
        }
        return this.desiredIndentCache[token.range[0]];
    }

    /**
    * Ignores a token, preventing it from being reported.
    * @param {Token} token The token
    * @returns {void}
    */
    ignoreToken(token) {
        if (this.tokenInfo.isFirstTokenOfLine(token)) {
            this.ignoredTokens.add(token);
        }
    }

    /**
     * Gets the first token that the given token's indentation is dependent on
     * @param {Token} token The token
     * @returns {Token} The token that the given token depends on, or `null` if the given token is at the top level
     */
    getFirstDependency(token) {
        return this.desiredOffsets[token.range[0]].from;
    }

    /**
     * Increases the offset for a token from its parent by the given amount
     * @param {Token} token The token whose offset should be increased
     * @param {number} amount The number of indent levels that the offset should increase by
     * @returns {void}
     */
    increaseOffset(token, amount) {
        const currentOffsetInfo = this.desiredOffsets[token.range[0]];

        this.desiredOffsets[token.range[0]] = { offset: currentOffsetInfo.offset + amount, from: currentOffsetInfo.from };
    }
}

const ELEMENT_LIST_SCHEMA = {
    oneOf: [
        {
            type: "integer",
            minimum: 0
        },
        {
            enum: ["first", "off"]
        }
    ]
};

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent indentation",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                oneOf: [
                    {
                        enum: ["tab"]
                    },
                    {
                        type: "integer",
                        minimum: 0
                    }
                ]
            },
            {
                type: "object",
                properties: {
                    SwitchCase: {
                        type: "integer",
                        minimum: 0
                    },
                    VariableDeclarator: {
                        oneOf: [
                            {
                                type: "integer",
                                minimum: 0
                            },
                            {
                                type: "object",
                                properties: {
                                    var: {
                                        type: "integer",
                                        minimum: 0
                                    },
                                    let: {
                                        type: "integer",
                                        minimum: 0
                                    },
                                    const: {
                                        type: "integer",
                                        minimum: 0
                                    }
                                },
                                additionalProperties: false
                            }
                        ]
                    },
                    outerIIFEBody: {
                        type: "integer",
                        minimum: 0
                    },
                    MemberExpression: {
                        oneOf: [
                            {
                                type: "integer",
                                minimum: 0
                            },
                            {
                                enum: ["off"]
                            }
                        ]
                    },
                    FunctionDeclaration: {
                        type: "object",
                        properties: {
                            parameters: ELEMENT_LIST_SCHEMA,
                            body: {
                                type: "integer",
                                minimum: 0
                            }
                        },
                        additionalProperties: false
                    },
                    FunctionExpression: {
                        type: "object",
                        properties: {
                            parameters: ELEMENT_LIST_SCHEMA,
                            body: {
                                type: "integer",
                                minimum: 0
                            }
                        },
                        additionalProperties: false
                    },
                    CallExpression: {
                        type: "object",
                        properties: {
                            arguments: ELEMENT_LIST_SCHEMA
                        },
                        additionalProperties: false
                    },
                    ArrayExpression: ELEMENT_LIST_SCHEMA,
                    ObjectExpression: ELEMENT_LIST_SCHEMA,
                    flatTernaryExpressions: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const DEFAULT_VARIABLE_INDENT = 1;
        const DEFAULT_PARAMETER_INDENT = 1;
        const DEFAULT_FUNCTION_BODY_INDENT = 1;

        let indentType = "space";
        let indentSize = 4;
        const options = {
            SwitchCase: 0,
            VariableDeclarator: {
                var: DEFAULT_VARIABLE_INDENT,
                let: DEFAULT_VARIABLE_INDENT,
                const: DEFAULT_VARIABLE_INDENT
            },
            outerIIFEBody: 1,
            FunctionDeclaration: {
                parameters: DEFAULT_PARAMETER_INDENT,
                body: DEFAULT_FUNCTION_BODY_INDENT
            },
            FunctionExpression: {
                parameters: DEFAULT_PARAMETER_INDENT,
                body: DEFAULT_FUNCTION_BODY_INDENT
            },
            CallExpression: {
                arguments: DEFAULT_PARAMETER_INDENT
            },
            MemberExpression: 1,
            ArrayExpression: 1,
            ObjectExpression: 1,
            ArrayPattern: 1,
            ObjectPattern: 1,
            flatTernaryExpressions: false
        };

        if (context.options.length) {
            if (context.options[0] === "tab") {
                indentSize = 1;
                indentType = "tab";
            } else if (typeof context.options[0] === "number") {
                indentSize = context.options[0];
                indentType = "space";
            }

            if (context.options[1]) {
                lodash.merge(options, context.options[1]);

                if (typeof options.VariableDeclarator === "number") {
                    options.VariableDeclarator = {
                        var: options.VariableDeclarator,
                        let: options.VariableDeclarator,
                        const: options.VariableDeclarator
                    };
                }
            }
        }

        const sourceCode = context.getSourceCode();
        const tokenInfo = new TokenInfo(sourceCode);
        const offsets = new OffsetStorage(tokenInfo, indentType, indentSize);
        const parameterParens = new WeakSet();

        /**
         * Creates an error message for a line, given the expected/actual indentation.
         * @param {int} expectedAmount The expected amount of indentation characters for this line
         * @param {int} actualSpaces The actual number of indentation spaces that were found on this line
         * @param {int} actualTabs The actual number of indentation tabs that were found on this line
         * @returns {string} An error message for this line
         */
        function createErrorMessage(expectedAmount, actualSpaces, actualTabs) {
            const expectedStatement = `${expectedAmount} ${indentType}${expectedAmount === 1 ? "" : "s"}`; // e.g. "2 tabs"
            const foundSpacesWord = `space${actualSpaces === 1 ? "" : "s"}`; // e.g. "space"
            const foundTabsWord = `tab${actualTabs === 1 ? "" : "s"}`; // e.g. "tabs"
            let foundStatement;

            if (actualSpaces > 0) {

                // Abbreviate the message if the expected indentation is also spaces.
                // e.g. 'Expected 4 spaces but found 2' rather than 'Expected 4 spaces but found 2 spaces'
                foundStatement = indentType === "space" ? actualSpaces : `${actualSpaces} ${foundSpacesWord}`;
            } else if (actualTabs > 0) {
                foundStatement = indentType === "tab" ? actualTabs : `${actualTabs} ${foundTabsWord}`;
            } else {
                foundStatement = "0";
            }

            return `Expected indentation of ${expectedStatement} but found ${foundStatement}.`;
        }

        /**
         * Reports a given indent violation
         * @param {Token} token Node violating the indent rule
         * @param {int} neededIndentLevel Expected indentation level
         * @param {int} gottenSpaces Indentation space count in the actual node/code
         * @param {int} gottenTabs Indentation tab count in the actual node/code
         * @returns {void}
         */
        function report(token, neededIndentLevel) {
            const actualIndent = Array.from(tokenInfo.getTokenIndent(token));
            const numSpaces = actualIndent.filter(char => char === " ").length;
            const numTabs = actualIndent.filter(char => char === "\t").length;
            const neededChars = neededIndentLevel * indentSize;

            context.report({
                node: token,
                message: createErrorMessage(neededChars, numSpaces, numTabs),
                loc: {
                    start: { line: token.loc.start.line, column: 0 },
                    end: { line: token.loc.start.line, column: token.loc.start.column }
                },
                fix(fixer) {
                    const range = [token.range[0] - token.loc.start.column, token.range[0]];
                    const newText = (indentType === "space" ? " " : "\t").repeat(neededChars);

                    return fixer.replaceTextRange(range, newText);
                }
            });
        }

        /**
         * Checks if a token's indentation is correct
         * @param {Token} token Token to examine
         * @param {int} desiredIndentLevel needed indent level
         * @returns {boolean} `true` if the token's indentation is correct
         */
        function validateTokenIndent(token, desiredIndentLevel) {
            const indentation = tokenInfo.getTokenIndent(token);
            const expectedChar = indentType === "space" ? " " : "\t";

            return indentation === expectedChar.repeat(desiredIndentLevel * indentSize) ||

                // To avoid conflicts with no-mixed-spaces-and-tabs, don't report mixed spaces and tabs.
                indentation.includes(" ") && indentation.includes("\t");
        }

        /**
         * Check to see if the node is a file level IIFE
         * @param {ASTNode} node The function node to check.
         * @returns {boolean} True if the node is the outer IIFE
         */
        function isOuterIIFE(node) {

            /*
             * Verify that the node is an IIFE
             */
            if (!node.parent || node.parent.type !== "CallExpression" || node.parent.callee !== node) {
                return false;
            }

            /*
             * Navigate legal ancestors to determine whether this IIFE is outer.
             * A "legal ancestor" is an expression or statement that causes the function to get executed immediately.
             * For example, `!(function(){})()` is an outer IIFE even though it is preceded by a ! operator.
             */
            let statement = node.parent && node.parent.parent;

            while (
                statement.type === "UnaryExpression" && ["!", "~", "+", "-"].indexOf(statement.operator) > -1 ||
                statement.type === "AssignmentExpression" ||
                statement.type === "LogicalExpression" ||
                statement.type === "SequenceExpression" ||
                statement.type === "VariableDeclarator"
            ) {
                statement = statement.parent;
            }

            return (statement.type === "ExpressionStatement" || statement.type === "VariableDeclaration") && statement.parent.type === "Program";
        }

        /**
        * Gets all tokens and comments for a node
        * @param {ASTNode} node The node
        * @returns {Token[]} A list of tokens and comments
        */
        function getTokensAndComments(node) {
            return sourceCode.getTokens(node, { includeComments: true });
        }

        /**
         * Check indentation for blocks
         * @param {ASTNode} node node to check
         * @returns {void}
         */
        function addBlockIndent(node) {

            let blockIndentLevel;

            if (node.parent && isOuterIIFE(node.parent)) {
                blockIndentLevel = options.outerIIFEBody;
            } else if (node.parent && (node.parent.type === "FunctionExpression" || node.parent.type === "ArrowFunctionExpression")) {
                blockIndentLevel = options.FunctionExpression.body;
            } else if (node.parent && node.parent.type === "FunctionDeclaration") {
                blockIndentLevel = options.FunctionDeclaration.body;
            } else {
                blockIndentLevel = 1;
            }

            /*
             * If the block starts on its own line, then match the tokens in the block against the opening curly of the block.
             * Otherwise, match the token in the block against the tokens in the block's parent.
             *
             * For example:
             * function foo() {
             *   {
             *      // (random block, tokens should get matched against the { that opens the block)
             *      foo;
             *   }
             *
             * if (foo &&
             *     bar) {
             *     baz(); // Tokens in the block should get matched against the `if` statement, even though the opening curly is indented.
             * }
             */
            const tokens = getTokensAndComments(node);
            const tokenToMatchAgainst = tokenInfo.isFirstTokenOfLine(tokens[0]) ? tokens[0] : sourceCode.getFirstToken(node.parent);

            offsets.matchIndentOf(tokenToMatchAgainst, tokens[0]);
            offsets.setDesiredOffsets(tokens, tokens[0], blockIndentLevel);
            offsets.matchIndentOf(tokenToMatchAgainst, tokens[tokens.length - 1]);
        }

        /**
        * Check indentation for lists of elements (arrays, objects, function params)
        * @param {Token[]} tokens list of tokens
        * @param {ASTNode[]} elements List of elements that should be offset
        * @param {number|string} offset The amount that the elements should be offset
        * @returns {void}
        */
        function addElementListIndent(tokens, elements, offset) {

            /**
            * Gets the first token of a given element, including surrounding parentheses.
            * @param {ASTNode} element A node in the `elements` list
            * @returns {Token} The first token of this element
            */
            function getFirstToken(element) {
                let token = sourceCode.getTokenBefore(element);

                while (astUtils.isOpeningParenToken(token) && token !== tokens[0]) {
                    token = sourceCode.getTokenBefore(token);
                }

                return sourceCode.getTokenAfter(token);
            }

            // Run through all the tokens in the list, and offset them by one indent level (mainly for comments, other things will end up overridden)
            // FIXME: (not-an-aardvark) This isn't performant at all.
            offsets.setDesiredOffsets(tokens, tokens[0], offset === "first" ? 1 : offset);
            offsets.matchIndentOf(tokens[0], tokens[tokens.length - 1]);

            // If the preference is "first" but there is no first element (e.g. sparse arrays w/ empty first slot), fall back to 1 level.
            if (offset === "first" && elements.length && !elements[0]) {
                return;
            }

            elements.forEach((element, index) => {
                if (offset === "off") {
                    offsets.ignoreToken(getFirstToken(element));
                }
                if (index === 0 || !element) {
                    return;
                }
                if (offset === "first" && tokenInfo.isFirstTokenOfLine(getFirstToken(element))) {
                    offsets.matchOffsetOf(getFirstToken(elements[0]), getFirstToken(element));
                } else {
                    const previousElement = elements[index - 1];
                    const firstTokenOfPreviousElement = previousElement && getFirstToken(previousElement);

                    if (previousElement && previousElement.loc.end.line > tokens[0].loc.end.line) {
                        offsets.matchIndentOf(firstTokenOfPreviousElement, getFirstToken(elements[index]));
                    }
                }
            });
        }

        /**
         * Check indent for array block content or object block content
         * @param {ASTNode} node node to examine
         * @returns {void}
         */
        function addArrayOrObjectIndent(node) {
            const tokens = getTokensAndComments(node);

            addElementListIndent(tokens, node.elements || node.properties, options[node.type]);
        }

        /**
         * Check and decide whether to check for indentation for blockless nodes
         * Scenarios are for or while statements without braces around them
         * @param {ASTNode} node node to examine
         * @param {ASTNode} parent The parent of the node to examine
         * @returns {void}
         */
        function addBlocklessNodeIndent(node, parent) {
            if (node.type !== "BlockStatement") {
                const firstParentToken = sourceCode.getFirstToken(parent);

                offsets.setDesiredOffsets(getTokensAndComments(node), firstParentToken, 1);

                /*
                 * For blockless nodes with semicolon-first style, don't indent the semicolon.
                 * e.g.
                 * if (foo) bar()
                 * ; [1, 2, 3].map(foo)
                 */
                const lastToken = sourceCode.getLastToken(node);

                if (astUtils.isSemicolonToken(lastToken)) {
                    offsets.matchIndentOf(firstParentToken, lastToken);
                }
            }
        }

        /**
        * Checks the indentation of a function's parameters
        * @param {ASTNode} node The node
        * @param {number} paramsIndent The indentation level option for the parameters
        * @returns {void}
        */
        function addFunctionParamsIndent(node, paramsIndent) {
            const openingParen = node.params.length ? sourceCode.getTokenBefore(node.params[0]) : sourceCode.getTokenBefore(node.body, 1);
            const closingParen = sourceCode.getTokenBefore(node.body);
            const nodeTokens = getTokensAndComments(node);
            const openingParenIndex = lodash.sortedIndexBy(nodeTokens, openingParen, token => token.range[0]);
            const closingParenIndex = lodash.sortedIndexBy(nodeTokens, closingParen, token => token.range[0]);
            const paramTokens = nodeTokens.slice(openingParenIndex, closingParenIndex + 1);

            parameterParens.add(paramTokens[0]);
            parameterParens.add(paramTokens[paramTokens.length - 1]);

            addElementListIndent(paramTokens, node.params, paramsIndent);
        }

        /**
        * Adds indentation for the right-hand side of binary/logical expressions.
        * @param {ASTNode} node A BinaryExpression or LogicalExpression node
        * @returns {void}
        */
        function addBinaryOrLogicalExpressionIndent(node) {
            const tokens = getTokensAndComments(node);
            const operator = sourceCode.getFirstTokenBetween(node.left, node.right, token => token.value === node.operator);
            const firstTokenAfterOperator = sourceCode.getTokenAfter(operator);
            const tokensAfterOperator = tokens.slice(lodash.sortedIndexBy(tokens, firstTokenAfterOperator, token => token.range[0]));

            /*
             * For backwards compatibility, don't check BinaryExpression indents, e.g.
             * var foo = bar &&
             *                   baz;
             */

            offsets.ignoreToken(operator);
            offsets.ignoreToken(tokensAfterOperator[0]);
            offsets.setDesiredOffset(tokensAfterOperator[0], sourceCode.getFirstToken(node), 1);
            offsets.setDesiredOffsets(tokensAfterOperator, tokensAfterOperator[0], 1);
        }

        /**
        * Checks the indentation for nodes that are like function calls (`CallExpression` and `NewExpression`)
        * @param {ASTNode} node A CallExpression or NewExpression node
        * @returns {void}
        */
        function addFunctionCallIndent(node) {
            let openingParen;

            if (node.arguments.length) {
                openingParen = sourceCode.getFirstTokenBetween(node.callee, node.arguments[0], astUtils.isOpeningParenToken);
            } else {
                openingParen = sourceCode.getLastToken(node, 1);
            }
            const callExpressionTokens = getTokensAndComments(node);
            const tokens = callExpressionTokens.slice(lodash.sortedIndexBy(callExpressionTokens, openingParen, token => token.range[0]));

            parameterParens.add(tokens[0]);
            parameterParens.add(tokens[tokens.length - 1]);
            offsets.matchIndentOf(sourceCode.getLastToken(node.callee), openingParen);

            addElementListIndent(tokens, node.arguments, options.CallExpression.arguments);
        }

        /**
        * Checks the indentation of ClassDeclarations and ClassExpressions
        * @param {ASTNode} node A ClassDeclaration or ClassExpression node
        * @returns {void}
        */
        function addClassIndent(node) {
            const tokens = getTokensAndComments(node);

            offsets.setDesiredOffsets(tokens, tokens[0], 1);
            offsets.matchIndentOf(tokens[0], tokens[tokens.length - 1]);
        }

        /**
        * Checks the indentation of parenthesized values, given a list of tokens in a program
        * @param {Token[]} tokens A list of tokens
        * @returns {void}
        */
        function addParensIndent(tokens) {
            const parenStack = [];
            const parenPairs = [];

            tokens.forEach(nextToken => {

                // Accumulate a list of parenthesis pairs
                if (astUtils.isOpeningParenToken(nextToken)) {
                    parenStack.push(nextToken);
                } else if (astUtils.isClosingParenToken(nextToken)) {
                    parenPairs.unshift({ left: parenStack.pop(), right: nextToken });
                }
            });

            parenPairs.forEach(pair => {
                const leftParen = pair.left;
                const rightParen = pair.right;

                // We only want to handle parens around expressions, so exclude parentheses that are in function parameters and function call arguments.
                if (!parameterParens.has(leftParen) && !parameterParens.has(rightParen)) {
                    offsets.setDesiredOffset(sourceCode.getTokenAfter(leftParen), leftParen, 1);
                }

                offsets.matchIndentOf(leftParen, rightParen);
            });
        }

        return {
            ArrayExpression: addArrayOrObjectIndent,
            ArrayPattern: addArrayOrObjectIndent,

            ArrowFunctionExpression(node) {
                addFunctionParamsIndent(node, options.FunctionExpression.parameters);
                if (node.body.type !== "BlockStatement") {
                    offsets.setDesiredOffsets(getTokensAndComments(node.body), sourceCode.getFirstToken(node), 1);
                }
            },

            AssignmentExpression(node) {
                const operator = sourceCode.getFirstTokenBetween(node.left, node.right, token => token.value === node.operator);
                const nodeTokens = getTokensAndComments(node);
                const tokensFromOperator = nodeTokens.slice(lodash.sortedIndexBy(nodeTokens, operator, token => token.range[0]));

                offsets.setDesiredOffsets(tokensFromOperator, sourceCode.getFirstToken(node.left), 1);
                offsets.ignoreToken(tokensFromOperator[0]);
                offsets.ignoreToken(tokensFromOperator[1]);
            },

            BinaryExpression: addBinaryOrLogicalExpressionIndent,

            BlockStatement: addBlockIndent,

            CallExpression: addFunctionCallIndent,

            ClassDeclaration: addClassIndent,

            ClassExpression: addClassIndent,

            ConditionalExpression(node) {
                const tokens = getTokensAndComments(node);

                if (!(node.parent.type === "ConditionalExpression" && options.flatTernaryExpressions)) {
                    offsets.setDesiredOffsets(tokens, tokens[0], 1);
                }
            },

            DoWhileStatement: node => addBlocklessNodeIndent(node.body, node),

            ExportNamedDeclaration(node) {
                if (node.declaration === null) {
                    addElementListIndent(getTokensAndComments(node).slice(1), node.specifiers, 1);
                }
            },

            ForInStatement: node => addBlocklessNodeIndent(node.body, node),

            ForOfStatement: node => addBlocklessNodeIndent(node.body, node),

            ForStatement(node) {
                const forOpeningParen = sourceCode.getFirstToken(node, 1);

                if (node.init) {
                    offsets.setDesiredOffsets(getTokensAndComments(node.init), forOpeningParen, 1);
                }
                if (node.test) {
                    offsets.setDesiredOffsets(getTokensAndComments(node.test), forOpeningParen, 1);
                }
                if (node.update) {
                    offsets.setDesiredOffsets(getTokensAndComments(node.update), forOpeningParen, 1);
                }
                addBlocklessNodeIndent(node.body, node);
            },

            FunctionDeclaration(node) {
                addFunctionParamsIndent(node, options.FunctionDeclaration.parameters);
            },

            FunctionExpression(node) {
                addFunctionParamsIndent(node, options.FunctionExpression.parameters);
            },

            IfStatement(node) {
                addBlocklessNodeIndent(node.consequent, node);
                if (node.alternate && node.alternate.type !== "IfStatement") {
                    addBlocklessNodeIndent(node.alternate, node);
                }
            },

            ImportDeclaration(node) {
                if (node.specifiers.some(specifier => specifier.type === "ImportSpecifier")) {
                    const openingCurly = sourceCode.getFirstToken(node, astUtils.isOpeningBraceToken);
                    const closingCurly = sourceCode.getLastToken(node, astUtils.isClosingBraceToken);
                    const specifierTokens = sourceCode.getTokensBetween(openingCurly, closingCurly, 1);

                    addElementListIndent(specifierTokens, node.specifiers.filter(specifier => specifier.type === "ImportSpecifier"), 1);
                }
            },

            LogicalExpression: addBinaryOrLogicalExpressionIndent,

            MemberExpression(node) {
                const firstNonObjectToken = sourceCode.getFirstTokenBetween(node.object, node.property, astUtils.isNotClosingParenToken);
                const tokensToIndent = node.computed ? [sourceCode.getTokenAfter(firstNonObjectToken)] : [firstNonObjectToken, sourceCode.getTokenAfter(firstNonObjectToken)];

                if (node.computed) {
                    offsets.matchIndentOf(firstNonObjectToken, sourceCode.getLastToken(node));
                }

                offsets.setDesiredOffsets(tokensToIndent, tokensToIndent[0], 0);

                if (typeof options.MemberExpression !== "number") {
                    tokensToIndent.forEach(token => {
                        offsets.matchIndentOf(tokenInfo.getFirstTokenOfLine(token), token);
                        offsets.ignoreToken(token);
                    });
                } else if (node.object.loc.end.line === node.property.loc.start.line) {
                    offsets.setDesiredOffsets(tokensToIndent, tokenInfo.getFirstTokenOfLine(sourceCode.getLastToken(node.object)), options.MemberExpression);
                } else {
                    offsets.setDesiredOffsets(tokensToIndent, sourceCode.getFirstToken(node.object), options.MemberExpression);
                }
            },

            NewExpression(node) {

                // Only indent the arguments if the NewExpression has parens (e.g. `new Foo(bar)` or `new Foo()`, but not `new Foo`
                if (node.arguments.length > 0 || astUtils.isClosingParenToken(sourceCode.getLastToken(node)) && astUtils.isOpeningParenToken(sourceCode.getLastToken(node, 1))) {
                    addFunctionCallIndent(node);
                }
            },

            ObjectExpression: addArrayOrObjectIndent,
            ObjectPattern: addArrayOrObjectIndent,

            Property(node) {
                if (!node.computed && !node.shorthand && !node.method && node.kind === "init") {
                    const colon = sourceCode.getFirstTokenBetween(node.key, node.value, astUtils.isColonToken);

                    offsets.ignoreToken(sourceCode.getTokenAfter(colon));
                }
            },

            SwitchStatement(node) {
                const tokens = getTokensAndComments(node);
                const openingCurlyIndex = tokens.findIndex(token => token.range[0] >= node.discriminant.range[1] && astUtils.isOpeningBraceToken(token));

                offsets.setDesiredOffsets(tokens.slice(openingCurlyIndex + 1, -1), tokens[openingCurlyIndex], options.SwitchCase);

                const caseKeywords = new WeakSet(node.cases.map(switchCase => sourceCode.getFirstToken(switchCase)));
                const lastCaseKeyword = node.cases.length && sourceCode.getFirstToken(node.cases[node.cases.length - 1]);
                const casesWithBlocks = new WeakSet(
                    node.cases
                        .filter(switchCase => switchCase.consequent.length === 1 && switchCase.consequent[0].type === "BlockStatement")
                        .map(switchCase => sourceCode.getFirstToken(switchCase))
                );
                let lastAnchor = tokens[openingCurlyIndex];

                tokens.slice(openingCurlyIndex + 1, -1).forEach(token => {
                    if (caseKeywords.has(token)) {
                        lastAnchor = token;
                    } else if (lastAnchor === lastCaseKeyword && (token.type === "Line" || token.type === "Block")) {
                        offsets.ignoreToken(token);
                    } else if (!casesWithBlocks.has(lastAnchor)) {
                        offsets.setDesiredOffset(token, lastAnchor, 1);
                    }
                });
            },

            TemplateLiteral(node) {
                const tokens = getTokensAndComments(node);

                offsets.setDesiredOffsets(getTokensAndComments(node.quasis[0]), tokens[0], 0);
                node.expressions.forEach((expression, index) => {
                    const previousQuasi = node.quasis[index];
                    const nextQuasi = node.quasis[index + 1];
                    const tokenToAlignFrom = previousQuasi.loc.start.line === previousQuasi.loc.end.line ? sourceCode.getFirstToken(previousQuasi) : null;

                    offsets.setDesiredOffsets(sourceCode.getTokensBetween(previousQuasi, nextQuasi), tokenToAlignFrom, 1);
                    offsets.setDesiredOffset(sourceCode.getFirstToken(nextQuasi), tokenToAlignFrom, 0);
                });
            },

            VariableDeclaration(node) {
                offsets.setDesiredOffsets(getTokensAndComments(node), sourceCode.getFirstToken(node), options.VariableDeclarator[node.kind]);
                const lastToken = sourceCode.getLastToken(node);

                if (astUtils.isSemicolonToken(lastToken)) {
                    offsets.ignoreToken(lastToken);
                }
            },

            VariableDeclarator(node) {
                if (node.init) {
                    offsets.ignoreToken(sourceCode.getFirstToken(node.init));
                }
            },

            "VariableDeclarator:exit"(node) {

                /*
                 * VariableDeclarator indentation is a bit different from other forms of indentation, in that the
                 * indentation of an opening bracket sometimes won't match that of a closing bracket. For example,
                 * the following indentations are correct:
                 *
                 * var foo = {
                 *   ok: true
                 * };
                 *
                 * var foo = {
                 *     ok: true,
                 *   },
                 *   bar = 1;
                 *
                 * Account for when exiting the AST (after indentations have already been set for the nodes in
                 * the declaration) by manually increasing the indentation level of the tokens in the first declarator if the
                 * parent declaration has more than one declarator.
                 */
                if (node.parent.declarations.length > 1 && node.parent.declarations[0] === node && node.init) {
                    const valueTokens = new Set(getTokensAndComments(node.init));

                    valueTokens.forEach(token => {
                        if (!valueTokens.has(offsets.getFirstDependency(token))) {
                            offsets.increaseOffset(token, options.VariableDeclarator[node.parent.kind]);
                        }
                    });
                }
            },

            WhileStatement: node => addBlocklessNodeIndent(node.body, node),

            "Program:exit"() {
                addParensIndent(sourceCode.ast.tokens);

                /*
                 * Create a Map from (tokenOrComment) => (precedingToken).
                 * This is necessary because sourceCode.getTokenBefore does not handle a comment as an argument correctly.
                 */
                const precedingTokens = sourceCode.ast.comments.reduce((commentMap, comment) => {
                    const tokenOrCommentBefore = sourceCode.getTokenOrCommentBefore(comment);

                    return commentMap.set(comment, commentMap.has(tokenOrCommentBefore) ? commentMap.get(tokenOrCommentBefore) : tokenOrCommentBefore);
                }, new WeakMap());

                sourceCode.lines.forEach((line, lineIndex) => {
                    const lineNumber = lineIndex + 1;

                    if (!tokenInfo.firstTokensByLineNumber.has(lineNumber)) {

                        // Don't check indentation on blank lines
                        return;
                    }

                    const firstTokenOfLine = tokenInfo.firstTokensByLineNumber.get(lineNumber);

                    if (firstTokenOfLine.loc.start.line !== lineNumber) {

                        // Don't check the indentation of multi-line tokens (e.g. template literals or block comments) twice.
                        return;
                    }

                    // If the token matches the expected expected indentation, don't report it.
                    if (validateTokenIndent(firstTokenOfLine, offsets.getDesiredIndent(firstTokenOfLine))) {
                        return;
                    }

                    if (astUtils.isCommentToken(firstTokenOfLine)) {
                        const tokenBefore = precedingTokens.get(firstTokenOfLine);
                        const tokenAfter = tokenBefore ? sourceCode.getTokenAfter(tokenBefore) : sourceCode.ast.tokens[0];

                        // If a comment matches the expected indentation of the token immediately before or after, don't report it.
                        if (
                            tokenBefore && validateTokenIndent(firstTokenOfLine, offsets.getDesiredIndent(tokenBefore)) ||
                            tokenAfter && validateTokenIndent(firstTokenOfLine, offsets.getDesiredIndent(tokenAfter))
                        ) {
                            return;
                        }
                    }

                    // Otherwise, report the token/comment.
                    report(firstTokenOfLine, offsets.getDesiredIndent(firstTokenOfLine));
                });
            }

        };

    }
};
