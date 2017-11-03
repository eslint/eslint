/**
 * @fileoverview Restrict usage of specified node imports.
 * @author Guy Ellis
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const DEFAULT_MESSAGE_TEMPLATE = "'{{importSource}}' import is restricted from being used.";
const CUSTOM_MESSAGE_TEMPLATE = "'{{importSource}}' import is restricted from being used. {{customMessage}}";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ignore = require("ignore");

const arrayOfStrings = {
    type: "array",
    items: { type: "string" },
    uniqueItems: true
};

const arrayOfStringsOrObjects = {
    type: "array",
    items: {
        anyOf: [
            { type: "string" },
            {
                type: "object",
                properties: {
                    name: { type: "string" },
                    message: {
                        type: "string",
                        minLength: 1
                    },
                    importNames: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                additionalProperties: false,
                required: ["name"]
            }
        ]
    },
    uniqueItems: true
};

module.exports = {
    meta: {
        docs: {
            description: "disallow specified modules when loaded by `import`",
            category: "ECMAScript 6",
            recommended: false
        },

        schema: {
            anyOf: [
                arrayOfStringsOrObjects,
                {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            paths: arrayOfStringsOrObjects,
                            patterns: arrayOfStrings
                        },
                        additionalProperties: false
                    },
                    additionalItems: false
                }
            ]
        }
    },

    create(context) {
        const options = Array.isArray(context.options) ? context.options : [];
        const isPathAndPatternsObject =
            typeof options[0] === "object" &&
            (options[0].hasOwnProperty("paths") || options[0].hasOwnProperty("patterns"));

        const restrictedPaths = (isPathAndPatternsObject ? options[0].paths : context.options) || [];
        const restrictedPatterns = (isPathAndPatternsObject ? options[0].patterns : []) || [];

        const restrictedPathMessages = restrictedPaths.reduce((memo, importSource) => {
            if (typeof importSource === "string") {
                memo[importSource] = { message: null };
            } else {
                memo[importSource.name] = {
                    message: importSource.message,
                    importNames: importSource.importNames
                };
            }
            return memo;
        }, {});

        // if no imports are restricted we don"t need to check
        if (Object.keys(restrictedPaths).length === 0 && restrictedPatterns.length === 0) {
            return {};
        }

        const restrictedPatternsMatcher = ignore().add(restrictedPatterns);

        /**
         * Checks to see if '*' is being used to import everything.
         * @param {[string]} importNames - array of import names that are being imported
         * @returns {boolean} whether everything is imported or not
         */
        function isEverythingImported(importNames) {
            return importNames && importNames.indexOf("*") > -1;
        }

        /**
         * Report a restricted path.
         * @param {node} node representing the restricted path reference
         * @returns {void}
         * @private
         */
        function reportPath(node) {
            const importSource = node.source.value.trim();
            const customMessage = restrictedPathMessages[importSource] && restrictedPathMessages[importSource].message;
            const message = customMessage
                ? CUSTOM_MESSAGE_TEMPLATE
                : DEFAULT_MESSAGE_TEMPLATE;

            context.report({
                node,
                message,
                data: {
                    importSource,
                    customMessage
                }
            });
        }

        /**
         * Report a restricted path specifically for patterns.
         * @param {node} node - representing the restricted path reference
         * @returns {void}
         * @private
         */
        function reportPathForPatterns(node) {
            const importSource = node.source.value.trim();

            context.report({
                node,
                message: "'{{importSource}}' import is restricted from being used by a pattern.",
                data: {
                    importSource
                }
            });
        }

        /**
         * Report a restricted path specifically for patterns.
         * @param {string} importSource - path of the import
         * @param {node} node - representing the restricted path reference
         * @returns {void}
         * @private
         */
        function reportPathForEverythingImported(importSource, node) {
            const importNames = restrictedPathMessages[importSource].importNames;

            context.report({
                node,
                message: "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted.",
                data: {
                    importSource,
                    importNames
                }
            });
        }

        /**
         * Check if the given importSource is a restricted because '*' is being imported.
         * @param {string} importSource - path of the import
         * @param {[string]} importNames - array of import names that are being imported
         * @returns {boolean} whether the path is restricted
         * @private
         */
        function isRestrictedForEverythingImported(importSource, importNames) {
            return Object.prototype.hasOwnProperty.call(restrictedPathMessages, importSource) &&
                restrictedPathMessages[importSource].importNames &&
                isEverythingImported(importNames);
        }

        /**
         * Check if the given importNames are restricted given a list of restrictedImportNames.
         * @param {[string]} importNames - array of import names that are being imported
         * @param {[string]} restrictedImportNames - array of import names that are restricted for this import
         * @returns {boolean} whether the objectName is restricted
         * @private
         */
        function isRestrictedObject(importNames, restrictedImportNames) {
            const restrictedObjectMatches = restrictedImportNames.reduce((accumulator, restrictedObjectName) => {
                if (importNames.indexOf(restrictedObjectName) > -1) {
                    accumulator.push(restrictedObjectName);
                }
                return accumulator;
            }, []);

            return restrictedObjectMatches.length > 0;
        }

        /**
         * Check if the given importSource is a restricted path.
         * @param {string} importSource - path of the import
         * @param {[string]} [importNames] - array of import names that are being imported
         * @returns {boolean} whether the variable is a restricted path or not
         * @private
         */
        function isRestrictedPath(importSource, importNames) {
            let isRestricted = false;

            if (Object.prototype.hasOwnProperty.call(restrictedPathMessages, importSource)) {
                if (restrictedPathMessages[importSource].importNames) {
                    isRestricted = isRestrictedObject(importNames, restrictedPathMessages[importSource].importNames);
                } else {
                    isRestricted = true;
                }
            }

            return isRestricted;
        }

        /**
         * Check if the given importSource is restricted by a pattern.
         * @param {string} importSource - path of the import
         * @returns {boolean} whether the variable is a restricted pattern or not
         * @private
         */
        function isRestrictedPattern(importSource) {
            return restrictedPatterns.length > 0 && restrictedPatternsMatcher.ignores(importSource);
        }

        return {
            ImportDeclaration(node) {

                if (node && node.source && node.source.value) {
                    const importSource = node.source.value.trim();
                    const importNames = node.specifiers.map(specifier => {
                        if (specifier && specifier.type === "ImportDefaultSpecifier") {
                            return "default";
                        }
                        if (specifier && specifier.type === "ImportNamespaceSpecifier") {
                            return "*";
                        }
                        return (specifier.imported && specifier.imported.name) ||
                               (specifier.local && specifier.local.name) || null;
                    });

                    if (isRestrictedForEverythingImported(importSource, importNames)) {
                        reportPathForEverythingImported(importSource, node);
                    }

                    if (isRestrictedPath(importSource, importNames)) {
                        reportPath(node);
                    }
                    if (isRestrictedPattern(importSource)) {
                        reportPathForPatterns(node);
                    }
                }
            }
        };
    }
};
