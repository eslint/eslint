/**
 * @fileoverview Rule to flag trailing underscores in variable declarations.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

     //-------------------------------------------------------------------------
     // Helpers
     //-------------------------------------------------------------------------

    function checkForTrailingUnderscore(node) {
        var identifierName = node.name,
            len = node.name.length;

        if (identifierName[0] === "_" || identifierName[len-1] === "_") {
            context.report(node, "Unexpected dangling '_' in '" + identifierName + "'.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "Identifier": checkForTrailingUnderscore
    };

};
