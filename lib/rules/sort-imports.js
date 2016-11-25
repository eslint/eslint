/**
 * @fileoverview Rule to require sorting of import declarations
 * @author Christian Schuller
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce sorted import declarations within modules",
            category: "ECMAScript 6",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    ignoreCase: {
                        type: "boolean"
                    },
                    memberSyntaxSortOrder: {
                        type: "array",
                        items: {
                            enum: ["none", "all", "multiple", "single"]
                        },
                        uniqueItems: true,
                        minItems: 4,
                        maxItems: 4
                    },
                    ignoreMemberSort: {
                        type: "boolean"
                    },
                    enableTypeSort: {
                        type: "boolean"
                    },
                    cssExtensions: {
                        type: "array",
                        items: {
                            enum: ["css", "less", "sass", "scss"]
                        }
                    },
                    typeSortOrder: {
                        type: "array",
                        items: {
                            enum: ["package", "path", "css"]
                        }
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        const configuration = context.options[0] || {},
            ignoreCase = configuration.ignoreCase || false,
            enableTypeSort = configuration.enableTypeSort || false,
            typeSortOrder = configuration.typeSortOrder || ["package", "path", "css"],
            cssExtensions = configuration.cssExtensions || ["css", "less", "sass", "scss"],
            ignoreMemberSort = configuration.ignoreMemberSort || false,
            memberSyntaxSortOrder = configuration.memberSyntaxSortOrder || ["none", "all", "multiple", "single"];
        let previousDeclaration = null;

        /**
         * Identify the type based on path
         *
         * @param  {Object} node An import statement
         * @returns {string}      Can be found in typeSortOrder
         */
        function getImportType(node) {
            const fromPath = node.source ? node.source.value : "./unknown",
                parts = fromPath.split(".");

            if (cssExtensions.indexOf(parts[parts.length - 1]) >= 0) {
                return "css";
            }
            if ([".", "/"].indexOf(fromPath.charAt(0)) >= 0) {
                return "path";
            }
            return "package";
        }

        /**
         * Compare two types of import
         *
         * @param  {string} type1 first from
         * @param  {string} type2 second from
         * @returns {int} -n if type name1<name2, 0 if same type, +n if type name1>name2
         */
        function compareTypeOrder(type1, type2) {
            return typeSortOrder.indexOf(type1) - typeSortOrder.indexOf(type2);
        }

        /**
         * Gets the used member syntax style.
         *
         * import "my-module.js" --> none
         * import * as myModule from "my-module.js" --> all
         * import {myMember} from "my-module.js" --> single
         * import {foo, bar} from  "my-module.js" --> multiple
         *
         * @param {ASTNode} node - the ImportDeclaration node.
         * @returns {string} used member parameter style, ["all", "multiple", "single"]
         */
        function usedMemberSyntax(node) {
            if (node.specifiers.length === 0) {
                return "none";
            } else if (node.specifiers[0].type === "ImportNamespaceSpecifier") {
                return "all";
            } else if (node.specifiers.length === 1) {
                return "single";
            } else {
                return "multiple";
            }
        }

        /**
         * Gets the group by member parameter index for given declaration.
         * @param {ASTNode} node - the ImportDeclaration node.
         * @returns {number} the declaration group by member index.
         */
        function getMemberParameterGroupIndex(node) {
            return memberSyntaxSortOrder.indexOf(usedMemberSyntax(node));
        }

        /**
         * Gets the local name of the first imported module.
         * @param {ASTNode} node - the ImportDeclaration node.
         * @returns {?string} the local name of the first imported module.
         */
        function getFirstLocalMemberName(node) {
            if (node.specifiers[0]) {
                return node.specifiers[0].local.name;
            } else {
                return null;
            }
        }

        return {
            ImportDeclaration(node) {
                let skipOther = false;

                if (previousDeclaration) {
                    const currentMemberSyntaxGroupIndex = getMemberParameterGroupIndex(node),
                        previousMemberSyntaxGroupIndex = getMemberParameterGroupIndex(previousDeclaration),
                        typeCurrent = getImportType(node),
                        typePrevious = getImportType(previousDeclaration);
                    let currentLocalMemberName = getFirstLocalMemberName(node),
                        previousLocalMemberName = getFirstLocalMemberName(previousDeclaration);

                    if (ignoreCase) {
                        previousLocalMemberName = previousLocalMemberName && previousLocalMemberName.toLowerCase();
                        currentLocalMemberName = currentLocalMemberName && currentLocalMemberName.toLowerCase();
                    }

                    if (enableTypeSort && node.source) {

                        const order = compareTypeOrder(typePrevious, typeCurrent);

                        // ==0: when type is the same (in same block) check other sub-rules
                        if (order < 0) {
                            skipOther = true;   // when switching type block skip other sub-rules
                        } else if (order > 0) {
                            context.report({
                                node,
                                message: "Imports should be sorted so packages are at the beginning and styles at the end."
                            });
                        }
                    }

                    // When the current declaration uses a different member syntax,
                    // then check if the ordering is correct.
                    // Otherwise, make a default string compare (like rule sort-vars to be consistent) of the first used local member name.
                    if (!skipOther && currentMemberSyntaxGroupIndex !== previousMemberSyntaxGroupIndex) {
                        if (currentMemberSyntaxGroupIndex < previousMemberSyntaxGroupIndex) {
                            context.report({
                                node,
                                message: "Expected '{{syntaxA}}' syntax before '{{syntaxB}}' syntax.",
                                data: {
                                    syntaxA: memberSyntaxSortOrder[currentMemberSyntaxGroupIndex],
                                    syntaxB: memberSyntaxSortOrder[previousMemberSyntaxGroupIndex]
                                }
                            });
                        }
                    } else if (!skipOther) {
                        if (previousLocalMemberName &&
                            currentLocalMemberName &&
                            currentLocalMemberName < previousLocalMemberName
                        ) {
                            context.report({
                                node,
                                message: "Imports should be sorted alphabetically."
                            });
                        }
                    }
                }

                // Multiple members of an import declaration should also be sorted alphabetically.
                if (!skipOther && !ignoreMemberSort && node.specifiers.length > 1) {
                    let previousSpecifier = null;
                    let previousSpecifierName = null;

                    for (let i = 0; i < node.specifiers.length; ++i) {
                        const currentSpecifier = node.specifiers[i];

                        if (currentSpecifier.type !== "ImportSpecifier") {
                            continue;
                        }

                        let currentSpecifierName = currentSpecifier.local.name;

                        if (ignoreCase) {
                            currentSpecifierName = currentSpecifierName.toLowerCase();
                        }

                        if (previousSpecifier && currentSpecifierName < previousSpecifierName) {
                            context.report({
                                node: currentSpecifier,
                                message: "Member '{{memberName}}' of the import declaration should be sorted alphabetically.",
                                data: {
                                    memberName: currentSpecifier.local.name
                                }
                            });
                        }

                        previousSpecifier = currentSpecifier;
                        previousSpecifierName = currentSpecifierName;
                    }
                }

                previousDeclaration = node;
            }
        };
    }
};
