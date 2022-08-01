/**
 * @fileoverview Test rule to flag schema violations
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",
        schema: [{
            "enum": ["foo"]
        }]
    },
    create(context) {
        const config = context.options[0];
        return {
            "Program": function(node) {
                if (config && config !== "foo") {
                    context.report(node, "Expected foo.");
                }
            }
        };
    },
};
