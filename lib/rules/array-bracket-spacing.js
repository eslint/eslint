/**
 * @fileoverview Disallows or enforces spaces inside of array brackets.
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
            description: "enforce consistent spacing inside array brackets",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/array-bracket-spacing"
        },

        fixable: "whitespace",

        schema: [
            {
                enum: ["always", "never"]
            },
            {
                type: "object",
                properties: {
                    singleValue: {
                        type: "boolean"
                    },
                    objectsInArrays: {
                        type: "boolean"
                    },
                    arraysInArrays: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unexpectedSpaceAfter: "There should be no space after '{{tokenValue}}'.",
            unexpectedSpaceBefore: "There should be no space before '{{tokenValue}}'.",
            missingSpaceAfter: "A space is required after '{{tokenValue}}'.",
            missingSpaceBefore: "A space is required before '{{tokenValue}}'."
        }
    },
    create(context) {
        const spaced = context.options[0] === "always",
            sourceCode = context.getSourceCode();

        /**
         * Determines whether an option is set, relative to the spacing option.
         * If spaced is "always", then check whether option is set to false.
         * If spaced is "never", then check whether option is set to true.
         * @param {Object} option The option to exclude.
         * @returns {boolean} Whether or not the property is excluded.
         */
        function isOptionSet(option) {
            return context.options[1] ? context.options[1][option] === !spaced : false;
        }

        const options = {
            spaced,
            singleElementException: isOptionSet("singleValue"),
            objectsInArraysException: isOptionSet("objectsInArrays"),
            arraysInArraysException: isOptionSet("arraysInArrays")
        };

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Reports that there shouldn't be a space after the first token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @param {boolean} isCommentBeforeSpace is comments before whitespace
         * @returns {void}
         */
        function reportNoBeginningSpace(node, token, isCommentBeforeSpace = false) {
            const nextToken = sourceCode.getTokenAfter(token);
            const comments = sourceCode.getCommentsBefore(nextToken);

            context.report({
                node,
                loc: { start: token.loc.end, end: nextToken.loc.start },
                messageId: "unexpectedSpaceAfter",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    if (comments.length > 0) {
                        if (isCommentBeforeSpace) {
                            return fixer.removeRange([comments[comments.length - 1].range[1], nextToken.range[0]]);
                        }
                        return fixer.removeRange([token.range[1], comments[0].range[0]]);
                    }
                    return fixer.removeRange([token.range[1], nextToken.range[0]]);
                }
            });
        }

        /**
         * Reports that there shouldn't be a space before the last token
         * @param {ASTNode} node The node to report in the event of an error.
         * @param {Token} token The token to use for the report.
         * @returns {void}
         */
        function reportNoEndingSpace(node, token) {
            const previousToken = sourceCode.getTokenBefore(token);
            const comments = sourceCode.getCommentsBefore(token);

            context.report({
                node,
                loc: { start: previousToken.loc.end, end: token.loc.start },
                messageId: "unexpectedSpaceBefore",
                data: {
                    tokenValue: token.value
                },
                fix(fixer) {
                    if (comments.length > 0) {
                        return fixer.removeRange([comments[comments.length - 1].range[1], token.range[0]]);
                    }
                    return fixer.removeRange([previousToken.range[1], token.range[0]]);
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
                loc: token.loc,
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
                loc: token.loc,
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
         * Determines if a node is an object type
         * @param {ASTNode} node The node to check.
         * @returns {boolean} Whether or not the node is an object type.
         */
        function isObjectType(node) {
            return node && (node.type === "ObjectExpression" || node.type === "ObjectPattern");
        }

        /**
         * Determines if a node is an array type
         * @param {ASTNode} node The node to check.
         * @returns {boolean} Whether or not the node is an array type.
         */
        function isArrayType(node) {
            return node && (node.type === "ArrayExpression" || node.type === "ArrayPattern");
        }

        /**
         * Validates the spacing around array brackets
         * @param {ASTNode} node The node we're checking for spacing
         * @returns {void}
         */
        function validateArraySpacing(node) {
            if (options.spaced && node.elements.length === 0) {
                return;
            }

            let first = sourceCode.getFirstToken(node);
            let last = node.typeAnnotation
                ? sourceCode.getTokenBefore(node.typeAnnotation)
                : sourceCode.getLastToken(node);
            const second = sourceCode.getFirstToken(node, 1),
                penultimate = sourceCode.getTokenBefore(last),
                firstElement = node.elements[0],
                lastElement = node.elements[node.elements.length - 1];

            const openingBracketMustBeSpaced =
                options.objectsInArraysException && isObjectType(firstElement) ||
                options.arraysInArraysException && isArrayType(firstElement) ||
                options.singleElementException && node.elements.length === 1
                    ? !options.spaced : options.spaced;

            const closingBracketMustBeSpaced =
                options.objectsInArraysException && isObjectType(lastElement) ||
                options.arraysInArraysException && isArrayType(lastElement) ||
                options.singleElementException && node.elements.length === 1
                    ? !options.spaced : options.spaced;

            const commentsAfterFirstToken = sourceCode.getCommentsAfter(first);

            if (astUtils.isTokenOnSameLine(first, second)) {
                if (openingBracketMustBeSpaced && !sourceCode.isSpaceBetweenTokens(first, second)) {
                    reportRequiredBeginningSpace(node, first);
                }

                /**
                 * Check if there are comments or not. If `true`, then need to consider comments as
                 * tokens to prevent them from being removed
                 *
                 * Same goes for `Before` as well.
                 */
                if (commentsAfterFirstToken.length > 0) {

                    /**
                     * Check if there is space between firs comment and first paren `[`
                     * i.e
                     * `[ <comment here>`
                     *
                     * This check is needed to check for whitespace before and after of comments
                     * `[ <comment here> `
                     */
                    if (!openingBracketMustBeSpaced && sourceCode.isSpaceBetweenTokens(first, commentsAfterFirstToken[0])) {

                        reportNoBeginningSpace(node, first);
                    }

                    /**
                     * This means that comment is before the white space with first `[`, i.e `[<comment here> `
                     */
                    first = commentsAfterFirstToken[commentsAfterFirstToken.length - 1];
                }

                /**
                 * Check for second time only
                 * when there are atleast one element in the node
                 * or, there are no elements as well as no comments eg `[  ]`
                 */
                if (node.elements.length !== 0 || (commentsAfterFirstToken.length === 0 && node.elements.length === 0)) {
                    if (!openingBracketMustBeSpaced && sourceCode.isSpaceBetweenTokens(first, second)) {
                        reportNoBeginningSpace(node, first, commentsAfterFirstToken.length > 0);
                    }
                }

            }

            const commentsBeforeLastToken = sourceCode.getCommentsBefore(last);

            if ((commentsBeforeLastToken.length > 0 || first !== penultimate) && astUtils.isTokenOnSameLine(penultimate, last)) {
                if (closingBracketMustBeSpaced && !sourceCode.isSpaceBetweenTokens(penultimate, last)) {
                    reportRequiredEndingSpace(node, last);
                }

                if (commentsBeforeLastToken.length > 0) {

                    /**
                     * This is to check for space between last comment and `]`
                     */
                    if (!closingBracketMustBeSpaced && sourceCode.isSpaceBetweenTokens(commentsBeforeLastToken[commentsBeforeLastToken.length - 1], last)) {
                        reportNoEndingSpace(node, last);
                    }
                    last = commentsBeforeLastToken[0];
                }

                if (node.elements.length !== 0 || (commentsBeforeLastToken.length === 0 && node.elements.length === 0)) {
                    if (!closingBracketMustBeSpaced && sourceCode.isSpaceBetweenTokens(penultimate, last)) {
                        reportNoEndingSpace(node, last);
                    }
                }
            }
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            ArrayPattern: validateArraySpacing,
            ArrayExpression: validateArraySpacing
        };
    }
};
