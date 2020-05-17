/**
 * @fileoverview Rule to require sorting of import declarations
 * @author Ilia Mazan
 */

"use strict";

const ABSOLUTE_PREFIX = "@";
const LOCAL_PREFIX = "./";
const DEFAULT_SPECIFIER = "ImportDefaultSpecifier";
const IMPORT_SPECIFIER = "ImportSpecifier";

const Declaration = {
    GLOBAL: "global",
    ABSOLUTE: "absolute",
    LOCAL: "local"
};

Object.freeze(Declaration);

const DeclarationSyntax = {
    DEFAULT: "default",
    MIX: "mix",
    SINGLE: "single",
    MULTIPLE: "multiple",
    NONE: "none"
};

Object.freeze(DeclarationSyntax);

const ErrorMessage = {
    SORT_DECLARATION: "sortDeclaration",
    SORT_DECLARATION_SYNTAX: "sortDeclarationSyntax",
    SORT_MEMBER_ALPHABETICALLY: "SortMemberAlphabetically",
    SORT_SOURCE_VALUE_ALPHABETICALLY: "SortSourceValueAlphabetically",
    MISSING_BLANK_LINE: "missingBlankLine"
};

Object.freeze(ErrorMessage);

const MESSAGES = {
    [ErrorMessage.SORT_DECLARATION]: "Expected {{declarationA}} imports before {{declarationB}}.",
    [ErrorMessage.SORT_DECLARATION_SYNTAX]: "Expected {{syntaxA}} syntax before {{syntaxB}} syntax.",
    [ErrorMessage.SORT_MEMBER_ALPHABETICALLY]: "Member \"{{memberName}}\" of the import declaration should be sorted alphabetically.",
    [ErrorMessage.SORT_SOURCE_VALUE_ALPHABETICALLY]: "Import \"{{sourceValue}}\" should be sorted alphabetically.",
    [ErrorMessage.MISSING_BLANK_LINE]: "Expected blank line between {{declarationA}} and {{declarationB}} import."
};

const DEFAULT_CONFIGURATION = {
    declarationSortOrder: Object.values(Declaration),
    declarationSyntaxSortOrder: Object.values(DeclarationSyntax),
    absoluteImportPrefix: ABSOLUTE_PREFIX,
    ignoreDeclarationSort: false,
    ignoreDeclarationSyntaxSort: false,
    ignoreMemberSort: false,
    ignoreCase: false,
    ignoreSourceValueSort: false,
    ignoreMissingBlankLineBetweenDeclarations: false
};

/**
 * Return a function to check is specifier has comment
 * @param {Object} sourceCode source code
 * @returns {Function} specifier => boolean
 */
function isSpecifierHasComment(sourceCode) {
    return specifier =>
        sourceCode.getCommentsBefore(specifier).length || sourceCode.getCommentsAfter(specifier).length;
}

/**
 * A comparator for two specifiers and given function
 * @param {Function} keyExtractor function for extracting key for compare
 * @returns {Function} comparator function
 */
function specifierComparator(keyExtractor) {
    return (a, b) => {
        const aKey = keyExtractor(a);
        const bKey = keyExtractor(b);

        return aKey > bKey ? 1 : -1;
    };
}

/**
 * fix member sort error
 * @param {Object} sourceCode source code
 * @param {Array} importSpecifiers array of not default import specifiers
 * @param {Function} keyExtractor function for extracting key for compare
 * @returns {Function} fixer
 */
function fixMemberSort(sourceCode, importSpecifiers, keyExtractor) {
    return fixer => {
        const hasComment = importSpecifiers.some(isSpecifierHasComment(sourceCode));

        if (hasComment) {
            return null;
        }

        const fullStart = importSpecifiers[0] &&
            importSpecifiers[0].range[0];
        const fullEnd = importSpecifiers[importSpecifiers.length - 1] &&
            importSpecifiers[importSpecifiers.length - 1].range[1];

        const fullImportRange = [fullStart, fullEnd];

        return fixer.replaceTextRange(fullImportRange,
            importSpecifiers
                .slice()
                .sort(specifierComparator(keyExtractor))
                .reduce((sourceText, specifier, index) => {
                    const start = importSpecifiers[index] &&
                        importSpecifiers[index].range[1];
                    const end = importSpecifiers[index + 1] &&
                        importSpecifiers[index + 1].range[0];

                    const textAfterSpecifier = start && end ? sourceCode.getText().slice(start, end) : "";

                    return sourceText + sourceCode.getText(specifier) + textAfterSpecifier;
                }, ""));
    };
}

/**
 * fix missing blank line
 * @param {ASTNode} node current node
 * @param {ASTNode} previousNode previous node
 * @returns {Function} fixer
 */
function fixMissingBlankLine(node, previousNode) {
    return fixer => {
        if (node.loc.start.line > previousNode.loc.start.line) {
            return fixer.insertTextAfter(previousNode, "\n");
        }

        return fixer.insertTextAfter(node, "\n");
    };
}

/**
 * fix error with swap
 * @param {Object} sourceCode source code
 * @param {ASTNode} node current node
 * @param {ASTNode} previousNode previous node
 * @returns {Function} fixer
 */
function fixSwap(sourceCode, node, previousNode) {
    return fixer => {
        const nodeText = sourceCode.getText(node);
        const previousNodeText = sourceCode.getText(previousNode);

        return [
            fixer.replaceText(node, previousNodeText),
            fixer.replaceText(previousNode, nodeText)
        ];
    };
}

/**
 * check is current specifier - default
 * @param {Object} specifier specifier
 * @returns {boolean} result of checking
 */
function isDefaultSpecifier(specifier) {
    return specifier.type === DEFAULT_SPECIFIER;
}

/**
 * check is current specifier - not default
 * @param {Object} specifier specifier
 * @returns {boolean} result of checking
 */
function isImportSpecifier(specifier) {
    return specifier.type === IMPORT_SPECIFIER;
}

/**
 * Get declaration type of source
 * @param {Object} source import source
 * @returns {string} declaration type
 */
function getDeclarationType(source) {
    const name = source.value;

    if (name.startsWith(LOCAL_PREFIX)) {
        return Declaration.LOCAL;
    }

    if (name.startsWith(ABSOLUTE_PREFIX)) {
        return Declaration.ABSOLUTE;
    }

    return Declaration.GLOBAL;
}

/**
 * Get declaration syntax type of specifiers
 * @param {Object} specifiers import specifiers
 * @returns {string} declaration syntax type
 */
function getDeclarationSyntaxType(specifiers) {
    if (specifiers.length === 0) {
        return DeclarationSyntax.NONE;
    }

    if (specifiers.length === 1) {
        return isDefaultSpecifier(specifiers[0])
            ? DeclarationSyntax.DEFAULT
            : DeclarationSyntax.SINGLE;
    }

    const containsDefault = specifiers
        .some(isDefaultSpecifier);

    return containsDefault
        ? DeclarationSyntax.MIX
        : DeclarationSyntax.MULTIPLE;
}

/**
 * get key extractor base on flag
 * @param {Object} config config
 * @returns {Function} key extractor
 */
function getSpecifierKeyExtractor(config) {
    return config.ignoreCase
        ? specifier => specifier.local.name.toLowerCase()
        : specifier => specifier.local.name;
}

/**
 * get index if declaration type
 * @param {Object} config config
 * @param {Object} source source
 * @returns {number} index
 */
function getDeclarationTypeIndex(config, source) {
    return config.declarationSortOrder.indexOf(getDeclarationType(source));
}

/**
 * get index if declaration syntax type
 * @param {Object} config config
 * @param {Object} specifiers source
 * @returns {number} index
 */
function getDeclarationSyntaxTypeIndex(config, specifiers) {
    return config.declarationSyntaxSortOrder.indexOf(getDeclarationSyntaxType(specifiers));
}

/**
 * check right declaration import sort
 * @param {Object} config config
 * @param {ASTNode} node current node
 * @param {ASTNode} previousNode previous node
 * @returns {Object | null} result of checking
 */
function checkDeclarationSort(config, node, previousNode) {
    if (!previousNode) {
        return null;
    }

    const declarationNodeIndex = getDeclarationTypeIndex(config, node.source);
    const declarationPreviousNodeIndex = getDeclarationTypeIndex(config, previousNode.source);

    if (declarationNodeIndex < declarationPreviousNodeIndex) {
        const declarationNode = getDeclarationType(node.source);
        const declarationPreviousNode = getDeclarationType(previousNode.source);

        return {
            node,
            messageId: ErrorMessage.SORT_DECLARATION,
            data: {
                declarationA: declarationNode,
                declarationB: declarationPreviousNode
            },
            fix: fixSwap(config.sourceCode, node, previousNode)
        };
    }
    return null;
}

/**
 * check right declaration import syntax sort
 * @param {Object} config config
 * @param {ASTNode} node current node
 * @param {ASTNode} previousNode previous node
 * @returns {Object | null} result of checking
 */
function checkDeclarationSyntaxSort(config, node, previousNode) {
    if (!previousNode) {
        return null;
    }

    const syntaxNodeIndex = getDeclarationSyntaxTypeIndex(config, node.specifiers);
    const syntaxPreviousNodeIndex = getDeclarationSyntaxTypeIndex(config, previousNode.specifiers);

    if (syntaxNodeIndex < syntaxPreviousNodeIndex) {
        if (!config.ignoreDeclarationSort) {
            const declarationNodeIndex = getDeclarationTypeIndex(config, node.source);
            const declarationPreviousNodeIndex = getDeclarationTypeIndex(config, previousNode.source);

            if (declarationNodeIndex > declarationPreviousNodeIndex) {
                return null;
            }
        }

        const syntaxNode = getDeclarationSyntaxType(node.specifiers);
        const syntaxPreviousNode = getDeclarationSyntaxType(previousNode.specifiers);

        return {
            node,
            messageId: ErrorMessage.SORT_DECLARATION_SYNTAX,
            data: {
                syntaxA: syntaxNode,
                syntaxB: syntaxPreviousNode
            },
            fix: fixSwap(config.sourceCode, node, previousNode)
        };
    }
    return null;
}

/**
 * check missing blank line between imports
 * @param {Object} config config
 * @param {ASTNode} node current node
 * @param {ASTNode} previousNode previous node
 * @returns {Object | null} result of checking
 */
function checkMissingBlankLine(config, node, previousNode) {
    if (!previousNode) {
        return null;
    }

    const declarationNodeIndex = getDeclarationTypeIndex(config, node.source);
    const declarationPreviousNodeIndex = getDeclarationTypeIndex(config, previousNode.source);

    if (declarationNodeIndex !== declarationPreviousNodeIndex) {
        const { start: nodeStart, end: nodeEnd } = node.loc;
        const { start: previousNodeStart, end: previousNodeEnd } = previousNode.loc;

        if (nodeStart.line === previousNodeEnd.line + 1 ||
            previousNodeStart.line === nodeEnd.line + 1) {
            const declarationNode = getDeclarationType(node.source);
            const declarationPreviousNode = getDeclarationType(previousNode.source);

            return {
                node,
                messageId: ErrorMessage.MISSING_BLANK_LINE,
                data: {
                    declarationA: declarationNode,
                    declarationB: declarationPreviousNode
                },
                fix: fixMissingBlankLine(node, previousNode)
            };
        }
    }
    return null;
}

/**
 * check right import source value sort
 * @param {Object} config config
 * @param {ASTNode} node current node
 * @param {ASTNode} previousNode previous node
 * @returns {Object | null} result of checking
 */
function checkSourceValueSort(config, node, previousNode) {
    if (!previousNode) {
        return null;
    }

    const { value: nodeValue } = node.source;
    const { value: previousNodeValue } = previousNode.source;

    if (nodeValue < previousNodeValue) {
        if (!config.ignoreDeclarationSort) {
            const declarationNodeIndex = getDeclarationTypeIndex(config, node.source);
            const declarationPreviousNodeIndex = getDeclarationTypeIndex(config, previousNode.source);

            if (declarationNodeIndex > declarationPreviousNodeIndex) {
                return null;
            }
        }

        if (!config.ignoreDeclarationSyntaxSort) {
            const syntaxNodeIndex = getDeclarationSyntaxTypeIndex(config, node.specifiers);
            const syntaxPreviousNodeIndex = getDeclarationSyntaxTypeIndex(config, previousNode.specifiers);

            if (syntaxNodeIndex > syntaxPreviousNodeIndex) {
                return null;
            }
        }

        return {
            node,
            messageId: ErrorMessage.SORT_SOURCE_VALUE_ALPHABETICALLY,
            data: {
                sourceValue: nodeValue
            },
            fix: fixSwap(config.sourceCode, node, previousNode)
        };
    }
    return null;
}

/**
 * check right import's members sort
 * @param {Object} config config
 * @param {ASTNode} node current node
 * @returns {Object | null} result of checking
 */
function checkMemberSort(config, node) {
    const importSpecifiers = node.specifiers.filter(isImportSpecifier);
    const keyExtractor = getSpecifierKeyExtractor(config);
    const firstUnsortedIndex = importSpecifiers
        .map(keyExtractor)
        .findIndex((name, index, array) => array[index - 1] > name);

    if (firstUnsortedIndex !== -1) {
        return {
            node,
            messageId: ErrorMessage.SORT_MEMBER_ALPHABETICALLY,
            data: {
                memberName: keyExtractor(importSpecifiers[firstUnsortedIndex])
            },
            fix: fixMemberSort(config.sourceCode, importSpecifiers, keyExtractor)
        };
    }
    return null;
}

/**
 * Send report if need
 * @param {Object} context context
 * @param {Object} report report info
 * @returns {void}
 */
function sendReport(context, report) {
    if (report) {
        context.report(report);
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "enforce sort global, absolute and local imports",
            category: "Best practices",
            url: "https://eslint.org/docs/rules/advanced-sort-imports",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    declarationSortOrder: {
                        type: "array",
                        items: {
                            enum: Object.values(Declaration)
                        },
                        uniqueItems: true,
                        minItems: 3,
                        maxItems: 3
                    },
                    declarationSyntaxSortOrder: {
                        type: "array",
                        items: {
                            enum: Object.values(DeclarationSyntax)
                        },
                        uniqueItems: true,
                        minItems: 5,
                        maxItems: 5
                    },
                    absoluteImportPrefix: {
                        type: "string",
                        default: ABSOLUTE_PREFIX
                    },
                    defaultSpecifierFirst: {
                        type: "boolean",
                        default: true
                    },
                    ignoreDeclarationSort: {
                        type: "boolean",
                        default: false
                    },
                    ignoreDeclarationSyntaxSort: {
                        type: "boolean",
                        default: false
                    },
                    ignoreImportSpecifierSort: {
                        type: "boolean",
                        default: false
                    },
                    ignoreMemberSort: {
                        type: "boolean",
                        default: false
                    },
                    ignoreCase: {
                        type: "boolean",
                        default: false
                    },
                    ignoreSourceValueSort: {
                        type: "boolean",
                        default: false
                    },
                    ignoreMissingBlankLineBetweenDeclarations: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        fixable: "code",

        messages: MESSAGES
    },

    create(context) {
        let previousNode = null;
        const userConfig = context.options[0] || {};
        const config = { ...DEFAULT_CONFIGURATION, ...userConfig, sourceCode: context.getSourceCode() };

        const {
            ignoreDeclarationSort,
            ignoreDeclarationSyntaxSort,
            ignoreMissingBlankLineBetweenDeclarations,
            ignoreSourceValueSort,
            ignoreMemberSort
        } = config;

        return {
            ImportDeclaration(node) {
                if (!ignoreDeclarationSort) {
                    const report = checkDeclarationSort(config, node, previousNode);

                    sendReport(context, report);
                }

                if (!ignoreDeclarationSyntaxSort) {
                    const report = checkDeclarationSyntaxSort(config, node, previousNode);

                    sendReport(context, report);
                }

                if (!ignoreMissingBlankLineBetweenDeclarations) {
                    const report = checkMissingBlankLine(config, node, previousNode);

                    sendReport(context, report);
                }

                if (!ignoreSourceValueSort) {
                    const report = checkSourceValueSort(config, node, previousNode);

                    sendReport(context, report);
                }

                if (!ignoreMemberSort) {
                    const report = checkMemberSort(config, node);

                    sendReport(context, report);
                }

                previousNode = node;
            }
        };
    }
};
