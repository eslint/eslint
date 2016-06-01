/**
 * @fileoverview Disallow renaming import, export, and destructured assignments to the same name.
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow renaming import, export, and destructured assignments to the same name",
            category: "ECMAScript 6",
            recommended: false
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    ignoreDestructuring: { type: "boolean" },
                    ignoreImport: { type: "boolean" },
                    ignoreExport: { type: "boolean" }
                },
                additionalProperties: false
            }
        ]
    },

    create: function(context) {
        var options = context.options[0] || {},
            ignoreDestructuring = options.ignoreDestructuring === true,
            ignoreImport = options.ignoreImport === true,
            ignoreExport = options.ignoreExport === true;

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Reports error for unnecessarily renamed assignments
         * @param {ASTNode} node - node to report
         * @param {ASTNode} initial - node with initial name value
         * @param {ASTNode} result - node with new name value
         * @param {string} type - the type of the offending node
         * @returns {void}
         */
        function reportError(node, initial, result, type) {
            var name = initial.type === "Identifier" ? initial.name : initial.value;

            return context.report({
                node: node,
                message: "{{type}} {{name}} unnecessarily renamed.",
                data: {
                    name: name,
                    type: type
                },
                fix: function(fixer) {
                    return fixer.replaceTextRange([
                        initial.range[0],
                        result.range[1]
                    ], name);
                }
            });
        }

        /**
         * Checks whether a destructured assignment is unnecessarily renamed
         * @param {ASTNode} node - node to check
         * @returns {void}
         */
        function checkDestructured(node) {
            var properties,
                i;

            if (ignoreDestructuring) {
                return;
            }

            properties = node.properties;

            for (i = 0; i < properties.length; i++) {
                if (properties[i].shorthand) {
                    return;
                }

                /**
                 * If an ObjectPattern property is computed, we have no idea
                 * if a rename is useless or not. If an ObjectPattern property
                 * lacks a key, it is likely an ExperimentalRestProperty and
                 * so there is no "renaming" occurring here.
                 */
                if (properties[i].computed || !properties[i].key) {
                    return;
                }

                if (properties[i].key.type === "Identifier" && properties[i].key.name === properties[i].value.name ||
                        properties[i].key.type === "Literal" && properties[i].key.value === properties[i].value.name) {
                    reportError(properties[i], properties[i].key, properties[i].value, "Destructuring assignment");
                }
            }
        }

        /**
         * Checks whether an import is unnecessarily renamed
         * @param {ASTNode} node - node to check
         * @returns {void}
         */
        function checkImport(node) {
            if (ignoreImport) {
                return;
            }

            if (node.imported.name === node.local.name &&
                    node.imported.range[0] !== node.local.range[0]) {
                reportError(node, node.imported, node.local, "Import");
            }
        }

        /**
         * Checks whether an export is unnecessarily renamed
         * @param {ASTNode} node - node to check
         * @returns {void}
         */
        function checkExport(node) {
            if (ignoreExport) {
                return;
            }

            if (node.local.name === node.exported.name &&
                    node.local.range[0] !== node.exported.range[0]) {
                reportError(node, node.local, node.exported, "Export");
            }

        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            ObjectPattern: checkDestructured,
            ImportSpecifier: checkImport,
            ExportSpecifier: checkExport
        };
    }
};
