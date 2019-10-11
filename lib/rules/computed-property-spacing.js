/**
 * @fileoverview Disallows or enforces spaces inside computed properties.
 * @author Jamund Ferguson
 */
"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "enforce consistent spacing inside computed property brackets",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/computed-property-spacing"
        },

        fixable: "whitespace",

        schema: [
            {
                enum: ["always", "never", "consistent"]
            },
            {
                type: "object",
                properties: {
                    enforceForClassMembers: {
                        type: "boolean",
                        default: false
                    },
                    maxSpaces: {
                        type: "integer",
                        minimum: 0,
                        default: 1
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unexpectedSpaceBefore: "There should be no space before '{{tokenValue}}'.",
            unexpectedSpaceAfter: "There should be no space after '{{tokenValue}}'.",

            missingSpaceBefore: "A space is required before '{{tokenValue}}'.",
            missingSpaceAfter: "A space is required after '{{tokenValue}}'.",

            inconsistentSpaces: "There should be equal number (no more than {{maxSpaces}}) of spaces around '{{expression}}'."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const options = context.options;
        const checkType = options[0];
        const settings = options[1] || {};
        const propertyNameMustBeSpaced = checkType === "always"; // default is "never"
        const consistentSpaces = checkType === "consistent";
        const enforceForClassMembers = settings.enforceForClassMembers;
        const maxSpaces = ("maxSpaces" in settings) ? settings.maxSpaces : 1;

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Reports that there shouldn't be a space after the first token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @param {Token} tokenAfter The token after `token`.
         * @returns {void}
         */
        function reportNoBeginningSpace(node, token, tokenAfter) {
            context.report({
                node,
                loc: token.loc.start,
                messageId: "unexpectedSpaceAfter",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    return fixer.removeRange([token.range[1], tokenAfter.range[0]]);
                }
            });
        }

        /**
         * Reports that there shouldn't be a space before the last token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @param {Token} tokenBefore The token before `token`.
         * @returns {void}
         */
        function reportNoEndingSpace(node, token, tokenBefore) {
            context.report({
                node,
                loc: token.loc.start,
                messageId: "unexpectedSpaceBefore",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    return fixer.removeRange([tokenBefore.range[1], token.range[0]]);
                }
            });
        }

        /**
         * Reports that there should be a space after the first token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @returns {void}
         */
        function reportRequiredBeginningSpace(node, token) {
            context.report({
                node,
                loc: token.loc.start,
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    return fixer.insertTextAfter(token, " ");
                }
            });
        }

        /**
         * Reports that there should be a space before the last token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @returns {void}
         */
        function reportRequiredEndingSpace(node, token) {
            context.report({
                node,
                loc: token.loc.start,
                messageId: "missingSpaceBefore",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    return fixer.insertTextBefore(token, " ");
                }
            });
        }

        /**
         * Reports that there should be equal number of spaces around expression.
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} beforeToken The token before expression.
         * @param {Token} firstToken The first token of expression.
         * @param {Token} lastToken The last token of expression.
         * @param {Token} afterToken The token after expression.
         * @returns {void}
         */
        function reportInconsistentSpaces(node, beforeToken, firstToken, lastToken, afterToken) {
            context.report({
                node,
                loc: firstToken.loc.start,
                messageId: "inconsistentSpaces",
                data: {
                    expression: sourceCode.getCleanTextBetweenTokens(beforeToken, afterToken).trim(),
                    maxSpaces
                },
                fix(fixer) {
                    return [
                        fixer.removeRange([beforeToken.range[1], firstToken.range[0]]),
                        fixer.removeRange([lastToken.range[1], afterToken.range[0]])
                    ];
                }
            });
        }

        /**
         * Returns a function that checks the spacing of a node on the property name
         * that was passed in.
         * @param {string} propertyName The property on the node to check for spacing
         * @returns {Function} A function that will check spacing on a node
         */
        function checkSpacing(propertyName) {
            return function(node) {
                if (!node.computed) {
                    return;
                }

                const property = node[propertyName];

                const before = sourceCode.getTokenBefore(property),
                    first = sourceCode.getFirstToken(property),
                    last = sourceCode.getLastToken(property),
                    after = sourceCode.getTokenAfter(property),
                    beforeFirstOnSameLine = astUtils.isTokenOnSameLine(before, first),
                    lastAfterOnSameLine = astUtils.isTokenOnSameLine(last, after);
                let textBetweenBeforeFirst,
                    textBetweenLastAfter;

                if (consistentSpaces) {
                    if (beforeFirstOnSameLine || lastAfterOnSameLine) {
                        textBetweenBeforeFirst = sourceCode.getCleanTextBetweenTokens(before, first);
                        textBetweenLastAfter = sourceCode.getCleanTextBetweenTokens(last, after);
                        if (textBetweenBeforeFirst !== textBetweenLastAfter || !/^ *$/u.test(textBetweenLastAfter) || textBetweenLastAfter.length > maxSpaces) {
                            reportInconsistentSpaces(node, before, first, last, after);
                        }
                    }
                } else {
                    if (beforeFirstOnSameLine) {
                        if (propertyNameMustBeSpaced) {
                            if (!sourceCode.isSpaceBetweenTokens(before, first)) {
                                reportRequiredBeginningSpace(node, before);
                            }
                        } else {
                            if (sourceCode.isSpaceBetweenTokens(before, first)) {
                                reportNoBeginningSpace(node, before, first);
                            }
                        }
                    }

                    if (lastAfterOnSameLine) {
                        if (propertyNameMustBeSpaced) {
                            if (!sourceCode.isSpaceBetweenTokens(last, after)) {
                                reportRequiredEndingSpace(node, after);
                            }
                        } else {
                            if (sourceCode.isSpaceBetweenTokens(last, after)) {
                                reportNoEndingSpace(node, after, last);
                            }
                        }
                    }
                }
            };
        }


        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        const listeners = {
            Property: checkSpacing("key"),
            MemberExpression: checkSpacing("property")
        };

        if (enforceForClassMembers) {
            listeners.MethodDefinition = checkSpacing("key");
        }

        return listeners;

    }
};
