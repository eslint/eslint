/**
 * @fileoverview Rule to flag trailing commas in object literals.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

     //-------------------------------------------------------------------------
     // Helpers
     //-------------------------------------------------------------------------

    function checkForTrailingComma(node) {
        var secondToLastToken = context.getLastTokens(node, 2)[0];

        var items = node.properties || node.elements,
            lastItem = items[items.length - 1];
        // The last token in an object/array literal will always be a closing
        // curly, so we check the second to last token for a comma.
        if(secondToLastToken.value === "," && items.length && lastItem) {
            context.report(lastItem, secondToLastToken.loc.start, "Trailing comma.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "ObjectExpression": checkForTrailingComma,
        "ArrayExpression": checkForTrailingComma
    };

};
