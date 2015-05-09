/**
 * @fileoverview Rule to flag use of try-catch statements
 * @author Andrew de Andrade
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "TryStatement": function(node) {
            context.report(node, "Unexpected use of 'try' statement.");
        }
    };

};
