/**
 * @fileoverview Comma spacing - validates spacing before and after comma
 * @author Vignesh Anand aka vegetableman.
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = {
        before: context.options[0] ? !!context.options[0].before : false,
        after: context.options[0] ? !!context.options[0].after : true
    };

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines whether two adjacent tokens have whitespace between them.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not there is space between the tokens.
     */
    function isSpaced(left, right) {
        var punctuationLength = context.getTokensBetween(left, right).length; // the length of any parenthesis
        return (left.range[1] + punctuationLength) < right.range[0];
    }

    /**
     * Checks whether two tokens are on the same line.
     * @param {ASTNode} left The leftmost token.
     * @param {ASTNode} right The rightmost token.
     * @returns {boolean} True if the tokens are on the same line, false if not.
     * @private
     */
    function isSameLine(left, right) {
        return left.loc.end.line === right.loc.start.line;
    }

    /**
     * Determines if a given token is a comma operator.
     * @param {ASTNode} token The token to check.
     * @returns {boolean} True if the token is a comma, false if not.
     * @private
     */
    function isComma(token) {
        return !!token && (token.type === "Punctuator") && (token.value === ",");
    }

    /**
     * Reports a spacing error with an appropriate message.
     * @param {ASTNode} node The binary expression node to report.
     * @param {string} dir Is the error "before" or "after" the comma?
     * @returns {void}
     * @private
     */
    function report(node, dir) {
        context.report(node, options[dir] ?
            "A space is required " + dir + " ','." :
            "There should be no space " + dir + " ','.");
    }

    /**
     * Validates the spacing around single items in lists.
     * @param {Token} previousItemToken The last token from the previous item.
     * @param {Token} commaToken The token representing the comma.
     * @param {Token} currentItemToken The first token of the current item.
     * @param {Token} reportItem The item to use when reporting an error.
     * @returns {void}
     * @private
     */
    function validateCommaItemSpacing(previousItemToken, commaToken, currentItemToken, reportItem) {
        if (isSameLine(previousItemToken, commaToken) &&
                isSameLine(commaToken, currentItemToken)) {

            if (options.before !== isSpaced(previousItemToken, commaToken)) {
                report(reportItem, "before");
            }
            if (options.after !== isSpaced(commaToken, currentItemToken)) {
                report(reportItem, "after");
            }
        }
    }

    /**
     * Validates the spacing before and after commas.
     * @param {ASTNode} node The binary expression node to check.
     * @param {string} property The property of the node.
     * @returns {void}
     * @private
     */
    function validateCommaSpacing(node, property) {
        var items = node[property],
            previousItemToken,
            arrayLiteral = (node.type === "ArrayExpression");

        if (items && (items.length > 1 || arrayLiteral)) {

            // seed as opening [
            previousItemToken = context.getFirstToken(node);

            items.forEach(function(item) {
                var commaToken = item ? context.getTokenBefore(item) : previousItemToken,
                    currentItemToken = item ? context.getFirstToken(item) : context.getTokenAfter(commaToken),
                    reportItem = item || currentItemToken;

                /*
                 * This works by comparing three token locations:
                 * - previousItemToken is the last token of the previous item
                 * - commaToken is the location of the comma before the current item
                 * - currentItemToken is the first token of the current item
                 *
                 * These values get switched around if item is undefined.
                 * previousItemToken will refer to the last token not belonging
                 * to the current item, which could be a comma or an opening
                 * square bracket. currentItemToken could be a comma.
                 *
                 * All comparisons are done based on these tokens directly, so
                 * they are always valid regardless of an undefined item.
                 */
                if (isComma(commaToken)) {
                    validateCommaItemSpacing(previousItemToken, commaToken,
                            currentItemToken, reportItem);
                }

                previousItemToken = item ? context.getLastToken(item) : previousItemToken;
            });

            /*
             * Special case for array literals that have empty last items, such
             * as [ 1, 2, ]. These arrays only have two items show up in the
             * AST, so we need to look at the token to verify that there's no
             * dangling comma.
             */
            if (arrayLiteral) {

                var lastToken = context.getLastToken(node),
                    nextToLastToken = context.getTokenBefore(lastToken);

                if (isComma(nextToLastToken)) {
                    validateCommaItemSpacing(
                        context.getTokenBefore(nextToLastToken),
                        nextToLastToken,
                        lastToken,
                        lastToken
                    );
                }
            }
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "VariableDeclaration": function(node) {
            validateCommaSpacing(node, "declarations");
        },
        "ObjectExpression": function(node) {
            validateCommaSpacing(node, "properties");
        },
        "ArrayExpression": function(node) {
            validateCommaSpacing(node, "elements");
        },
        "SequenceExpression": function(node) {
            validateCommaSpacing(node, "expressions");
        },
        "FunctionExpression": function(node) {
            validateCommaSpacing(node, "params");
        },
        "FunctionDeclaration": function(node) {
            validateCommaSpacing(node, "params");
        },
        "CallExpression": function(node) {
            validateCommaSpacing(node, "arguments");
        },
        "NewExpression": function(node) {
            validateCommaSpacing(node, "arguments");
        }
    };

};
