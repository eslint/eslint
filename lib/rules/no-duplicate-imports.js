/**
 * @fileoverview Restrict usage of duplicate imports.
 * @author Simen Bekkhus
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const EXPORT_ALL_DECLARATION = 'ExportAllDeclaration'
const IMPORT_NAME_SPACE_SPECIFIER = 'ImportNamespaceSpecifier';
const IMPORT_SPECIFIER = 'ImportSpecifier';
const CONTRADICTORY_IMPORT_TYPES = [
    IMPORT_NAME_SPACE_SPECIFIER,
    IMPORT_SPECIFIER,
];

/**
 * Return the type of import.
 * @param {ASTNode} node A node to get.
 * @returns {string} the type of the import.
 */
function getImportType(node) {
    if (
        node &&
        node.specifiers &&
        node.specifiers[0] &&
        node.specifiers[0].type
    ) {
        const index = node.specifiers.findIndex((specifier) =>
            CONTRADICTORY_IMPORT_TYPES.includes(
                specifier.type
            )
        );
        if (index > -1) {
            return node.specifiers[index].type;
        } else {
            return node.specifiers[0].type;
        }
    } else if (node && node.type) {
        return node.type;
    }
    return "";
}

/**
 * Returns the name of the module imported or re-exported.
 * @param {ASTNode} node A node to get.
 * @returns {string} the name of the module, or empty string if no name.
 */
function getValue(node) {
    if (node && node.source && node.source.value) {
        return node.source.value.trim();
    }

    return "";
}


/**
 * Returns a boolean if we should report contradictory import type.
 * @param {string[]} importTypes An array contain import types of a module.
 * @param {string} importType An contradictory import type to check if we should report it or not.
 * @returns {boolean} true if the contradictory import type should be reported.
 */
function shouldReportContradictoryImportType(importTypes, importType) {
    if (importTypes.indexOf(importType) > -1) {
        return true;
    } else {
        return (
            importTypes.findIndex((importTypeItem) => {
                return CONTRADICTORY_IMPORT_TYPES.includes(importTypeItem);
            }) === -1
        );
    }
}

/**
 * Checks if the name of the import or export exists in the given array, and reports if so.
 * @param {RuleContext} context The ESLint rule context object.
 * @param {ASTNode} node A node to get.
 * @param {string} value The name of the imported or exported module.
 * @param {string[]} array The array containing other imports or exports in the file.
 * @param {string} messageId A messageId to be reported after the name of the module
 * @param {{}} modulesWithImportTypes The object containing the name of unique modules with their first import type [specificImport, nameSpaceImport].
 * @param {string} type the name of import type.
 * @param {string[]} ExportAllDeclarationsInFile The array containing ExportAllDeclarations in the file.
 *
 * @returns {void} No return value
 */
function checkAndReport(
    context,
    node,
    value,
    array,
    messageId,
    modulesWithImportTypes,
    type,
    ExportAllDeclarationsInFile
) {
    let isDuplicate = false;
    if (type === EXPORT_ALL_DECLARATION) {
        if (ExportAllDeclarationsInFile.indexOf(value) !== -1) {
            isDuplicate = true;
        }
    } else if (array.indexOf(value) !== -1) {
        isDuplicate = true;
        if (CONTRADICTORY_IMPORT_TYPES.includes(type)) {
            isDuplicate = shouldReportContradictoryImportType(
                modulesWithImportTypes[value],
                type
            );
        }
    }
    if (isDuplicate) {
        context.report({
            node,
            messageId,
            data: {
                module: value,
            },
        });
    }
}

/**
 * @callback nodeCallback
 * @param {ASTNode} node A node to handle.
 */

/**
 * Returns a function handling the imports of a given file
 * @param {RuleContext} context The ESLint rule context object.
 * @param {boolean} includeExports Whether or not to check for exports in addition to imports.
 * @param {string[]} importsInFile The array containing other imports in the file.
 * @param {string[]} exportsInFile The array containing other exports in the file.
 * @param {{}} modulesWithImportTypes The object containing the name of unique modules with their first import type [specificImport, nameSpaceImport].
 * @param {string[]} ExportAllDeclarationsInFile The array containing ExportAllDeclarations in the file.
 *
 * @returns {nodeCallback} A function passed to ESLint to handle the statement.
 */
function handleImports(
    context,
    includeExports,
    importsInFile,
    exportsInFile,
    modulesWithImportTypes,
    ExportAllDeclarationsInFile
) {
    return function (node) {
        const value = getValue(node);
        const type = getImportType(node);

        if (value) {
            checkAndReport(
                context,
                node,
                value,
                importsInFile,
                "import",
                modulesWithImportTypes,
                type,
                ExportAllDeclarationsInFile
            );

            if (includeExports) {
                checkAndReport(
                    context,
                    node,
                    value,
                    exportsInFile,
                    "importAs",
                    modulesWithImportTypes,
                    type,
                    ExportAllDeclarationsInFile
                );
            }
            importsInFile.push(value);
            if (modulesWithImportTypes[value]) {
                modulesWithImportTypes[value] = modulesWithImportTypes[
                    value
                ].concat(type);
            } else {
                modulesWithImportTypes[value] = [type];
            }
        }
    };
}

/**
 * Returns a function handling the exports of a given file
 * @param {RuleContext} context The ESLint rule context object.
 * @param {string[]} importsInFile The array containing other imports in the file.
 * @param {string[]} exportsInFile The array containing other exports in the file.
 * @param {{}} modulesWithImportTypes The object containing the name of unique modules with their first import type [specificImport, nameSpaceImport].
 * @param {string[]} ExportAllDeclarationsInFile The array containing ExportAllDeclarations in the file.
 *
 * @returns {nodeCallback} A function passed to ESLint to handle the statement.
 */
function handleExports(
    context,
    importsInFile,
    exportsInFile,
    modulesWithImportTypes,
    ExportAllDeclarationsInFile
) {
    return function (node) {
        const value = getValue(node);
        const type = getImportType(node);
        if (value) {
            checkAndReport(
                context,
                node,
                value,
                exportsInFile,
                "export",
                modulesWithImportTypes,
                type,
                ExportAllDeclarationsInFile
            );
            if (type === EXPORT_ALL_DECLARATION) {
                ExportAllDeclarationsInFile.push(value);
            } else {
                checkAndReport(
                    context,
                    node,
                    value,
                    importsInFile,
                    "exportAs",
                    modulesWithImportTypes,
                    type,
                    ExportAllDeclarationsInFile
                );
                exportsInFile.push(value);
            }
        }
    };
}

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow duplicate module imports",
            category: "ECMAScript 6",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-duplicate-imports",
        },

        schema: [
            {
                type: "object",
                properties: {
                    includeExports: {
                        type: "boolean",
                        default: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            import: "'{{module}}' import is duplicated.",
            importAs: "'{{module}}' import is duplicated as export.",
            export: "'{{module}}' export is duplicated.",
            exportAs: "'{{module}}' export is duplicated as import.",
        },
    },

    create(context) {
        const includeExports = (context.options[0] || {}).includeExports,
            importsInFile = [],
            modulesWithImportTypes = {},
            exportsInFile = [],
            ExportAllDeclarationsInFile = [];
        const handlers = {
            ImportDeclaration: handleImports(
                context,
                includeExports,
                importsInFile,
                exportsInFile,
                modulesWithImportTypes,
                ExportAllDeclarationsInFile
            ),
        };

        if (includeExports) {
            handlers.ExportNamedDeclaration = handleExports(
                context,
                importsInFile,
                exportsInFile,
                modulesWithImportTypes,
                ExportAllDeclarationsInFile
            );
            handlers.ExportAllDeclaration = handleExports(
                context,
                importsInFile,
                exportsInFile,
                modulesWithImportTypes,
                ExportAllDeclarationsInFile
            );
        }
        return handlers;
    },
};
