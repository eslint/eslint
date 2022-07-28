/**
 * @fileoverview Rule to flag use of eval() statement
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",
        schema: [],
    },
    create(context) {
        return {
            CallExpression: function (node) {
                if (node.callee.name === "eval") {
                    context.report(node, "eval sucks.");
                }
            },
        };
    },
};
