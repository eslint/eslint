/**
 * @fileoverview Restrict usage of specified node imports.
 * @author Guy Ellis
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const DEFAULT_MESSAGE_TEMPLATE = "'{{importName}}' import is restricted from being used.";
const CUSTOM_MESSAGE_TEMPLATE = "'{{importName}}' import is restricted from being used. {{customMessage}}";

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
                    objectNames: {
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

        const restrictedPathMessages = restrictedPaths.reduce((memo, importName) => {
            if (typeof importName === "string") {
                memo[importName] = { message: null };
            } else {
                memo[importName.name] = {
                    message: importName.message,
                    objectNames: importName.objectNames
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
         * @param {node} node representing the restricted path reference
         * @returns {boolean} whether everything is imported or not
         */
        function isEverythingImported(node) {
            return !!(node && node.parent && node.parent.tokens && node.parent.tokens.find(token => token.value === "*"));
        }

        /**
         * Report a restricted path.
         * @param {node} node representing the restricted path reference
         * @returns {void}
         * @private
         */
        function reportPath(node) {
            const importName = node.source.value.trim();
            const customMessage = restrictedPathMessages[importName] && restrictedPathMessages[importName].message;
            const message = customMessage
                ? CUSTOM_MESSAGE_TEMPLATE
                : DEFAULT_MESSAGE_TEMPLATE;

            context.report({
                node,
                message,
                data: {
                    importName,
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
            const importName = node.source.value.trim();

            context.report({
                node,
                message: "'{{importName}}' import is restricted from being used by a pattern.",
                data: {
                    importName
                }
            });
        }

        /**
         * Report a restricted path specifically for patterns.
         * @param {string} name - path of the import
         * @param {node} node - representing the restricted path reference
         * @returns {void}
         * @private
         */
        function reportPathForEverythingImported(name, node) {
            const importName = node.source.value.trim();
            const importObjects = restrictedPathMessages[name].objectNames;

            context.report({
                node,
                message: "* import is invalid because '{{importObjects}}' from '{{importName}}' is restricted.",
                data: {
                    importName,
                    importObjects
                }
            });
        }

        /**
         * Check if the given name is a restricted because '*' is being imported.
         * @param {string} name - path of the import
         * @param {node} node - representing the restricted path reference
         * @returns {boolean} whether the path is restricted
         * @private
         */
        function isRestrictedForEverythingImported(name, node) {
            return Object.prototype.hasOwnProperty.call(restrictedPathMessages, name) &&
                restrictedPathMessages[name].objectNames &&
                isEverythingImported(node);
        }

        /**
         * Check if the given objectName is restricted given a list of restrictedObjectNames.
         * @param {[string]} objectNames - array of object names that are being imported
         * @param {[string]} restrictedObjectNames - array of object names that are restricted for this import
         * @returns {boolean} whether the objectName is restricted
         * @private
         */
        function isRestrictedObject(objectNames, restrictedObjectNames) {
            const restrictedObjectMatches = restrictedObjectNames.reduce((accumulator, restrictedObjectName) => {
                if (objectNames.indexOf(restrictedObjectName) > -1) {
                    accumulator.push(restrictedObjectName);
                }
                return accumulator;
            }, []);

            return restrictedObjectMatches.length > 0;
        }

        /**
         * Check if the given name is a restricted path name.
         * @param {string} name - path of the import
         * @param {[string]} [objectNames] - array of object names that are being imported
         * @returns {boolean} whether the variable is a restricted path or not
         * @private
         */
        function isRestrictedPath(name, objectNames) {
            let isRestricted = false;

            if (Object.prototype.hasOwnProperty.call(restrictedPathMessages, name)) {
                if (restrictedPathMessages[name].objectNames) {
                    isRestricted = isRestrictedObject(objectNames, restrictedPathMessages[name].objectNames);
                } else {
                    isRestricted = true;
                }
            }

            return isRestricted;
        }

        /**
         * Check if the given name is a restricted path name.
         * @param {string} name - path of the import
         * @returns {boolean} whether the variable is a restricted pattern or not
         * @private
         */
        function isRestrictedPattern(name) {
            return restrictedPatterns.length > 0 && restrictedPatternsMatcher.ignores(name);
        }

        return {
            ImportDeclaration(node) {

                if (node && node.source && node.source.value) {
                    const importName = node.source.value.trim();
                    const importObjectNames = node.specifiers.map(specifier => {
                        if (specifier && specifier.type === "ImportDefaultSpecifier") {
                            return "default";
                        }
                        return (specifier && specifier.imported && specifier.imported.name) ||
                               (specifier && specifier.local && specifier.local.name) || null;
                    });

                    if (isRestrictedForEverythingImported(importName, node)) {
                        reportPathForEverythingImported(importName, node);
                    }

                    if (isRestrictedPath(importName, importObjectNames)) {
                        reportPath(node);
                    }
                    if (isRestrictedPattern(importName)) {
                        reportPathForPatterns(node);
                    }
                }
            }
        };
    }
};
