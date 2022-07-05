/**
 * @fileoverview Test rule to flag invalid args
 * @author Mathias Schreck
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        fixable: "code",
        schema: [{
            type: "boolean"
        }]
    },
    create(context) {
        var config = context.options[0];

        return {
            "Program": function(node) {
                if (config === true) {
                    context.report(node, "Invalid args");
                }
            }
        };
    }
};
