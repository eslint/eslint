/**
 * @fileoverview Rule to check for the usage of var.
 * @author Jamund Ferguson
 * @copyright 2014 Jamund Ferguson. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    if (!context.ecmaFeatures.blockBindings) {
        return {}; // noop when rule is used in wrong environment
    }

    return {
        "VariableDeclaration": function(node) {
            if (node.kind === "var") {
                context.report(node, "Unexpected var, use let or const instead.");
            }
        }

    };

};

module.exports.schema = [];
