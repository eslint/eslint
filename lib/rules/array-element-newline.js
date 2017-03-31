/**
 * @fileoverview Rule to enforce line breaks after each array element
 * @author Jan Peer Stöcklmair <https://github.com/JPeer264>
 */

"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce line breaks after each array element",
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
                            multiline: {
                                type: "boolean"
                            },
                            minItems: {
                                type: "integer",
                                minimum: 0
                            }
                        },
                        additionalProperties: false
                    }
                ]
            }
        ]
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Normalizes a given option value.
         *
         * @param {string|Object|undefined} option - An option value to parse.
         * @returns {{multiline: boolean, minItems: number}} Normalized option object.
         */
        function normalizeOptionValue(option) {
            let multiline = false;
            let minItems;

            option = option || "always";

            if (option) {
                if (option === "always") {
                    minItems = 0;
                } else if (option === "never") {
                    minItems = Number.POSITIVE_INFINITY;
                } else {
                    multiline = Boolean(option.multiline);
                    minItems = option.minItems || Number.POSITIVE_INFINITY;
                }
            }

            return { multiline, minItems };
        }

        /**
         * Normalizes a given option value.
         *
         * @param {string|Object|undefined} options - An option value to parse.
         * @returns {{ArrayExpression: {multiline: boolean, minItems: number}, ArrayPattern: {multiline: boolean, minItems: number}}} Normalized option object.
         */
        function normalizeOptions(options) {
            const value = normalizeOptionValue(options);

            return { ArrayExpression: value, ArrayPattern: value };
        }

        /**
        * Reports that there shouldn't be a line break after the first token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportNoLineBreak(node, token) {
            context.report({
                node,
                loc: token.loc,
                message: "There should be no line break before this item.",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    const tokenBefore = sourceCode.getTokenBefore(token, { includeComments: true });

                    if (astUtils.isCommentToken(tokenBefore)) {
                        return null;
                    }

                    return fixer.replaceTextRange([tokenBefore.range[1], token.range[0]], " ");
                }
            });
        }

        /**
        * Reports that there should be a line break after the first token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportRequiredLineBreak(node, token) {
            context.report({
                node,
                loc: token.loc,
                message: "A line break is required before this item.",
                fix(fixer) {
                    const tokenBefore = sourceCode.getTokenBefore(token, { includeComments: true });

                    return fixer.replaceTextRange([tokenBefore.range[1], token.range[0]], "\n");
                }
            });
        }

        /**
         * Reports a given node if it violated this rule.
         *
         * @param {ASTNode} node - A node to check. This is an ObjectExpression node or an ObjectPattern node.
         * @param {{multiline: boolean, minItems: number}} options - An option object.
         * @returns {void}
         */
        function check(node) {
            const elements = node.elements;
            const normalizedOptions = normalizeOptions(context.options[0]);
            const options = normalizedOptions[node.type];
            const openBracket = sourceCode.getFirstToken(node);
            const closeBracket = sourceCode.getLastToken(node);
            const last = sourceCode.getTokenBefore(closeBracket, { includeComments: true });
            const first = sourceCode.getTokenAfter(openBracket, { includeComments: true });

            const needsLinebreaks = (
                elements.length >= options.minItems ||
                (
                    options.multiline &&
                    elements.length > 0 &&
                    first.loc.start.line !== last.loc.end.line
                )
            );

            elements.forEach((element, i) => {
                if (i === 0) {
                    return;
                }

                const lastElement = node.elements[i - 1];
                const lastTokenOfPreviousProperty = sourceCode.getLastToken(lastElement);
                const firstTokenOfCurrentProperty = sourceCode.getFirstToken(element);

                if (needsLinebreaks) {
                    if (astUtils.isTokenOnSameLine(lastTokenOfPreviousProperty, firstTokenOfCurrentProperty)) {
                        reportRequiredLineBreak(node, firstTokenOfCurrentProperty);
                    }
                } else {
                    if (!astUtils.isTokenOnSameLine(lastTokenOfPreviousProperty, firstTokenOfCurrentProperty)) {
                        reportNoLineBreak(node, firstTokenOfCurrentProperty);
                    }
                }
            });
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ArrayPattern: check,
            ArrayExpression: check
        };
    }
};
