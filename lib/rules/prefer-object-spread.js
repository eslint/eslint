/**
 * @fileoverview Prefers object spread property over Object.assign
 * @author Sharmila Jesupaul
 * See LICENSE file in root directory for full license.
 */

"use strict";

const { CALL, ReferenceTracker } = require("eslint-utils");
const {
    isCommaToken,
    isOpeningParenToken,
    isClosingParenToken,
    isParenthesised
} = require("./utils/ast-utils");

const ANY_SPACE = /\s/u;

/**
 * Helper that checks if the Object.assign call has array spread
 * @param {ASTNode} node - The node that the rule warns on
 * @returns {boolean} - Returns true if the Object.assign call has array spread
 */
function hasArraySpread(node) {
    return node.arguments.some(arg => arg.type === "SpreadElement");
}

/**
 * Helper that checks if the node needs parentheses to be valid JS.
 * The default is to wrap the node in parentheses to avoid parsing errors.
 * @param {ASTNode} node - The node that the rule warns on
 * @param {Object} sourceCode - in context sourcecode object
 * @returns {boolean} - Returns true if the node needs parentheses
 */
function needsParens(node, sourceCode) {
    const parent = node.parent;

    switch (parent.type) {
        case "VariableDeclarator":
        case "ArrayExpression":
        case "ReturnStatement":
        case "CallExpression":
        case "Property":
            return false;
        case "AssignmentExpression":
            return parent.left === node && !isParenthesised(sourceCode, node);
        default:
            return !isParenthesised(sourceCode, node);
    }
}

/**
 * Determines if an argument needs parentheses. The default is to not add parens.
 * @param {ASTNode} node - The node to be checked.
 * @param {Object} sourceCode - in context sourcecode object
 * @returns {boolean} True if the node needs parentheses
 */
function argNeedsParens(node, sourceCode) {
    switch (node.type) {
        case "AssignmentExpression":
        case "ArrowFunctionExpression":
        case "ConditionalExpression":
            return !isParenthesised(sourceCode, node);
        default:
            return false;
    }
}

/**
 * Get the parenthesis tokens of a given ObjectExpression node.
 * This incldues the braces of the object literal and enclosing parentheses.
 * @param {ASTNode} node The node to get.
 * @param {Token} leftArgumentListParen The opening paren token of the argument list.
 * @param {SourceCode} sourceCode The source code object to get tokens.
 * @returns {Token[]} The parenthesis tokens of the node. This is sorted by the location.
 */
function getParenTokens(node, leftArgumentListParen, sourceCode) {
    const parens = [sourceCode.getFirstToken(node), sourceCode.getLastToken(node)];
    let leftNext = sourceCode.getTokenBefore(node);
    let rightNext = sourceCode.getTokenAfter(node);

    // Note: don't include the parens of the argument list.
    while (
        leftNext &&
        rightNext &&
        leftNext.range[0] > leftArgumentListParen.range[0] &&
        isOpeningParenToken(leftNext) &&
        isClosingParenToken(rightNext)
    ) {
        parens.push(leftNext, rightNext);
        leftNext = sourceCode.getTokenBefore(leftNext);
        rightNext = sourceCode.getTokenAfter(rightNext);
    }

    return parens.sort((a, b) => a.range[0] - b.range[0]);
}

/**
 * Get the range of a given token and around whitespaces.
 * @param {Token} token The token to get range.
 * @param {SourceCode} sourceCode The source code object to get tokens.
 * @returns {number} The end of the range of the token and around whitespaces.
 */
function getStartWithSpaces(token, sourceCode) {
    const text = sourceCode.text;
    let start = token.range[0];

    // If the previous token is a line comment then skip this step to avoid commenting this token out.
    {
        const prevToken = sourceCode.getTokenBefore(token, { includeComments: true });

        if (prevToken && prevToken.type === "Line") {
            return start;
        }
    }

    // Detect spaces before the token.
    while (ANY_SPACE.test(text[start - 1] || "")) {
        start -= 1;
    }

    return start;
}

/**
 * Get the range of a given token and around whitespaces.
 * @param {Token} token The token to get range.
 * @param {SourceCode} sourceCode The source code object to get tokens.
 * @returns {number} The start of the range of the token and around whitespaces.
 */
function getEndWithSpaces(token, sourceCode) {
    const text = sourceCode.text;
    let end = token.range[1];

    // Detect spaces after the token.
    while (ANY_SPACE.test(text[end] || "")) {
        end += 1;
    }

    return end;
}

/**
 * Autofixes the Object.assign call to use an object spread instead.
 * @param {ASTNode|null} node - The node that the rule warns on, i.e. the Object.assign call
 * @param {string} sourceCode - sourceCode of the Object.assign call
 * @returns {Function} autofixer - replaces the Object.assign with a spread object.
 */
function defineFixer(node, sourceCode) {
    return function *(fixer) {
        const leftParen = sourceCode.getTokenAfter(node.callee, isOpeningParenToken);
        const rightParen = sourceCode.getLastToken(node);

        // Remove the callee `Object.assign`
        yield fixer.remove(node.callee);

        // Replace the parens of argument list to braces.
        if (needsParens(node, sourceCode)) {
            yield fixer.replaceText(leftParen, "({");
            yield fixer.replaceText(rightParen, "})");
        } else {
            yield fixer.replaceText(leftParen, "{");
            yield fixer.replaceText(rightParen, "}");
        }

        // Process arguments.
        for (const argNode of node.arguments) {
            const innerParens = getParenTokens(argNode, leftParen, sourceCode);
            const left = innerParens.shift();
            const right = innerParens.pop();

            if (argNode.type === "ObjectExpression") {
                const maybeTrailingComma = sourceCode.getLastToken(argNode, 1);
                const maybeArgumentComma = sourceCode.getTokenAfter(right);

                /*
                 * Make bare this object literal.
                 * And remove spaces inside of the braces for better formatting.
                 */
                for (const innerParen of innerParens) {
                    yield fixer.remove(innerParen);
                }
                const leftRange = [left.range[0], getEndWithSpaces(left, sourceCode)];
                const rightRange = [
                    Math.max(getStartWithSpaces(right, sourceCode), leftRange[1]), // Ensure ranges don't overlap
                    right.range[1]
                ];

                yield fixer.removeRange(leftRange);
                yield fixer.removeRange(rightRange);

                // Remove the comma of this argument if it's duplication.
                if (
                    (argNode.properties.length === 0 || isCommaToken(maybeTrailingComma)) &&
                    isCommaToken(maybeArgumentComma)
                ) {
                    yield fixer.remove(maybeArgumentComma);
                }
            } else {

                // Make spread.
                if (argNeedsParens(argNode, sourceCode)) {
                    yield fixer.insertTextBefore(left, "...(");
                    yield fixer.insertTextAfter(right, ")");
                } else {
                    yield fixer.insertTextBefore(left, "...");
                }
            }
        }
    };
}

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description:
                "disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead.",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-object-spread"
        },

        schema: [],
        fixable: "code",

        messages: {
            useSpreadMessage: "Use an object spread instead of `Object.assign` eg: `{ ...foo }`.",
            useLiteralMessage: "Use an object literal instead of `Object.assign`. eg: `{ foo: bar }`."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            Program() {
                const scope = context.getScope();
                const tracker = new ReferenceTracker(scope);
                const trackMap = {
                    Object: {
                        assign: { [CALL]: true }
                    }
                };

                // Iterate all calls of `Object.assign` (only of the global variable `Object`).
                for (const { node } of tracker.iterateGlobalReferences(trackMap)) {
                    if (
                        node.arguments.length >= 1 &&
                        node.arguments[0].type === "ObjectExpression" &&
                        !hasArraySpread(node)
                    ) {
                        const messageId = node.arguments.length === 1
                            ? "useLiteralMessage"
                            : "useSpreadMessage";
                        const fix = defineFixer(node, sourceCode);

                        context.report({ node, messageId, fix });
                    }
                }
            }
        };
    }
};
