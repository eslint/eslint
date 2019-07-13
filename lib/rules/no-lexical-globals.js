/**
 * @fileoverview Rule to disallow const, let and class declarations in the global scope
 * @author Milos Djermanovic
 */

"use strict";

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow `const`, `let` and `class` declarations in the global scope",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-lexical-globals"
        },

        schema: [],

        messages: {
            unexpected: "Unexpected '{{kind}}' in the global scope, wrap for a local variable, assign to a global property or use var for a global variable."
        }
    },

    create(context) {
        return {
            Program() {
                const scope = context.getScope();

                scope.variables.forEach(variable => {
                    variable.defs.forEach(def => {
                        if (def.type === "ClassName" ||
                                (def.type === "Variable" && (def.parent.kind === "let" || def.parent.kind === "const"))) {
                            context.report({
                                node: def.node,
                                messageId: "unexpected",
                                data: {
                                    kind: def.type === "ClassName" ? "class" : def.parent.kind
                                }
                            });
                        }
                    });
                });
            }
        };
    }
};
