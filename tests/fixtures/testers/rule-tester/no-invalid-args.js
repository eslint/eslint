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
        type: "problem",
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
