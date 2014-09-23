/**
 * @fileoverview Disallows or enforces spaces inside of brackets.
 * @author Ian Christian Myers
 * @copyright 2014 Brandyn Bennett. All rights reserved.
 * @copyright 2014 Michael Ficarra. No rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var options = {
        spaced: context.options[0] === "always",
        singleElementException: context.options[1] != null && !!context.options[1].singleValue,
        objectsInArraysException: context.options[1] != null && !!context.options[1].objectsInArrays,
        arraysInArraysException: context.options[1] != null && !!context.options[1].arraysInArrays,
        propertyName: context.options[1] == null || context.options[1].propertyName == null || !!context.options[1].propertyName
    };

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines whether two adjacent tokens are have whitespace between them.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not there is space between the tokens.
     */
    function isSpaced(left, right) {
        return left.range[1] < right.range[0];
    }

    /**
     * Determines whether two adjacent tokens are on the same line.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not the tokens are on the same line.
     */
    function isSameLine(left, right) {
        return left.loc.start.line === right.loc.start.line;
    }

    /**
    * Reports that there shouldn't be a space after the first token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function reportNoBeginningSpace(node, tokens) {
        context.report(node, tokens[0].loc.start,
                    "There should be no space after '" + tokens[0].value + "'");
    }

    /**
    * Reports that there shouldn't be a space before the last token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function reportNoEndingSpace(node, tokens) {
        context.report(node, tokens[tokens.length - 1].loc.start,
                    "There should be no space before '" + tokens[tokens.length - 1].value + "'");
    }

    /**
    * Reports that there should be a space after the first token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function reportRequiredBeginningSpace(node, tokens) {
        context.report(node, tokens[0].loc.start,
                    "A space is required after '" + tokens[0].value + "'");
    }

    /**
    * Reports that there should be a space before the last token
    * @param {ASTNode} node - The node to report in the event of an error.
    * @param {Object[]} tokens - The tokens to be checked for spacing.
    * @returns {void}
    */
    function reportRequiredEndingSpace(node, tokens) {
        context.report(node, tokens[tokens.length - 1].loc.start,
                    "A space is required before '" + tokens[tokens.length - 1].value + "'");
    }


    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        MemberExpression: options.propertyName ? function checkMember(node) {
            if (node.computed) {
                var tokens = context.getTokens(node.property, 1, 1);
                var tokenA = tokens[0], tokenB = tokens[1],
                    tokenC = tokens[tokens.length - 2], tokenD = tokens[tokens.length - 1];
                if (isSameLine(tokenA, tokenB) || isSameLine(tokenC, tokenD)) {
                    if (options.spaced) {
                        if (!isSpaced(tokenA, tokenB) && isSameLine(tokenA, tokenB)) {
                            reportRequiredBeginningSpace(node, tokens);
                        }
                        if (!isSpaced(tokenC, tokenD) && isSameLine(tokenC, tokenD)) {
                            reportRequiredEndingSpace(node, tokens);
                        }
                    } else {
                        if (isSpaced(tokenA, tokenB)) {
                            reportNoBeginningSpace(node, tokens);
                        }
                        if (isSpaced(tokenC, tokenD)) {
                            reportNoEndingSpace(node, tokens);
                        }
                    }
                }
            }
        } : function(){},

        ArrayExpression: function(node) {
            if (node.elements.length === 0) {
                return;
            }
            var tokens = context.getTokens(node);
            var tokenA = tokens[0], tokenB = tokens[1],
                tokenC = tokens[tokens.length - 2], tokenD = tokens[tokens.length - 1];

            var openingBracketMustBeSpaced =
                options.objectsInArraysException && tokenB.value === "{" ||
                options.arraysInArraysException && tokenB.value === "[" ||
                options.singleElementException && node.elements.length === 1
                ? !options.spaced : options.spaced;

            var closingBracketMustBeSpaced =
                options.objectsInArraysException && tokenC.value === "}" ||
                options.arraysInArraysException && tokenC.value === "]" ||
                options.singleElementException && node.elements.length === 1
                ? !options.spaced : options.spaced;

            if (isSameLine(tokenA, tokenB) || isSameLine(tokenC, tokenD)) {
                if (openingBracketMustBeSpaced && !isSpaced(tokenA, tokenB)) {
                    reportRequiredBeginningSpace(node, tokens);
                } else if (!openingBracketMustBeSpaced && isSpaced(tokenA, tokenB)) {
                    reportNoBeginningSpace(node, tokens);
                }
                if (closingBracketMustBeSpaced && !isSpaced(tokenC, tokenD)) {
                    reportRequiredEndingSpace(node, tokens);
                } else if (!closingBracketMustBeSpaced && isSpaced(tokenC, tokenD)) {
                    reportNoEndingSpace(node, tokens);
                }
            }
        },

        ObjectExpression: function(node) {
            if (node.properties.length === 0) {
                return;
            }
            var tokens = context.getTokens(node);
            var tokenA = tokens[0], tokenB = tokens[1],
                tokenC = tokens[tokens.length - 2], tokenD = tokens[tokens.length - 1];
            if (isSameLine(tokenA, tokenB) || isSameLine(tokenC, tokenD)) {
                if (options.spaced) {
                    if (!isSpaced(tokenA, tokenB)) {
                        reportRequiredBeginningSpace(node, tokens);
                    }
                    if (!isSpaced(tokenC, tokenD)) {
                        reportRequiredEndingSpace(node, tokens);
                    }
                } else {
                    if (isSpaced(tokenA, tokenB)) {
                        reportNoBeginningSpace(node, tokens);
                    }
                    if (isSpaced(tokenC, tokenD)) {
                        reportNoEndingSpace(node, tokens);
                    }
                }
            }
        }

    };

};
