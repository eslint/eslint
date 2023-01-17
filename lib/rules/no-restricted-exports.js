/**
 * @fileoverview Rule to disallow specified names in exports
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow specified names in exports",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-restricted-exports"
        },

        schema: [{
            type: "object",
            anyOf: [
                {
                    properties: {
                        restrictedNamedExports: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            uniqueItems: true
                        }
                    },
                    additionalProperties: false
                },
                {
                    properties: {
                        restrictedNamedExports: {
                            type: "array",
                            items: {
                                type: "string",
                                pattern: "^(?!default$)"
                            },
                            uniqueItems: true
                        },
                        restrictDefaultExports: {
                            type: "object",
                            properties: {

                                // Allow/Disallow `export default foo; export default 42; export default function foo() {}` format
                                direct: {
                                    type: "boolean"
                                },

                                // Allow/Disallow `export { foo as default };` declarations
                                named: {
                                    type: "boolean"
                                },

                                //  Allow/Disallow `export { default } from "mod"; export { default as default } from "mod";` declarations
                                defaultFrom: {
                                    type: "boolean"
                                },

                                //  Allow/Disallow `export { foo as default } from "mod";` declarations
                                namedFrom: {
                                    type: "boolean"
                                },

                                //  Allow/Disallow `export * as default from "mod"`; declarations
                                namespaceFrom: {
                                    type: "boolean"
                                }
                            },
                            additionalProperties: false
                        }
                    },
                    additionalProperties: false
                }
            ]
        }],

        messages: {
            restrictedNamed: "'{{name}}' is restricted from being used as an exported name.",
            restrictedDefault: "Exporting the 'default' value is restricted."
        }
    },

    create(context) {

        const restrictedNames = new Set(context.options[0] && context.options[0].restrictedNamedExports);
        const restrictDefaultExports = context.options[0] && !restrictedNames.has("default") && context.options[0].restrictDefaultExports;

        /**
         * Checks and reports given exported name.
         * @param {ASTNode} node exported `Identifier` or string `Literal` node to check.
         * @returns {void}
         */
        function checkExportedName(node) {
            const name = astUtils.getModuleExportName(node);

            if (restrictedNames.has(name)) {
                context.report({
                    node,
                    messageId: "restrictedNamed",
                    data: { name }
                });
                return;
            }

            if (name === "default") {
                const isSourceSpecified = node.parent.source || node.parent.parent.source;
                const specifierLocalName = node.parent.local && node.parent.local.name;

                if (!isSourceSpecified && restrictDefaultExports && restrictDefaultExports.named) {
                    context.report({
                        node,
                        messageId: "restrictedDefault"
                    });
                    return;
                }

                if (isSourceSpecified && restrictDefaultExports) {
                    if (
                        (specifierLocalName === "default" && restrictDefaultExports.defaultFrom) ||
                        (specifierLocalName !== "default" && restrictDefaultExports.namedFrom) ||
                        (node.parent.type === "ExportAllDeclaration" && restrictDefaultExports.namespaceFrom)
                    ) {
                        context.report({
                            node,
                            messageId: "restrictedDefault"
                        });
                    }
                }
            }
        }

        return {
            ExportAllDeclaration(node) {
                if (node.exported) {
                    checkExportedName(node.exported);
                }
            },

            ExportDefaultDeclaration(node) {
                if (restrictDefaultExports && restrictDefaultExports.direct) {
                    context.report({
                        node,
                        messageId: "restrictedDefault"
                    });
                }
            },

            ExportNamedDeclaration(node) {
                const declaration = node.declaration;

                if (declaration) {
                    if (declaration.type === "FunctionDeclaration" || declaration.type === "ClassDeclaration") {
                        checkExportedName(declaration.id);
                    } else if (declaration.type === "VariableDeclaration") {
                        context.getDeclaredVariables(declaration)
                            .map(v => v.defs.find(d => d.parent === declaration))
                            .map(d => d.name) // Identifier nodes
                            .forEach(checkExportedName);
                    }
                } else {
                    node.specifiers
                        .map(s => s.exported)
                        .forEach(checkExportedName);
                }
            }
        };
    }
};
