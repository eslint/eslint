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
        return left.range[1] < right.range[0];
    }

    /**
     * Validates the spacing before and after commas.
     * @param {ASTNode} node The binary expression node to check.
     * @private
     * @returns {void}
     */
    function validateCommaSpacing(node) {
        var items = node.declarations || node.properties || node.elements;

        if (items.length > 1) {
            items.forEach(function(item, index) {
                var tokenBefore = context.getTokenBefore(item);

                if (tokenBefore.value === ",") {
                    var itemBefore = items[index - 1],
                        tokenLoc = {
                            line: tokenBefore.loc.end.line,
                            column: tokenBefore.loc.start.column
                        };

                    if (tokenBefore.loc.end.line === itemBefore.loc.end.line &&
                        tokenBefore.loc.end.line === item.loc.start.line) {
                        if (options.before && options.after) {
                            if (!isSpaced(itemBefore, tokenBefore)) {
                                context.report(node, tokenLoc, "A space is required before ','.");
                            }
                            if (!isSpaced(tokenBefore, item)) {
                                context.report(node, tokenLoc, "A space is required after ','.");
                            }
                        } else if (options.before) {
                            if (!isSpaced(itemBefore, tokenBefore)) {
                                context.report(node, tokenLoc, "A space is required before ','.");
                            }
                            if (isSpaced(tokenBefore, item)) {
                                context.report(node, tokenLoc, "There should be no space after ','.");
                            }
                        } else if (options.after) {
                            if (!isSpaced(tokenBefore, item)) {
                                context.report(node, tokenLoc, "A space is required after ','.");
                            }
                            if (isSpaced(itemBefore, tokenBefore)) {
                                context.report(node, tokenLoc, "There should be no space before ','.");
                            }
                        } else {
                            if (isSpaced(itemBefore, tokenBefore)) {
                                context.report(node, tokenLoc, "There should be no space before ','.");
                            }
                            if (isSpaced(tokenBefore, item)) {
                                context.report(node, tokenLoc, "There should be no space after ','.");
                            }
                        }
                    }
                }
            });
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "VariableDeclaration": validateCommaSpacing,
        "ObjectExpression": validateCommaSpacing,
        "ArrayExpression": validateCommaSpacing
    };

};
