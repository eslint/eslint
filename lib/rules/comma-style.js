/**
 * @fileoverview Comma style - enforces comma styles of two types: last and first
 * @author Vignesh Anand aka vegetableman
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var style = context.options[0] || "last";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Checks the comma placement with regards to a declaration/property/element
     * @param {ASTNode} node The binary expression node to check
     * @private
     * @returns {void}
     */
    function validateComma(node) {
        var items = node.declarations || node.properties || node.elements;

        if (items.length > 1) {
            items.forEach(function(item, index) {
                var tokenBefore = context.getTokenBefore(item),
                    itemBefore = items[index - 1];

                if (tokenBefore.value === ",") {
                    // if single line
                    if (tokenBefore.loc.end.line === item.loc.start.line &&
                        tokenBefore.loc.end.line === itemBefore.loc.end.line) {
                        return;
                    }
                    // lone comma
                    else if (tokenBefore.loc.end.line !== item.loc.start.line &&
                        tokenBefore.loc.end.line !== itemBefore.loc.end.line) {
                        context.report(item, {
                            line: tokenBefore.loc.end.line,
                            column: tokenBefore.loc.start.column
                        }, "Bad line breaking before and after ','.");
                    }
                    else if (style === "first" &&
                        tokenBefore.loc.start.line !== item.loc.start.line) {
                        context.report(item, "',' should be placed first.");
                    }
                    else if (style === "last" &&
                        tokenBefore.loc.end.line === item.loc.start.line) {
                        context.report(item, {
                            line: itemBefore.loc.end.line,
                            column: itemBefore.loc.end.column
                        }, "',' should be placed last.");
                    }
                }
            });
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "VariableDeclaration": validateComma,
        "ObjectExpression": validateComma,
        "ArrayExpression": validateComma
    };

};
