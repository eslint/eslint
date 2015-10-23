/**
 * @fileoverview Disallows or enforces spaces inside of array brackets.
 * @author Jamund Ferguson
 * @copyright 2015 Jamund Ferguson. All rights reserved.
 * @copyright 2014 Brandyn Bennett. All rights reserved.
 * @copyright 2014 Michael Ficarra. No rights reserved.
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */
"use strict";

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var EXTRA_SPACE_AFTER_MESSAGE = "There should be no space after '{{token}}'",
    EXTRA_SPACE_BEFORE_MESSAGE = "There should be no space before '{{token}}'",
    SPACE_AFTER_MESSAGE = "A space is required after '{{token}}'",
    SPACE_BEFORE_MESSAGE = "A space is required before '{{token}}'";

module.exports = {
    meta: {
        errors: {
            extraSpaceAfter: EXTRA_SPACE_AFTER_MESSAGE,
            extraSpaceBefore: EXTRA_SPACE_BEFORE_MESSAGE,
            spaceAfter: SPACE_AFTER_MESSAGE,
            spaceBefore: SPACE_BEFORE_MESSAGE
        },
        description: "enforce spacing inside array brackets",
        ruleType: "Stylistic Issues",
        recommended: false,
        fixable: true,
        schema: [
            {
                "enum": ["always", "never"],
                "default": "never"
            },
            {
                "type": "object",
                "properties": {
                    "singleValue": {
                        "type": "boolean"
                    },
                    "objectsInArrays": {
                        "type": "boolean"
                    },
                    "arraysInArrays": {
                        "type": "boolean"
                    }
                },
                "additionalProperties": false
            }
        ]
    },
    register: function(context) {
        var spaced = context.options.always,
            sourceCode = context.getSourceCode();

        var options = {
            spaced: spaced,
            singleElementException: context.options.singleValue === !spaced,
            objectsInArraysException: context.options.objectsInArrays === !spaced,
            arraysInArraysException: context.options.arraysInArrays === !spaced
        };

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
        * Reports that there shouldn't be a space after the first token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportNoBeginningSpace(node, token) {
            context.report({
                node: node,
                loc: token.loc.start,
                message: EXTRA_SPACE_AFTER_MESSAGE,
                data: {
                    token: token.value
                },
                fix: function(fixer) {
                    var nextToken = context.getSourceCode().getTokenAfter(token);
                    return fixer.removeRange([token.range[1], nextToken.range[0]]);
                }
            });
        }

        /**
        * Reports that there shouldn't be a space before the last token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportNoEndingSpace(node, token) {
            context.report({
                node: node,
                loc: token.loc.start,
                message: EXTRA_SPACE_BEFORE_MESSAGE,
                data: {
                    token: token.value
                },
                fix: function(fixer) {
                    var previousToken = context.getSourceCode().getTokenBefore(token);
                    return fixer.removeRange([previousToken.range[1], token.range[0]]);
                }
            });
        }

        /**
        * Reports that there should be a space after the first token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportRequiredBeginningSpace(node, token) {
            context.report({
                node: node,
                loc: token.loc.start,
                message: SPACE_AFTER_MESSAGE,
                data: {
                    token: token.value
                },
                fix: function(fixer) {
                    return fixer.insertTextAfter(token, " ");
                }
            });
        }

        /**
        * Reports that there should be a space before the last token
        * @param {ASTNode} node - The node to report in the event of an error.
        * @param {Token} token - The token to use for the report.
        * @returns {void}
        */
        function reportRequiredEndingSpace(node, token) {
            context.report({
                node: node,
                loc: token.loc.start,
                message: SPACE_BEFORE_MESSAGE,
                data: {
                    token: token.value
                },
                fix: function(fixer) {
                    return fixer.insertTextBefore(token, " ");
                }
            });
        }

        /**
        * Determines if a node is an object type
        * @param {ASTNode} node - The node to check.
        * @returns {boolean} Whether or not the node is an object type.
        */
        function isObjectType(node) {
            return node.type === "ObjectExpression" || node.type === "ObjectPattern";
        }

        /**
        * Determines if a node is an array type
        * @param {ASTNode} node - The node to check.
        * @returns {boolean} Whether or not the node is an array type.
        */
        function isArrayType(node) {
            return node.type === "ArrayExpression" || node.type === "ArrayPattern";
        }

        /**
        * Validates the spacing around array brackets
        * @param {ASTNode} node - The node we're checking for spacing
        * @returns {void}
        */
        function validateArraySpacing(node) {
            if (options.spaced && node.elements.length === 0) {
                return;
            }

            var first = context.getFirstToken(node),
                second = context.getFirstToken(node, 1),
                penultimate = context.getLastToken(node, 1),
                last = context.getLastToken(node),
                firstElement = node.elements[0],
                lastElement = node.elements[node.elements.length - 1];

            var openingBracketMustBeSpaced =
                options.objectsInArraysException && isObjectType(firstElement) ||
                options.arraysInArraysException && isArrayType(firstElement) ||
                options.singleElementException && node.elements.length === 1
                    ? !options.spaced : options.spaced;

            var closingBracketMustBeSpaced =
                options.objectsInArraysException && isObjectType(lastElement) ||
                options.arraysInArraysException && isArrayType(lastElement) ||
                options.singleElementException && node.elements.length === 1
                    ? !options.spaced : options.spaced;

            if (astUtils.isTokenOnSameLine(first, second)) {
                if (openingBracketMustBeSpaced && !sourceCode.isSpaceBetweenTokens(first, second)) {
                    reportRequiredBeginningSpace(node, first);
                }
                if (!openingBracketMustBeSpaced && sourceCode.isSpaceBetweenTokens(first, second)) {
                    reportNoBeginningSpace(node, first);
                }
            }

            if (first !== penultimate && astUtils.isTokenOnSameLine(penultimate, last)) {
                if (closingBracketMustBeSpaced && !sourceCode.isSpaceBetweenTokens(penultimate, last)) {
                    reportRequiredEndingSpace(node, last);
                }
                if (!closingBracketMustBeSpaced && sourceCode.isSpaceBetweenTokens(penultimate, last)) {
                    reportNoEndingSpace(node, last);
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
