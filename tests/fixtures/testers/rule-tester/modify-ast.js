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
        "Identifier": function(node) {
            node.name += "!";

            if (node.name === "bar!") {
                context.report({message: "error", node: node});
            }
        }
    };
};
