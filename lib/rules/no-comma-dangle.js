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
        var tokens = context.getTokens(node),
            secondToLastToken = tokens[tokens.length - 2];

        // The last token in an object/array literal will always be a closing
        // curly, so we check the second to last token for a comma.
        if (secondToLastToken.value === ",") {
            context.report(node, "Found trailing comma in object literal.");
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
