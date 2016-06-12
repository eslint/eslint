/**
 * @fileoverview Rule to disallow assignments to readonly global variables
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow assignments to readonly global variables.",
            category: "Variables",
            recommended: false
        },
        schema: []
    },

    create: function(context) {
        return {
            "Program:exit": function() {
                var globalScope = context.getScope();
                var variables = globalScope.variables;

                for (var i = 0; i < variables.length; ++i) {
                    var variable = variables[i];

                    // Skip if it's not readonly.
                    if (variable.writeable !== false) {
                        continue;
                    }

                    // Warn every write reference.
                    for (var j = 0; j < variable.references.length; ++j) {
                        var reference = variable.references[j];
                        var node = reference.identifier;

                        if (reference.isWrite()) {
                            context.report({
                                node: node,
                                data: node,
                                message: "Unexpected modifying of '{{name}}'. It's readonly."
                            });
                        }
                    }
                }
            }
        };
    }
};
