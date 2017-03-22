/**
 * @fileoverview Rule to enforce line breaks after open and before close array brackets
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
            description: "enforce line breaks after open and before close array brackets",
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
         * @param {string|Object|undefined} value - An option value to parse.
         * @returns {{multiline: boolean, minItems: number}} Normalized option object.
         */
        function normalizeOptionValue(value) {
            let multiline = false;
            let minItems = Number.POSITIVE_INFINITY;

            value = value || "always";

            if (value) {
                if (value === "always") {
                    minItems = 0;
                } else if (value === "never") {
                    minItems = Number.POSITIVE_INFINITY;
                } else {
                    multiline = Boolean(value.multiline);
                    minItems = value.minItems || Number.POSITIVE_INFINITY;
                }
            } else {
                multiline = true;
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
            if (options && (options.ArrayExpression || options.ArrayPattern)) {
                return {
                    ArrayExpression: normalizeOptionValue(options.ArrayExpression),
                    ArrayPattern: normalizeOptionValue(options.ArrayPattern)
                };
            }

            const value = normalizeOptionValue(options);

            return { ArrayExpression: value, ArrayPattern: value };
        }

        /**
        * Reports that there shouldn't be a break after the first token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportNoBeginningBreak(node, token) {
            context.report({
                node,
                loc: token.loc.start,
                message: "There should be no break after '{{tokenValue}}'.",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    const nextToken = sourceCode.getTokenAfter(token);

                    return fixer.removeRange([token.range[1], nextToken.range[0]]);
                }
            });
        }

        /**
        * Reports that there shouldn't be a break before the last token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportNoEndingBreak(node, token) {
            context.report({
                node,
                loc: token.loc.start,
                message: "There should be no break before '{{tokenValue}}'.",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    const previousToken = sourceCode.getTokenBefore(token);

                    return fixer.removeRange([previousToken.range[1], token.range[0]]);
                }
            });
        }

        /**
        * Reports that there should be a break after the first token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportRequiredBeginningBreak(node, token) {
            context.report({
                node,
                loc: token.loc.start,
                message: "A break is required after '{{tokenValue}}'.",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    return fixer.insertTextAfter(token, "\n");
                }
            });
        }

        /**
        * Reports that there should be a break before the last token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportRequiredEndingBreak(node, token) {
            context.report({
                node,
                loc: token.loc.start,
                message: "A break is required before '{{tokenValue}}'.",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    return fixer.insertTextBefore(token, "\n");
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
            let first = sourceCode.getTokenAfter(openBracket, { includeComments: true });
            let last = sourceCode.getTokenBefore(closeBracket, { includeComments: true });

            const needsLinebreaks = (
                elements.length >= options.minItems ||
                (
                    options.multiline &&
                    elements.length > 0 &&
                    first.loc.start.line !== last.loc.end.line
                )
            );

            /*
             * Use tokens or comments to check multiline or not.
             * But use only tokens to check whether line breaks are needed.
             * This allows:
             *     var arr = [ // eslint-disable-line foo
             *         'a'
             *     ]
             */
            first = sourceCode.getTokenAfter(openBracket);
            last = sourceCode.getTokenBefore(closeBracket);

            if (needsLinebreaks) {
                if (astUtils.isTokenOnSameLine(openBracket, first)) {
                    reportRequiredBeginningBreak(node, sourceCode.getFirstToken(openBracket));
                }
                if (astUtils.isTokenOnSameLine(last, closeBracket)) {
                    reportRequiredEndingBreak(node, sourceCode.getLastToken(closeBracket));
                }
            } else {
                if (!astUtils.isTokenOnSameLine(openBracket, first)) {
                    reportNoBeginningBreak(node, sourceCode.getFirstToken(openBracket));
                }
                if (!astUtils.isTokenOnSameLine(last, closeBracket)) {
                    reportNoEndingBreak(node, sourceCode.getLastToken(closeBracket));
                }
            }
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
