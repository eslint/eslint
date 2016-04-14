/**
 * @fileoverview Rule to flag use of continue statement
 * @author Borislav Zhivkov
 * @copyright 2015 Borislav Zhivkov. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow `continue` statements",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: []
    },

    create: function(context) {

        return {
            "ContinueStatement": function(node) {
                context.report(node, "Unexpected use of continue statement");
            }
        };

    }
};
