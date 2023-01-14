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
            properties: {
                restrictedNamedExports: {
                    type: "array",
                    items: {
                        type: "string"
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

                        // Allow/Disallow `export { foo as default };` format
                        named: {
                            type: "boolean"
                        },

                        //  Allow/Disallow `export { default } from "mod"; export { default as default } from "mod";` format
                        defaultFrom: {
                            type: "boolean"
                        },

                        //  Allow/Disallow `export { foo as default } from "mod";` format
                        namedFrom: {
                            type: "boolean"
                        },

                        //  Allow/Disallow `export * as default from "mod"`; format
                        namespaceFrom: {
                            type: "boolean"
                        }
                    }
                }
            },
            additionalProperties: false
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
                const isDefaultFromFormat = node.parent.parent.source;

                if (!isDefaultFromFormat && restrictDefaultExports && restrictDefaultExports.named) {
                    context.report({
                        node,
                        messageId: "restrictedDefault"
                    });
                    return;
                }

                if (isDefaultFromFormat && restrictDefaultExports && restrictDefaultExports.defaultFrom) {
                    context.report({
                        node,
                        messageId: "restrictedDefault"
                    });
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
