/**
 * @fileoverview Rule to check for the usage of var.
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        VariableDeclaration: function(node) {
            if (node.kind === "var") {
                context.report(node, "Unexpected var, use let or const instead.");
            }
        }

    };

};

module.exports.schema = [];
