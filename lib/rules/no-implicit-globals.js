/**
 * @fileoverview Rule to check for implicit global variables and functions.
 * @author Joshua Peek
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow variable and `function` declarations in the global scope",
            category: "Best Practices",
            recommended: false
        },

        schema: []
    },

    create(context) {
        return {
            Program() {
                const scope = context.getScope();

                scope.variables.forEach(function(variable) {
                    if (variable.writeable) {
                        return;
                    }

                    variable.defs.forEach(function(def) {
                        if (def.type === "FunctionName" || (def.type === "Variable" && def.parent.kind === "var")) {
                            context.report(def.node, "Implicit global variable, assign as global property instead.");
                        }
                    });
                });

                scope.implicit.variables.forEach(function(variable) {
                    const scopeVariable = scope.set.get(variable.name);

                    if (scopeVariable && scopeVariable.writeable) {
                        return;
                    }

                    variable.defs.forEach(function(def) {
                        context.report(def.node, "Implicit global variable, assign as global property instead.");
                    });
                });
            }
        };

    }
};
