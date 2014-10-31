/**
 * @fileoverview Rule to flag trailing commas in object literals.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var always = (context.options[0] === "always");

     //-------------------------------------------------------------------------
     // Helpers
     //-------------------------------------------------------------------------

    function checkForTrailingComma(node) {
        var secondToLastToken = context.getLastTokens(node, 2)[0],
            isComma = secondToLastToken && secondToLastToken.value === ",",
            items = node.properties || node.elements,
            lastItem = items[items.length - 1];
        // The last token in an object/array literal will always be a closing
        // curly, so we check the second to last token for a comma.
        if (items.length && lastItem) {
            if (!always && isComma) {
                context.report(lastItem, secondToLastToken.loc.start, "Trailing comma.");
            } else if (always && !isComma) {
                context.report(lastItem, secondToLastToken.loc.start, "No trailing comma.");
            }
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
