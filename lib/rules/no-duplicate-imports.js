/**
 * @fileoverview Restrict usage of duplicate imports.
 * @author Simen Bekkhus
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Returns the name of the module imported or re-exported.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string} the name of the module, or empty string if no name.
 */
function getValue(node) {
    if (node && node.source && node.source.value) {
        return node.source.value.trim();
    }

    return "";
}

/**
 * Returns the optional importKind of the module imported or re-exported.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string} the importKind of the module, or "value" if no importKind.
 */
function getImportKind(node) {
    if (node && node.importKind) {
        return node.importKind.trim();
    }

    return "value";
}

/**
 * Returns the optional exportKind of the module imported or re-exported.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string} the exportKind of the module, or "value" if no exportKind.
 */
function getExportKind(node) {
    if (node && node.exportKind) {
        return node.exportKind.trim();
    }

    return "value";
}

/**
 * Checks if the name of the import or export exists in the given array, and reports if so.
 *
 * @param {RuleContext} context - The ESLint rule context object.
 * @param {ASTNode} node - A node to get.
 * @param {string} value - The name of the imported or exported module.
 * @param {string} kind - the kind of the imported or exported module (value|type)
 * @param {string[]} array - The array containing other imports or exports in the file.
 * @param {string} message - A message to be reported after the name of the module
 *
 * @returns {void} No return value
 */
function checkAndReport(context, node, value, kind, array, message) {
    if (array.some(obj => obj.value === value && obj.kind === kind)) {
        context.report({
            node,
            message: "'{{module}}' {{message}}",
            data: {
                module: value,
                message
            }
        });
    }
}

/**
 * @callback nodeCallback
 * @param {ASTNode} node - A node to handle.
 */

/**
 * Returns a function handling the imports of a given file
 *
 * @param {RuleContext} context - The ESLint rule context object.
 * @param {boolean} includeExports - Whether or not to check for exports in addition to imports.
 * @param {string[]} importsInFile - The array containing other imports in the file.
 * @param {string[]} exportsInFile - The array containing other exports in the file.
 *
 * @returns {nodeCallback} A function passed to ESLint to handle the statement.
 */
function handleImports(context, includeExports, importsInFile, exportsInFile) {
    return function(node) {
        const value = getValue(node);
        const kind = getImportKind(node);

        if (value) {
            checkAndReport(context, node, value, kind, importsInFile, "import is duplicated.");

            if (includeExports) {
                checkAndReport(context, node, value, kind, exportsInFile, "import is duplicated as export.");
            }

            importsInFile.push({ value, kind });
        }
    };
}

/**
 * Returns a function handling the exports of a given file
 *
 * @param {RuleContext} context - The ESLint rule context object.
 * @param {string[]} importsInFile - The array containing other imports in the file.
 * @param {string[]} exportsInFile - The array containing other exports in the file.
 *
 * @returns {nodeCallback} A function passed to ESLint to handle the statement.
 */
function handleExports(context, importsInFile, exportsInFile) {
    return function(node) {
        const value = getValue(node);
        const kind = getExportKind(node);

        if (value) {
            checkAndReport(context, node, value, kind, exportsInFile, "export is duplicated.");
            checkAndReport(context, node, value, kind, importsInFile, "export is duplicated as import.");

            exportsInFile.push({ value, kind });
        }
    };
}

module.exports = {
    meta: {
        docs: {
            description: "disallow duplicate module imports",
            category: "ECMAScript 6",
            recommended: false
        },

        schema: [{
            type: "object",
            properties: {
                includeExports: {
                    type: "boolean"
                }
            },
            additionalProperties: false
        }]
    },

    create(context) {
        const includeExports = (context.options[0] || {}).includeExports,
            importsInFile = [],
            exportsInFile = [];

        const handlers = {
            ImportDeclaration: handleImports(context, includeExports, importsInFile, exportsInFile)
        };

        if (includeExports) {
            handlers.ExportNamedDeclaration = handleExports(context, importsInFile, exportsInFile);
            handlers.ExportAllDeclaration = handleExports(context, importsInFile, exportsInFile);
        }

        return handlers;
    }
};
