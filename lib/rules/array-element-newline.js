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
                                type: ["integer", "null"],
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

            if (option === "always" || option.minItems === 0) {
                minItems = 0;
            } else if (option === "never") {
                minItems = Number.POSITIVE_INFINITY;
            } else {
                multiline = Boolean(option.multiline);
                minItems = option.minItems || Number.POSITIVE_INFINITY;
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
            const tokenBefore = sourceCode.getTokenBefore(token, { includeComments: true });

            context.report({
                node,
                loc: {
                    start: tokenBefore.loc.end,
                    end: token.loc.start
                },
                message: "There should be no linebreak here.",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    if (astUtils.isCommentToken(tokenBefore)) {
                        return null;
                    }

                    if (!astUtils.isTokenOnSameLine(tokenBefore, token)) {
                        return fixer.replaceTextRange([tokenBefore.range[1], token.range[0]], " ");
                    }

                    /*
                     * This will check if the comma is on the same line as the next element
                     * Following array:
                     * [
                     *     1
                     *     , 2
                     *     , 3
                     * ]
                     *
                     * will be fixed to:
                     * [
                     *     1, 2, 3
                     * ]
                     */
                    const twoTokensBefore = sourceCode.getTokenBefore(tokenBefore, { includeComments: true });

                    if (astUtils.isCommentToken(twoTokensBefore)) {
                        return null;
                    }

                    return fixer.replaceTextRange([twoTokensBefore.range[1], tokenBefore.range[0]], "");

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
            let tokenBefore = sourceCode.getTokenBefore(token, { includeComments: true });

            // in case array elements are surrounded by parentheses
            // the element token does usually not include them.
            // set token and tokenBefore before these parentheses
            if (tokenBefore.value === "(") {
                token = tokenBefore;
                tokenBefore = sourceCode.getTokenBefore(token, { includeComments: true });
            }

            context.report({
                node,
                loc: {
                    start: tokenBefore.loc.end,
                    end: token.loc.start
                },
                message: "There should be a linebreak after this element.",
                fix(fixer) {
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

            let elementBreak = false;

            /*
             * MULTILINE: true
             * loop through every element and check
             * if at least one element has linebreaks inside
             * this ensures that following is not valid (due to elements are on the same line):
             *
             * [
             *      1,
             *      2,
             *      3
             * ]
             */
            if (options.multiline) {
                elementBreak = elements
                    .filter(element => element !== null)
                    .some(element => element.loc.start.line !== element.loc.end.line);
            }

            const needsLinebreaks = (
                elements.length >= options.minItems ||
                (
                    options.multiline &&
                    elementBreak
                )
            );

            elements.forEach((element, i) => {
                const lastElement = elements[i - 1];

                if (i === 0 || element === null || lastElement === null) {
                    return;
                }

                const lastTokenOfPreviousElement = sourceCode.getLastToken(lastElement);
                const firstTokenOfCurrentElement = sourceCode.getFirstToken(element);

                if (needsLinebreaks) {
                    if (astUtils.isTokenOnSameLine(lastTokenOfPreviousElement, firstTokenOfCurrentElement)) {
                        reportRequiredLineBreak(node, firstTokenOfCurrentElement);
                    }
                } else {
                    if (!astUtils.isTokenOnSameLine(lastTokenOfPreviousElement, firstTokenOfCurrentElement)) {
                        reportNoLineBreak(node, firstTokenOfCurrentElement);
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
