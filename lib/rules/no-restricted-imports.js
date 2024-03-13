/**
 * @fileoverview Restrict usage of specified node imports.
 * @author Guy Ellis
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ignore = require("ignore");

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
                    },
                    allowImportNames: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                additionalProperties: false,
                required: ["name"],
                not: { required: ["importNames", "allowImportNames"] }
            }
        ]
    },
    uniqueItems: true
};

const arrayOfStringsOrObjectPatterns = {
    anyOf: [
        {
            type: "array",
            items: {
                type: "string"
            },
            uniqueItems: true
        },
        {
            type: "array",
            items: {
                type: "object",
                properties: {
                    importNames: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        minItems: 1,
                        uniqueItems: true
                    },
                    allowImportNames: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        minItems: 1,
                        uniqueItems: true
                    },
                    group: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        minItems: 1,
                        uniqueItems: true
                    },
                    importNamePattern: {
                        type: "string"
                    },
                    allowImportNamePattern: {
                        type: "string"
                    },
                    message: {
                        type: "string",
                        minLength: 1
                    },
                    caseSensitive: {
                        type: "boolean"
                    }
                },
                additionalProperties: false,
                required: ["group"],
                not: {
                    anyOf: [
                        { required: ["importNames", "allowImportNames"] },
                        { required: ["importNamePattern", "allowImportNamePattern"] },
                        { required: ["importNames", "allowImportNamePattern"] },
                        { required: ["importNamePattern", "allowImportNames"] },
                        { required: ["allowImportNames", "allowImportNamePattern"] }
                    ]
                }
            },
            uniqueItems: true
        }
    ]
};

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow specified modules when loaded by `import`",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/no-restricted-imports"
        },

        messages: {
            path: "'{{importSource}}' import is restricted from being used.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            pathWithCustomMessage: "'{{importSource}}' import is restricted from being used. {{customMessage}}",

            patterns: "'{{importSource}}' import is restricted from being used by a pattern.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            patternWithCustomMessage: "'{{importSource}}' import is restricted from being used by a pattern. {{customMessage}}",

            patternAndImportName: "'{{importName}}' import from '{{importSource}}' is restricted from being used by a pattern.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            patternAndImportNameWithCustomMessage: "'{{importName}}' import from '{{importSource}}' is restricted from being used by a pattern. {{customMessage}}",

            patternAndEverything: "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted from being used by a pattern.",

            patternAndEverythingWithRegexImportName: "* import is invalid because import name matching '{{importNames}}' pattern from '{{importSource}}' is restricted from being used.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            patternAndEverythingWithCustomMessage: "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted from being used by a pattern. {{customMessage}}",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            patternAndEverythingWithRegexImportNameAndCustomMessage: "* import is invalid because import name matching '{{importNames}}' pattern from '{{importSource}}' is restricted from being used. {{customMessage}}",

            everything: "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            everythingWithCustomMessage: "* import is invalid because '{{importNames}}' from '{{importSource}}' is restricted. {{customMessage}}",

            importName: "'{{importName}}' import from '{{importSource}}' is restricted.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            importNameWithCustomMessage: "'{{importName}}' import from '{{importSource}}' is restricted. {{customMessage}}",

            allowedImportName: "'{{importName}}' import from '{{importSource}}' is restricted because only '{{allowedImportNames}}' import(s) is/are allowed.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            allowedImportNameWithCustomMessage: "'{{importName}}' import from '{{importSource}}' is restricted because only '{{allowedImportNames}}' import(s) is/are allowed. {{customMessage}}",

            everythingWithAllowImportNames: "* import is invalid because only '{{allowedImportNames}}' from '{{importSource}}' is/are allowed.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            everythingWithAllowImportNamesAndCustomMessage: "* import is invalid because only '{{allowedImportNames}}' from '{{importSource}}' is/are allowed. {{customMessage}}",

            allowedImportNamePattern: "'{{importName}}' import from '{{importSource}}' is restricted because only imports that match the pattern '{{allowedImportNamePattern}}' are allowed from '{{importSource}}'.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            allowedImportNamePatternWithCustomMessage: "'{{importName}}' import from '{{importSource}}' is restricted because only imports that match the pattern '{{allowedImportNamePattern}}' are allowed from '{{importSource}}'. {{customMessage}}",

            everythingWithAllowedImportNamePattern: "* import is invalid because only imports that match the pattern '{{allowedImportNamePattern}}' from '{{importSource}}' are allowed.",
            // eslint-disable-next-line eslint-plugin/report-message-format -- Custom message might not end in a period
            everythingWithAllowedImportNamePatternWithCustomMessage: "* import is invalid because only imports that match the pattern '{{allowedImportNamePattern}}' from '{{importSource}}' are allowed. {{customMessage}}"
        },

        schema: {
            anyOf: [
                arrayOfStringsOrObjects,
                {
                    type: "array",
                    items: [{
                        type: "object",
                        properties: {
                            paths: arrayOfStringsOrObjects,
                            patterns: arrayOfStringsOrObjectPatterns
                        },
                        additionalProperties: false
                    }],
                    additionalItems: false
                }
            ]
        }
    },

    create(context) {
        const sourceCode = context.sourceCode;
        const options = Array.isArray(context.options) ? context.options : [];
        const isPathAndPatternsObject =
            typeof options[0] === "object" &&
            (Object.hasOwn(options[0], "paths") || Object.hasOwn(options[0], "patterns"));

        const restrictedPaths = (isPathAndPatternsObject ? options[0].paths : context.options) || [];
        const groupedRestrictedPaths = restrictedPaths.reduce((memo, importSource) => {
            const path = typeof importSource === "string"
                ? importSource
                : importSource.name;

            if (!memo[path]) {
                memo[path] = [];
            }

            if (typeof importSource === "string") {
                memo[path].push({});
            } else {
                memo[path].push({
                    message: importSource.message,
                    importNames: importSource.importNames,
                    allowImportNames: importSource.allowImportNames
                });
            }
            return memo;
        }, Object.create(null));

        // Handle patterns too, either as strings or groups
        let restrictedPatterns = (isPathAndPatternsObject ? options[0].patterns : []) || [];

        // standardize to array of objects if we have an array of strings
        if (restrictedPatterns.length > 0 && typeof restrictedPatterns[0] === "string") {
            restrictedPatterns = [{ group: restrictedPatterns }];
        }

        // relative paths are supported for this rule
        const restrictedPatternGroups = restrictedPatterns.map(
            ({ group, message, caseSensitive, importNames, importNamePattern, allowImportNames, allowImportNamePattern }) => (
                {
                    matcher: ignore({ allowRelativePaths: true, ignorecase: !caseSensitive }).add(group),
                    customMessage: message,
                    importNames,
                    importNamePattern,
                    allowImportNames,
                    allowImportNamePattern
                }
            )
        );

        // if no imports are restricted we don't need to check
        if (Object.keys(restrictedPaths).length === 0 && restrictedPatternGroups.length === 0) {
            return {};
        }

        /**
         * Report a restricted path.
         * @param {string} importSource path of the import
         * @param {Map<string,Object[]>} importNames Map of import names that are being imported
         * @param {node} node representing the restricted path reference
         * @returns {void}
         * @private
         */
        function checkRestrictedPathAndReport(importSource, importNames, node) {
            if (!Object.hasOwn(groupedRestrictedPaths, importSource)) {
                return;
            }

            groupedRestrictedPaths[importSource].forEach(restrictedPathEntry => {
                const customMessage = restrictedPathEntry.message;
                const restrictedImportNames = restrictedPathEntry.importNames;
                const allowedImportNames = restrictedPathEntry.allowImportNames;

                if (!restrictedImportNames && !allowedImportNames) {
                    context.report({
                        node,
                        messageId: customMessage ? "pathWithCustomMessage" : "path",
                        data: {
                            importSource,
                            customMessage
                        }
                    });

                    return;
                }

                importNames.forEach((specifiers, importName) => {
                    if (importName === "*") {
                        const [specifier] = specifiers;

                        if (restrictedImportNames) {
                            context.report({
                                node,
                                messageId: customMessage ? "everythingWithCustomMessage" : "everything",
                                loc: specifier.loc,
                                data: {
                                    importSource,
                                    importNames: restrictedImportNames,
                                    customMessage
                                }
                            });
                        } else if (allowedImportNames) {
                            context.report({
                                node,
                                messageId: customMessage ? "everythingWithAllowImportNamesAndCustomMessage" : "everythingWithAllowImportNames",
                                loc: specifier.loc,
                                data: {
                                    importSource,
                                    allowedImportNames,
                                    customMessage
                                }
                            });
                        }

                        return;
                    }

                    if (restrictedImportNames && restrictedImportNames.includes(importName)) {
                        specifiers.forEach(specifier => {
                            context.report({
                                node,
                                messageId: customMessage ? "importNameWithCustomMessage" : "importName",
                                loc: specifier.loc,
                                data: {
                                    importSource,
                                    customMessage,
                                    importName
                                }
                            });
                        });
                    }

                    if (allowedImportNames && !allowedImportNames.includes(importName)) {
                        specifiers.forEach(specifier => {
                            context.report({
                                node,
                                loc: specifier.loc,
                                messageId: customMessage ? "allowedImportNameWithCustomMessage" : "allowedImportName",
                                data: {
                                    importSource,
                                    customMessage,
                                    importName,
                                    allowedImportNames
                                }
                            });
                        });
                    }
                });
            });
        }

        /**
         * Report a restricted path specifically for patterns.
         * @param {node} node representing the restricted path reference
         * @param {Object} group contains an Ignore instance for paths, the customMessage to show on failure,
         * and any restricted import names that have been specified in the config
         * @param {Map<string,Object[]>} importNames Map of import names that are being imported
         * @returns {void}
         * @private
         */
        function reportPathForPatterns(node, group, importNames) {
            const importSource = node.source.value.trim();

            const customMessage = group.customMessage;
            const restrictedImportNames = group.importNames;
            const restrictedImportNamePattern = group.importNamePattern ? new RegExp(group.importNamePattern, "u") : null;
            const allowedImportNames = group.allowImportNames;
            const allowedImportNamePattern = group.allowImportNamePattern ? new RegExp(group.allowImportNamePattern, "u") : null;

            /**
             * If we are not restricting to any specific import names and just the pattern itself,
             * report the error and move on
             */
            if (!restrictedImportNames && !allowedImportNames && !restrictedImportNamePattern && !allowedImportNamePattern) {
                context.report({
                    node,
                    messageId: customMessage ? "patternWithCustomMessage" : "patterns",
                    data: {
                        importSource,
                        customMessage
                    }
                });
                return;
            }

            importNames.forEach((specifiers, importName) => {
                if (importName === "*") {
                    const [specifier] = specifiers;

                    if (restrictedImportNames) {
                        context.report({
                            node,
                            messageId: customMessage ? "patternAndEverythingWithCustomMessage" : "patternAndEverything",
                            loc: specifier.loc,
                            data: {
                                importSource,
                                importNames: restrictedImportNames,
                                customMessage
                            }
                        });
                    } else if (allowedImportNames) {
                        context.report({
                            node,
                            messageId: customMessage ? "everythingWithAllowImportNamesAndCustomMessage" : "everythingWithAllowImportNames",
                            loc: specifier.loc,
                            data: {
                                importSource,
                                allowedImportNames,
                                customMessage
                            }
                        });
                    } else if (allowedImportNamePattern) {
                        context.report({
                            node,
                            messageId: customMessage ? "everythingWithAllowedImportNamePatternWithCustomMessage" : "everythingWithAllowedImportNamePattern",
                            loc: specifier.loc,
                            data: {
                                importSource,
                                allowedImportNamePattern,
                                customMessage
                            }
                        });
                    } else {
                        context.report({
                            node,
                            messageId: customMessage ? "patternAndEverythingWithRegexImportNameAndCustomMessage" : "patternAndEverythingWithRegexImportName",
                            loc: specifier.loc,
                            data: {
                                importSource,
                                importNames: restrictedImportNamePattern,
                                customMessage
                            }
                        });
                    }

                    return;
                }

                if (
                    (restrictedImportNames && restrictedImportNames.includes(importName)) ||
                    (restrictedImportNamePattern && restrictedImportNamePattern.test(importName))
                ) {
                    specifiers.forEach(specifier => {
                        context.report({
                            node,
                            messageId: customMessage ? "patternAndImportNameWithCustomMessage" : "patternAndImportName",
                            loc: specifier.loc,
                            data: {
                                importSource,
                                customMessage,
                                importName
                            }
                        });
                    });
                }

                if (allowedImportNames && !allowedImportNames.includes(importName)) {
                    specifiers.forEach(specifier => {
                        context.report({
                            node,
                            messageId: customMessage ? "allowedImportNameWithCustomMessage" : "allowedImportName",
                            loc: specifier.loc,
                            data: {
                                importSource,
                                customMessage,
                                importName,
                                allowedImportNames
                            }
                        });
                    });
                } else if (allowedImportNamePattern && !allowedImportNamePattern.test(importName)) {
                    specifiers.forEach(specifier => {
                        context.report({
                            node,
                            messageId: customMessage ? "allowedImportNamePatternWithCustomMessage" : "allowedImportNamePattern",
                            loc: specifier.loc,
                            data: {
                                importSource,
                                customMessage,
                                importName,
                                allowedImportNamePattern
                            }
                        });
                    });
                }
            });
        }

        /**
         * Check if the given importSource is restricted by a pattern.
         * @param {string} importSource path of the import
         * @param {Object} group contains a Ignore instance for paths, and the customMessage to show if it fails
         * @returns {boolean} whether the variable is a restricted pattern or not
         * @private
         */
        function isRestrictedPattern(importSource, group) {
            return group.matcher.ignores(importSource);
        }

        /**
         * Checks a node to see if any problems should be reported.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         * @private
         */
        function checkNode(node) {
            const importSource = node.source.value.trim();
            const importNames = new Map();

            if (node.type === "ExportAllDeclaration") {
                const starToken = sourceCode.getFirstToken(node, 1);

                importNames.set("*", [{ loc: starToken.loc }]);
            } else if (node.specifiers) {
                for (const specifier of node.specifiers) {
                    let name;
                    const specifierData = { loc: specifier.loc };

                    if (specifier.type === "ImportDefaultSpecifier") {
                        name = "default";
                    } else if (specifier.type === "ImportNamespaceSpecifier") {
                        name = "*";
                    } else if (specifier.imported) {
                        name = astUtils.getModuleExportName(specifier.imported);
                    } else if (specifier.local) {
                        name = astUtils.getModuleExportName(specifier.local);
                    }

                    if (typeof name === "string") {
                        if (importNames.has(name)) {
                            importNames.get(name).push(specifierData);
                        } else {
                            importNames.set(name, [specifierData]);
                        }
                    }
                }
            }

            checkRestrictedPathAndReport(importSource, importNames, node);
            restrictedPatternGroups.forEach(group => {
                if (isRestrictedPattern(importSource, group)) {
                    reportPathForPatterns(node, group, importNames);
                }
            });
        }

        return {
            ImportDeclaration: checkNode,
            ExportNamedDeclaration(node) {
                if (node.source) {
                    checkNode(node);
                }
            },
            ExportAllDeclaration: checkNode
        };
    }
};
