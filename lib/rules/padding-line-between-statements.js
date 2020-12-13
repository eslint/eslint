/**
 * @fileoverview Rule to require or disallow newlines between statements
 * @author Toru Nagashima & jun-sheaf
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const LT = `[${Array.from(astUtils.LINEBREAKS).join("")}]`;
const PADDING_LINE_SEQUENCE = new RegExp(
    String.raw`^(\s*?${LT})\s*${LT}(\s*;?)$`,
    "u"
);

/**
 * Creates tester which check if a node starts with specific keyword.
 * @param {string} keyword The keyword to test.
 * @returns {Object} the created tester.
 * @private
 */
function newKeywordTester(keyword) {
    return {
        test: (node, sourceCode) => keyword.split(" ").every(
            (kwd, i) => sourceCode.getFirstToken(node, i).value === kwd
        )
    };
}

/**
 * Creates tester which check if a node is specific type.
 * @param {string} type The node type to test.
 * @returns {Object} the created tester.
 * @private
 */
function newNodeTypeTester(type) {
    return {
        test: node =>
            node.type === type
    };
}

/**
 * Checks the given node is an expression statement of IIFE.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is an expression statement of IIFE.
 * @private
 */
function isIIFEStatement(node) {
    if (node.type === "ExpressionStatement") {
        let call = astUtils.skipChainExpression(node.expression);

        if (call.type === "UnaryExpression") {
            call = astUtils.skipChainExpression(call.argument);
        }

        if (call.type === "CallExpression") {
            call = call.callee;
            while (call.type === "SequenceExpression") {
                call = call.expressions[call.expressions.length - 1];
            }
            return astUtils.isFunction(call);
        }
    }
    return false;
}

/**
 * Checks the given node is a CommonJS import statement
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is a CommonJS import statement.
 * @private
 */
function isCJSImport(node) {
    if (node.type === "VariableDeclaration") {
        const declaration = node.declarations[0];

        if (declaration.init) {
            let call = declaration.init;

            while (call.type === "MemberExpression") {
                call = call.object;
            }
            if (
                call.type === "CallExpression" &&
                call.callee.type === "Identifier"
            ) {
                return call.callee.name === "require";
            }
        }
    }
    return false;
}

/**
 * Checks the given node is a CommonJS export statement
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is a CommonJS export statement.
 * @private
 */
function isCJSExport(node) {
    if (node.type === "ExpressionStatement") {
        const expression = node.expression;

        if (expression.type === "AssignmentExpression") {
            let left = expression.left;

            if (left.type === "MemberExpression") {
                while (left.object.type === "MemberExpression") {
                    left = left.object;
                }
                return (
                    left.object.type === "Identifier" &&
                    (left.object.name === "exports" ||
                        (left.object.name === "module" &&
                            left.property.type === "Identifier" &&
                            left.property.name === "exports"))
                );
            }
        }
    }
    return false;
}

/**
 * Checks whether the given node is a block-like statement.
 * This checks the last token of the node is the closing brace of a block.
 * @param {ASTNode} node The node to check.
 * @param {SourceCode} sourceCode The source code to get tokens.
 * @returns {boolean} `true` if the node is a block-like statement.
 * @private
 */
function isBlockLikeStatement(node, sourceCode) {

    // do-while with a block is a block-like statement.
    if (node.type === "DoWhileStatement" && node.body.type === "BlockStatement") {
        return true;
    }

    /*
     * IIFE is a block-like statement specially from
     * JSCS#disallowPaddingNewLinesAfterBlocks.
     */
    if (isIIFEStatement(node)) {
        return true;
    }

    // Checks the last token is a closing brace of blocks.
    const lastToken = sourceCode.getLastToken(node, astUtils.isNotSemicolonToken);
    const belongingNode = lastToken && astUtils.isClosingBraceToken(lastToken)
        ? sourceCode.getNodeByRangeIndex(lastToken.range[0])
        : null;

    return Boolean(belongingNode) && (
        belongingNode.type === "BlockStatement" ||
        belongingNode.type === "SwitchStatement"
    );
}

/**
 * Check whether the given node is a directive or not.
 * @param {ASTNode} node The node to check.
 * @param {SourceCode} sourceCode The source code object to get tokens.
 * @returns {boolean} `true` if the node is a directive.
 */
function isDirective(node, sourceCode) {
    return (
        node.type === "ExpressionStatement" &&
        (
            node.parent.type === "Program" ||
            (
                node.parent.type === "BlockStatement" &&
                astUtils.isFunction(node.parent.parent)
            )
        ) &&
        node.expression.type === "Literal" &&
        typeof node.expression.value === "string" &&
        !astUtils.isParenthesised(sourceCode, node.expression)
    );
}

/**
 * Check whether the given node is a part of directive prologue or not.
 * @param {ASTNode} node The node to check.
 * @param {SourceCode} sourceCode The source code object to get tokens.
 * @returns {boolean} `true` if the node is a part of directive prologue.
 */
function isDirectivePrologue(node, sourceCode) {
    if (isDirective(node, sourceCode)) {
        for (const sibling of node.parent.body) {
            if (sibling === node) {
                break;
            }
            if (!isDirective(sibling, sourceCode)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * Check whether the given node is an expression
 * @param {ASTNode} node The node to check.
 * @param {SourceCode} sourceCode The source code object to get tokens.
 * @returns {boolean} `true` if the node is an expression
 */
function isExpression(node, sourceCode) {
    return (
        node.type === "ExpressionStatement" &&
        !isDirectivePrologue(node, sourceCode)
    );
}

/**
 * Gets the actual last token.
 *
 * If a semicolon is semicolon-less style's semicolon, this ignores it.
 * For example:
 *
 *     foo()
 *     ;[1, 2, 3].forEach(bar)
 * @param {SourceCode} sourceCode The source code to get tokens.
 * @param {ASTNode} node The node to get.
 * @returns {Token} The actual last token.
 * @private
 */
function getActualLastToken(sourceCode, node) {
    const semiToken = sourceCode.getLastToken(node);
    const prevToken = sourceCode.getTokenBefore(semiToken);
    const nextToken = sourceCode.getTokenAfter(semiToken);
    const isSemicolonLessStyle = Boolean(
        prevToken &&
        nextToken &&
        prevToken.range[0] >= node.range[0] &&
        astUtils.isSemicolonToken(semiToken) &&
        semiToken.loc.start.line !== prevToken.loc.end.line &&
        semiToken.loc.end.line === nextToken.loc.start.line
    );

    return isSemicolonLessStyle ? prevToken : semiToken;
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

/**
 * Check and report statements for `any` configuration.
 * It does nothing.
 * @returns {void}
 * @private
 */
function verifyForAny() {
}

/**
 * Check and report statements for `never` configuration.
 * This autofix removes blank lines between the given 2 statements.
 * However, if comments exist between 2 blank lines, it does not remove those
 * blank lines automatically.
 * @param {RuleContext} context The rule context to report.
 * @param {ASTNode} _ Unused. The previous node to check.
 * @param {ASTNode} nextNode The next node to check.
 * @param {Array<Token[]>} paddingLines The array of token pairs that blank
 * lines exist between the pair.
 * @returns {void}
 * @private
 */
function verifyForNever(context, _, nextNode, paddingLines) {
    if (paddingLines.length === 0) {
        return;
    }

    context.report({
        node: nextNode,
        messageId: "unexpectedBlankLine",
        fix(fixer) {
            if (paddingLines.length >= 2) {
                return null;
            }

            const prevToken = paddingLines[0][0];
            const nextToken = paddingLines[0][1];
            const start = prevToken.range[1];
            const end = nextToken.range[0];
            const text = context.getSourceCode().text
                .slice(start, end)
                .replace(PADDING_LINE_SEQUENCE, replacerToRemovePaddingLines);

            return fixer.replaceTextRange([start, end], text);
        }
    });
}

/**
 * Check and report statements for `always` configuration.
 * This autofix inserts a blank line between the given 2 statements.
 * If the `prevNode` has trailing comments, it inserts a blank line after the
 * trailing comments.
 * @param {RuleContext} context The rule context to report.
 * @param {ASTNode} prevNode The previous node to check.
 * @param {ASTNode} nextNode The next node to check.
 * @param {Array<Token[]>} paddingLines The array of token pairs that blank
 * lines exist between the pair.
 * @returns {void}
 * @private
 */
function verifyForAlways(context, prevNode, nextNode, paddingLines) {
    if (paddingLines.length > 0) {
        return;
    }

    context.report({
        node: nextNode,
        messageId: "expectedBlankLine",
        fix(fixer) {
            const sourceCode = context.getSourceCode();
            let prevToken = getActualLastToken(sourceCode, prevNode);
            const nextToken = sourceCode.getFirstTokenBetween(
                prevToken,
                nextNode,
                {
                    includeComments: true,

                    /**
                     * Skip the trailing comments of the previous node.
                     * This inserts a blank line after the last trailing comment.
                     *
                     * For example:
                     *
                     *     foo(); // trailing comment.
                     *     // comment.
                     *     bar();
                     *
                     * Get fixed to:
                     *
                     *     foo(); // trailing comment.
                     *
                     *     // comment.
                     *     bar();
                     * @param {Token} token The token to check.
                     * @returns {boolean} `true` if the token is not a trailing comment.
                     * @private
                     */
                    filter(token) {
                        if (astUtils.isTokenOnSameLine(prevToken, token)) {
                            prevToken = token;
                            return false;
                        }
                        return true;
                    }
                }
            ) || nextNode;
            const insertText = astUtils.isTokenOnSameLine(prevToken, nextToken)
                ? "\n\n"
                : "\n";

            return fixer.insertTextAfter(prevToken, insertText);
        }
    });
}

/**
 * Types of blank lines.
 * `any`, `never`, and `always` are defined.
 * Those have `verify` method to check and report statements.
 * @private
 */
const PaddingTypes = {
    any: { verify: verifyForAny },
    never: { verify: verifyForNever },
    always: { verify: verifyForAlways }
};

/**
 * Types of statements.
 * Those have `test` method to check it matches to the given statement.
 * @private
 */
const StatementTypes = {
    "*": { test: () => true },
    "block-like": { test: isBlockLikeStatement },
    "cjs-export": { test: isCJSExport },
    "cjs-import": { test: isCJSImport },
    directive: { test: isDirectivePrologue },
    expression: { test: isExpression },
    iife: { test: isIIFEStatement },

    block: newNodeTypeTester("BlockStatement"),
    empty: newNodeTypeTester("EmptyStatement"),
    function: newNodeTypeTester("FunctionDeclaration"),
    "named-export": newNodeTypeTester("ExportNamedDeclaration"),
    "default-export": newNodeTypeTester("ExportDefaultDeclaration"),
    "all-export": newNodeTypeTester("ExportAllDeclaration")
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "require or disallow padding lines between statements",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/padding-line-between-statements"
        },

        fixable: "whitespace",

        schema: {
            definitions: {
                paddingType: {
                    enum: Object.keys(PaddingTypes)
                },
                statementType: {
                    anyOf: [
                        { type: "string" },
                        {
                            type: "array",
                            items: { type: "string" },
                            minItems: 1,
                            uniqueItems: true,
                            additionalItems: false
                        }
                    ]
                }
            },
            type: "array",
            items: {
                type: "object",
                properties: {
                    blankLine: { $ref: "#/definitions/paddingType" },
                    prev: { $ref: "#/definitions/statementType" },
                    next: { $ref: "#/definitions/statementType" }
                },
                additionalProperties: false,
                required: ["blankLine", "prev", "next"]
            },
            additionalItems: false
        },

        messages: {
            unexpectedBlankLine: "Unexpected blank line before this statement.",
            expectedBlankLine: "Expected blank line before this statement."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const configureList = context.options || [];
        let scopeInfo = null;

        /**
         * Processes to enter to new scope.
         * This manages the current previous statement.
         * @returns {void}
         * @private
         */
        function enterScope() {
            scopeInfo = {
                upper: scopeInfo,
                prevNode: null
            };
        }

        /**
         * Processes to exit from the current scope.
         * @returns {void}
         * @private
         */
        function exitScope() {
            scopeInfo = scopeInfo.upper;
        }

        /**
         * Checks whether the given node matches the given type.
         * @param {ASTNode} node The statement node to check.
         * @param {string|string[]} type The statement type to check.
         * @returns {boolean} `true` if the statement node matched the type.
         * @private
         */
        function match(node, type) {
            let innerStatementNode = node;

            while (innerStatementNode.type === "LabeledStatement") {
                innerStatementNode = innerStatementNode.body;
            }

            const types = !Array.isArray(type) ? [type] : type;

            return types.some(t => {
                let tt = t;

                if (/^singleline-/u.test(tt)) {
                    if (node.loc.start.line !== node.loc.end.line) {
                        return false;
                    }
                    tt = tt.slice(11);
                }
                if (/^multiline-/u.test(tt)) {
                    if (node.loc.start.line === node.loc.end.line) {
                        return false;
                    }
                    tt = tt.slice(10);
                }
                return tt in StatementTypes
                    ? StatementTypes[tt].test(innerStatementNode, sourceCode)
                    : newKeywordTester(tt).test(innerStatementNode, sourceCode);
            });
        }

        /**
         * Finds the last matched configure from configureList.
         * @param {ASTNode} prevNode The previous statement to match.
         * @param {ASTNode} nextNode The current statement to match.
         * @returns {Object} The tester of the last matched configure.
         * @private
         */
        function getPaddingType(prevNode, nextNode) {
            for (let i = configureList.length - 1; i >= 0; --i) {
                const configure = configureList[i];
                const matched =
                    match(prevNode, configure.prev) &&
                    match(nextNode, configure.next);

                if (matched) {
                    return PaddingTypes[configure.blankLine];
                }
            }
            return PaddingTypes.any;
        }

        /**
         * Gets padding line sequences between the given 2 statements.
         * Comments are separators of the padding line sequences.
         * @param {ASTNode} prevNode The previous statement to count.
         * @param {ASTNode} nextNode The current statement to count.
         * @returns {Array<Token[]>} The array of token pairs.
         * @private
         */
        function getPaddingLineSequences(prevNode, nextNode) {
            const pairs = [];
            let prevToken = getActualLastToken(sourceCode, prevNode);

            if (nextNode.loc.start.line - prevToken.loc.end.line >= 2) {
                do {
                    const token = sourceCode.getTokenAfter(
                        prevToken,
                        { includeComments: true }
                    );

                    if (token.loc.start.line - prevToken.loc.end.line >= 2) {
                        pairs.push([prevToken, token]);
                    }
                    prevToken = token;

                } while (prevToken.range[0] < nextNode.range[0]);
            }

            return pairs;
        }

        /**
         * Verify padding lines between the given node and the previous node.
         * @param {ASTNode} node The node to verify.
         * @returns {void}
         * @private
         */
        function verify(node) {
            const parentType = node.parent.type;
            const validParent =
                astUtils.STATEMENT_LIST_PARENTS.has(parentType) ||
                parentType === "SwitchStatement";

            if (!validParent) {
                return;
            }

            // Save this node as the current previous statement.
            const prevNode = scopeInfo.prevNode;

            // Verify.
            if (prevNode) {
                const type = getPaddingType(prevNode, node);
                const paddingLines = getPaddingLineSequences(prevNode, node);

                type.verify(context, prevNode, node, paddingLines);
            }

            scopeInfo.prevNode = node;
        }

        /**
         * Verify padding lines between the given node and the previous node.
         * Then process to enter to new scope.
         * @param {ASTNode} node The node to verify.
         * @returns {void}
         * @private
         */
        function verifyThenEnterScope(node) {
            verify(node);
            enterScope();
        }

        return {
            Program: enterScope,
            BlockStatement: enterScope,
            SwitchStatement: enterScope,
            "Program:exit": exitScope,
            "BlockStatement:exit": exitScope,
            "SwitchStatement:exit": exitScope,

            ":statement": verify,

            SwitchCase: verifyThenEnterScope,
            "SwitchCase:exit": exitScope
        };
    }
};
