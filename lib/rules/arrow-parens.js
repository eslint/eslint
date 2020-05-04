/**
 * @fileoverview Rule to require parens in arrow function arguments.
 * @author Jxck
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
 * Get location should be reported by AST node.
 * @param {ASTNode} node AST Node.
 * @returns {Location} Location information.
 */
function getLocation(node) {
    return {
        start: node.params[0].loc.start,
        end: node.params[node.params.length - 1].loc.end
    };
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "require parentheses around arrow function arguments",
            category: "ECMAScript 6",
            recommended: false,
            url: "https://eslint.org/docs/rules/arrow-parens"
        },

        fixable: "code",

        schema: [
            {
                enum: ["always", "as-needed"]
            },
            {
                type: "object",
                properties: {
                    requireForBlockBody: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unexpectedParens: "Unexpected parentheses around single function argument.",
            expectedParens: "Expected parentheses around arrow function argument.",

            unexpectedParensInline: "Unexpected parentheses around single function argument having a body with no curly braces.",
            expectedParensBlock: "Expected parentheses around arrow function argument having a body with curly braces."
        }
    },

    create(context) {
        const asNeeded = context.options[0] === "as-needed";
        const requireForBlockBody = asNeeded && context.options[1] && context.options[1].requireForBlockBody === true;

        const sourceCode = context.getSourceCode();

        /**
         * Checks if token is part of the given node.
         * @param {ASTNode} token A node to check.
         * @param {ASTNode} node The arrow function node.
         * @returns {boolean} Whether or not the token is part of node.
         */
        function isTokenPartOfNode(token, node) {
            return token.range[0] >= node.range[0] && token.range[1] <= node.range[1];
        }

        /**
         * Determines whether a arrow function argument end with `)`
         * @param {ASTNode} node The arrow function node.
         * @returns {void}
         */
        function parens(node) {
            const arrowToken = sourceCode.getTokenBefore(node.body, astUtils.isArrowToken);

            const openingParenToken = node.params.length >= 1 && node.params[0].type === "Identifier"
                ? sourceCode.getTokenBefore(node.params[0], t => isTokenPartOfNode(t, node) && astUtils.isOpeningParenToken(t))
                : sourceCode.getTokenBefore(arrowToken, t => isTokenPartOfNode(t, node) && astUtils.isOpeningParenToken(t));

            /**
             * Remove the parenthesis around a parameter
             * @param {Fixer} fixer Fixer
             * @returns {string} fixed parameter
             */
            function fixUnwrap(fixer) {
                const firstParamToken = sourceCode.getTokenAfter(openingParenToken);

                //     /*
                //      * ES8 allows Trailing commas in function parameter lists and calls
                //      * https://github.com/eslint/eslint/issues/8834
                //      */
                const closingParenToken = sourceCode.getTokenAfter(firstParamToken, astUtils.isClosingParenToken);

                const adjacentToken = sourceCode.getTokenBefore(openingParenToken);

                const shouldAddSpace =
                    adjacentToken &&
                    !astUtils.canTokensBeAdjacent(adjacentToken, firstParamToken) &&
                    adjacentToken.range[1] === openingParenToken.range[0];

                return fixer.replaceTextRange([
                    openingParenToken.range[0],
                    closingParenToken.range[1]
                ], `${shouldAddSpace ? " " : ""}${firstParamToken.value}`);
            }


            /**
             * Adds the parenthesis around a parameter
             * @param {Fixer} fixer Fixer
             * @returns {string} fixed parameter
             */
            function fixWrap(fixer) {
                const firstParamToken = sourceCode.getFirstToken(node, node.async ? 1 : 0);

                return fixer.replaceText(firstParamToken, `(${firstParamToken.value})`);
            }

            // "as-needed", { "requireForBlockBody": true }: x => x
            if (
                requireForBlockBody &&
                node.params.length === 1 &&
                node.params[0].type === "Identifier" &&
                !node.params[0].typeAnnotation &&
                !node.typeParameters &&
                node.body.type !== "BlockStatement" &&
                !node.returnType
            ) {
                if (openingParenToken) {
                    context.report({
                        node,
                        messageId: "unexpectedParensInline",
                        loc: getLocation(node),
                        fix: fixUnwrap

                    });
                }
                return;
            }

            if (
                requireForBlockBody &&
                node.body.type === "BlockStatement"
            ) {
                if (!openingParenToken) {
                    context.report({
                        node,
                        messageId: "expectedParensBlock",
                        loc: getLocation(node),
                        fix: fixWrap
                    });
                }
                return;
            }

            // "as-needed": x => x
            if (asNeeded &&
                node.params.length === 1 &&
                node.params[0].type === "Identifier" &&
                !node.params[0].typeAnnotation &&
                !node.typeParameters &&
                !node.returnType
            ) {
                if (openingParenToken) {
                    context.report({
                        node,
                        messageId: "unexpectedParens",
                        loc: getLocation(node),
                        fix: fixUnwrap
                    });
                }
                return;
            }

            // "always"
            if (!openingParenToken) {
                context.report({
                    node,
                    messageId: "expectedParens",
                    loc: getLocation(node),
                    fix: fixWrap
                });
            }
        }

        return {
            ArrowFunctionExpression: parens
        };
    }
};
