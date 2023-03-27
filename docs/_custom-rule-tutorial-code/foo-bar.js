"use strict";

// The foo-bar rule definition
module.exports = {
    meta: {
        type: "fix",
        docs: {
            description: "Can only assign 'bar' to `const foo`.",
        },
         fixable: "code"
    },
    create: function (context) {
        return {
            // Performs action in the function on every variable declaration
            "VariableDeclaration": function(node) {
                // Check if a `const` variable declaration
                if(node.kind === "const") {
                    // Check if variable name is `foo`
                    if(node.declarations[0].id.name === "foo") {
                        // Check if value of variable is "bar"
                        if (node.declarations[0].init.value !== "bar") {
                            // Report error to ESLint. Error message uses
                            // a message placeholder to include the incorrect value
                            // in the error message.
                            // Also includes a `fix(fixer)` function that replaces
                            // any values assigned to `const foo` with "bar".
                            context.report({
                                node,
                                message: 'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}',
                                data: {
                                    notBar: node.declarations[0].init.value
                                },
                                fix(fixer) {
                                    return fixer.replaceText(node.declarations[0].init, '"bar"');
                                }
                            });
                        }
                    }
                }
            }
        };
    }
};