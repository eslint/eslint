/**
 * @fileoverview Rule which modifies AST.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    return {
        "Program": function(node) {
            node.body.push({
                "type": "Identifier",
                "name": "modified",
                "range": [0, 8],
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 8
                    }
                }
            });
        },

        "Identifier": function(node) {
            if (node.name === "bar") {
                context.report({message: "error", node: node});
            }
        }
    };
};
