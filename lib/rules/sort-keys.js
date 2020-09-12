/**
 * @fileoverview Rule to require object keys to be sorted
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils"),
    naturalCompare = require("natural-compare");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the property name of the given `Property` node.
 *
 * - If the property's key is an `Identifier` node, this returns the key's name
 *   whether it's a computed property or not.
 * - If the property has a static name, this returns the static name.
 * - Otherwise, this returns null.
 * @param {ASTNode} node The `Property` node to get.
 * @returns {string|null} The property name or null.
 * @private
 */
function getPropertyName(node) {
    const staticName = astUtils.getStaticPropertyName(node);

    if (staticName !== null) {
        return staticName;
    }

    return node.key.name || null;
}

/**
 * Check the Line Separated Groups
 *
 * - Compare the start line of the current node with the last line of the previous node.
 *   If the difference between the two values is greater than 0, Not the same group.
 * @param {number} thisStartLine is start line of the current node.
 * @param {number} prevEndLine is end line of the previous node.
 * @param {number} commentOffset is total comment line between two values.
 * @returns {boolean} check group
 * @private
 */
function checkLineSeparatedGroups(thisStartLine, prevEndLine, commentOffset) {
    return !!Math.max(thisStartLine - prevEndLine - commentOffset - 1, 0);
}

/**
 * Get Comment Offset between prevEndLine and thisStartLine
 * @param {number} prevEndLine is end line of the previous node.
 * @param {Array<Token>} beforeTokens is token list before thisStartLine.
 * @returns {number} commentOffset
 */
function getCommentOffset(prevEndLine, beforeTokens) {
    let commentOffset = 0;

    for (let i = 0; i < beforeTokens.length; i++) {
        const token = beforeTokens[i];

        if (prevEndLine < token.loc.end.line) {
            if (token.type === "Line") {
                commentOffset++;
            } else if (token.type === "Block") {
                commentOffset = commentOffset + token.loc.end.line - token.loc.start.line + 1;
            }
        }
    }
    return commentOffset;
}

/**
 * Functions which check that the given 2 names are in specific order.
 *
 * Postfix `I` is meant insensitive.
 * Postfix `N` is meant natural.
 * @private
 */
const isValidOrders = {
    asc(a, b) {
        return a <= b;
    },
    ascI(a, b) {
        return a.toLowerCase() <= b.toLowerCase();
    },
    ascN(a, b) {
        return naturalCompare(a, b) <= 0;
    },
    ascIN(a, b) {
        return naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0;
    },
    desc(a, b) {
        return isValidOrders.asc(b, a);
    },
    descI(a, b) {
        return isValidOrders.ascI(b, a);
    },
    descN(a, b) {
        return isValidOrders.ascN(b, a);
    },
    descIN(a, b) {
        return isValidOrders.ascIN(b, a);
    }
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "require object keys to be sorted",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/sort-keys"
        },

        schema: [
            {
                enum: ["asc", "desc"]
            },
            {
                type: "object",
                properties: {
                    caseSensitive: {
                        type: "boolean",
                        default: true
                    },
                    natural: {
                        type: "boolean",
                        default: false
                    },
                    minKeys: {
                        type: "integer",
                        minimum: 2,
                        default: 2
                    },
                    allowLineSeparatedGroups: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            sortKeys: "Expected object keys to be in {{natural}}{{insensitive}}{{order}}ending order. '{{thisName}}' should be before '{{prevName}}'."
        }
    },

    create(context) {

        // Parse options.
        const order = context.options[0] || "asc";
        const options = context.options[1];
        const insensitive = options && options.caseSensitive === false;
        const natural = options && options.natural;
        const minKeys = options && options.minKeys;
        const allowLineSeparatedGroups = options && options.allowLineSeparatedGroups || false;
        const isValidOrder = isValidOrders[
            order + (insensitive ? "I" : "") + (natural ? "N" : "")
        ];

        // The stack to save the previous property's name for each object literals.
        let stack = null;

        // The sourceCode use to check comment between groups
        const sourceCode = context.getSourceCode();

        return {
            ObjectExpression(node) {
                stack = {
                    upper: stack,
                    prevName: null,
                    prevEndLine: null,
                    numKeys: node.properties.length
                };
            },

            "ObjectExpression:exit"() {
                stack = stack.upper;
            },

            SpreadElement(node) {
                if (node.parent.type === "ObjectExpression") {
                    stack.prevName = null;
                }
            },

            Property(node) {
                if (node.parent.type === "ObjectPattern") {
                    return;
                }

                const prevName = stack.prevName;
                const prevEndLine = stack.prevEndLine;
                const numKeys = stack.numKeys;
                const thisName = getPropertyName(node);
                const thisStartLine = node.loc.start.line;
                const beforeTokens = sourceCode.getTokensBefore(node, { includeComments: true });
                const commentOffset = getCommentOffset(prevEndLine, beforeTokens);
                const isLineSeparatedGroups = prevEndLine && checkLineSeparatedGroups(thisStartLine, prevEndLine, commentOffset);

                stack.prevEndLine = node.loc.end.line;

                if (thisName !== null) {
                    stack.prevName = thisName;
                }

                if (allowLineSeparatedGroups && (isLineSeparatedGroups || thisName === null)) {
                    stack.prevName = null;
                    return;
                }

                if (prevName === null || thisName === null || numKeys < minKeys) {
                    return;
                }

                if (!isValidOrder(prevName, thisName)) {
                    context.report({
                        node,
                        loc: node.key.loc,
                        messageId: "sortKeys",
                        data: {
                            thisName,
                            prevName,
                            order,
                            insensitive: insensitive ? "insensitive " : "",
                            natural: natural ? "natural " : ""
                        }
                    });
                }
            }
        };
    }
};
