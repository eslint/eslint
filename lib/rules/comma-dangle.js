/**
 * @fileoverview Rule to forbid or enforce dangling commas.
 * @author Ian Christian Myers
 * @copyright 2015 Mathias Schreck
 * @copyright 2013 Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {
    var forbidDanglingComma = context.options[0] !== "always";

    /**
     * Checks the given node for trailing comma and reports violations.
     * @param {ASTNode} node The node of an ObjectExpression or ArrayExpression
     * @returns {void}
     */
    function checkForTrailingComma(node) {
        var items = node.properties || node.elements,
            length = items.length,
            lastItem,
            penultimateToken;

        if (length) {
            lastItem = items[length - 1];
            if (lastItem) {
                penultimateToken = context.getLastToken(node, 1);

                if (forbidDanglingComma) {
                    if (penultimateToken.value === ",") {
                        context.report(lastItem, penultimateToken.loc.start, "Unexpected trailing comma.");
                    }
                } else {
                    if (penultimateToken.value !== ",") {
                        context.report(lastItem, lastItem.loc.end, "Missing trailing comma.");
                    }
                }
            }
        }
    }

    return {
        "ObjectExpression": checkForTrailingComma,
        "ArrayExpression": checkForTrailingComma
    };
};
