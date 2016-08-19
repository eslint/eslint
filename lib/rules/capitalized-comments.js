/**
 * @fileoverview enforce or disallow capitalization of the first letter of a comment
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const LETTER_PATTERN = require("../util/patterns/L"),
    UPPERCASE_PATTERN = require("../util/patterns/Lu"),
    LOWERCASE_PATTERN = require("../util/patterns/Ll");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALWAYS_MESSAGE = "Comments should not begin with a lowercase character",
    NEVER_MESSAGE = "Comments should not begin with an uppercase character",
    DEFAULT_IGNORE_PATTERN = /^\s*(?:eslint|istanbul|jscs|jshint)/,
    WHITESPACE = /\s/g,
    DEFAULTS = {
        capitalize: "always",
        ignorePattern: null,
        markers: [],
        ignoreInlineComments: false
    };

/**
 * Get normalized options for either block or line comments from the given
 * user-provided options.
 * - If the user-provided options is just a string, returns a normalized
 *   set of options using default values for all other options.
 * - If the user-provided options is an object, then a normalized option
 *   set is returned. Options specified in overrides will take priority
 *   over options specified in the main options object, which will in
 *   turn take priority over the rule's defaults.
 *
 * @param {Object|string} rawOptions The user-provided options.
 * @param {string} which Either "line" or "block".
 * @returns {Object} The normalized options.
 */
function getNormalizedOptions(rawOptions, which) {
    if (typeof rawOptions === "string" || !rawOptions) {
        return Object.assign({}, DEFAULTS, {
            capitalize: rawOptions || "always"
        });
    }

    if (!rawOptions.overrides) {
        rawOptions.overrides = {};
    }

    if (!rawOptions.overrides[which]) {
        rawOptions.overrides[which] = {};
    }

    return Object.assign({}, DEFAULTS, rawOptions, rawOptions.overrides[which]);
}

/**
 * Get normalized options for block and line comments.
 *
 * @param {Object|string} rawOptions The user-provided options.
 * @returns {Object} An object with "Line" and "Block" keys and corresponding
 * normalized options objects.
 */
function getAllNormalizedOptions(rawOptions) {
    return {
        Line: getNormalizedOptions(rawOptions, "line"),
        Block: getNormalizedOptions(rawOptions, "block")
    };
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce or disallow capitalization of the first letter of a comment",
            category: "Stylistic Issues",
            recommended: false
        },
        fixable: null,
        schema: [
            {
                oneOf: [
                    { enum: ["always", "never"] },
                    {
                        type: "object",
                        properties: {
                            capitalize: { enum: ["always", "never"] },
                            ignorePattern: {
                                type: "string"
                            },
                            markers: {
                                type: "array",
                                items: {
                                    type: "string"
                                },
                                uniqueItems: true
                            },
                            ignoreInlineComments: {
                                type: "boolean"
                            },
                            overrides: {
                                type: "object",
                                properties: {
                                    line: {
                                        type: "object",
                                        properties: {
                                            capitalize: { enum: ["always", "never"] },
                                            ignorePattern: {
                                                type: "string"
                                            },
                                            markers: {
                                                type: "array",
                                                items: {
                                                    type: "string"
                                                },
                                                uniqueItems: true
                                            },
                                            ignoreInlineComments: {
                                                type: "boolean"
                                            }
                                        },
                                        additionalProperties: false
                                    },
                                    block: {
                                        type: "object",
                                        properties: {
                                            capitalize: { enum: ["always", "never"] },
                                            ignorePattern: {
                                                type: "string"
                                            },
                                            markers: {
                                                type: "array",
                                                items: {
                                                    type: "string"
                                                },
                                                uniqueItems: true
                                            },
                                            ignoreInlineComments: {
                                                type: "boolean"
                                            }
                                        },
                                        additionalProperties: false
                                    }
                                },
                                additionalProperties: false
                            }
                        },
                        additionalProperties: false
                    }
                ]
            }
        ]
    },

    create(context) {

        const normalizedOptions = getAllNormalizedOptions(context.options[0]),
            sourceCode = context.getSourceCode();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Checks whether a comment is an inline comment.
         *
         * @param {ASTNode} comment The comment node to check.
         * @returns {boolean} True if the comment is an inline comment, false
         * otherwise.
         */
        function isInlineComment(comment) {
            const firstToken = sourceCode.getFirstToken(comment),
                previousToken = sourceCode.getTokenBefore(firstToken);

            return previousToken &&
                firstToken.loc.line === previousToken.loc.line;
        }

        /**
         * Process a comment to determine if it needs to be reported.
         *
         * @param {ASTNode} comment The comment node to process.
         * @returns {void}
         */
        function processComment(comment) {
            const options = normalizedOptions[comment.type];

            // 1. Check for markers.
            if (options.markers.some(m => comment.value[0] === m)) {
                return;
            }

            // 2. Check for default ignore pattern.
            if (DEFAULT_IGNORE_PATTERN.test(comment.value)) {
                return;
            }

            // 3. Check for custom ignore pattern.
            if (options.ignorePattern && RegExp(options.ignorePattern).test(comment.value)) {
                return;
            }

            // 4. Check for inline comments.
            if (options.ignoreInlineComments && isInlineComment(comment)) {
                return;
            }

            // 5. Is the initial word character a letter?
            const commentWordCharsOnly = comment.value
                .replace(WHITESPACE, "")
                .replace(/\*/g, "");        // FIXME: Should this be hardcoded?

            const firstWordChar = commentWordCharsOnly[0];

            if (!LETTER_PATTERN.test(firstWordChar)) {
                return;
            }

            // 6. Check the case of the initial word character.
            const isUppercase = UPPERCASE_PATTERN.test(firstWordChar),
                isLowercase = LOWERCASE_PATTERN.test(firstWordChar);

            if (options.capitalize === "always" && isLowercase) {
                context.report({
                    node: null,         // Intentionally using loc instead
                    loc: comment.loc,
                    message: ALWAYS_MESSAGE
                });
            } else if (options.capitalize === "never" && isUppercase) {
                context.report({
                    node: null,         // Intentionally using loc instead
                    loc: comment.loc,
                    message: NEVER_MESSAGE
                });
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            Program() {
                const comments = sourceCode.getAllComments();

                comments.forEach(processComment);
            }
        };
    }
};
