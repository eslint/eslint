/**
 * @fileoverview Test rule to flag invalid schemas
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
            "enum": []
        }]
    },
    create(context) {
        return {
            "Program": function(node) {
                if (config) {
                    context.report(node, "Expected nothing.");
                }
            }
        };
    },
};
