/**
 * @fileoverview Rule to disallow async functions which have no `await` expression.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Capitalize the 1st letter of the given text.
 * @param {string} text The text to capitalize.
 * @returns {string} The text that the 1st letter was capitalized.
 */
function capitalizeFirstLetter(text) {
    return text[0].toUpperCase() + text.slice(1);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow async functions which have no `await` expression",
            recommended: false,
            url: "https://eslint.org/docs/rules/require-await"
        },
        fixable: 'code', // Or `code` or `whitespace`
        schema: [],

        messages: {
            missingAwait: "{{name}} has no 'await' expression."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        let scopeInfo = null;

        /**
         * Push the scope info object to the stack.
         * @returns {void}
         */
        function enterFunction() {
            scopeInfo = {
                upper: scopeInfo,
                hasAwait: false
            };
        }

        /**
         * Pop the top scope info object from the stack.
         * Also, it reports the function if needed.
         * @param {ASTNode} node The node to report.
         * @returns {void}
         */
        function exitFunction(node) {
            if (!node.generator && node.async && !scopeInfo.hasAwait && !astUtils.isEmptyFunction(node)) {
                const loc = astUtils.getFunctionHeadLoc(node, sourceCode);
                const startIndex = sourceCode.getIndexFromLoc(loc.start);
                const endIndex = sourceCode.getIndexFromLoc(loc.end);
                const startToken = sourceCode.getTokenByRangeStart(startIndex);
                const endToken = sourceCode.getTokenByRangeStart(endIndex);
                let asyncToken;
                if (endToken) {
                    const tokens = sourceCode.getTokensBetween(startToken, endToken);
                    asyncToken = [startToken, ...tokens, endToken].find(token => token.type === 'Identifier' && token.value === 'async');
                } else if (astUtils.isArrowToken(startToken)) {
                    // async () => {}
                    const arrowStartIndex = sourceCode.getIndexFromLoc(node.loc.start);
                    asyncToken = sourceCode.getTokenByRangeStart(arrowStartIndex);
                }
                context.report({
                    node,
                    loc: astUtils.getFunctionHeadLoc(node, sourceCode),
                    messageId: "missingAwait",
                    data: {
                        name: capitalizeFirstLetter(
                            astUtils.getFunctionNameWithKind(node)
                        )
                    },
                    fix(fixer) {
                        if (asyncToken) {
                            const { range } = asyncToken;
                            return fixer.removeRange([range[0], range[1] + 1]);   
                        }
                    }
                });
            }

            scopeInfo = scopeInfo.upper;
        }

        return {
            FunctionDeclaration: enterFunction,
            FunctionExpression: enterFunction,
            ArrowFunctionExpression: enterFunction,
            "FunctionDeclaration:exit": exitFunction,
            "FunctionExpression:exit": exitFunction,
            "ArrowFunctionExpression:exit": exitFunction,

            AwaitExpression() {
                if (!scopeInfo) {
                    return;
                }

                scopeInfo.hasAwait = true;
            },
            ForOfStatement(node) {
                if (!scopeInfo) {
                    return;
                }

                if (node.await) {
                    scopeInfo.hasAwait = true;
                }
            }
        };
    }
};
