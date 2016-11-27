/**
 * @fileoverview enforce or disallow capitalization of the first letter of a comment
 * @author Kevin Partington
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const LETTER_PATTERN = require("../util/patterns/letters");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ALWAYS_MESSAGE = "Comments should not begin with a lowercase character",
    NEVER_MESSAGE = "Comments should not begin with an uppercase character",
    DEFAULT_IGNORE_PATTERN = /^\s*(?:eslint|istanbul|jscs|jshint|globals?|exported)\b/,
    WHITESPACE = /\s/g,
    MAYBE_URL = /^\s*[^:/?#\s]+:\/\/[^?#]/,    // TODO: Combine w/ max-len pattern?
    DEFAULTS = {
        ignorePattern: null,
        ignoreInlineComments: false,
        ignoreConsecutiveComments: false
    };

/*
 * Base schema body for defining the basic capitalization rule, ignorePattern,
 * and ignoreInlineComments values.
 * This can be used in a few different ways in the actual schema.
 */
const SCHEMA_BODY = {
    type: "object",
    properties: {
        ignorePattern: {
            type: "string"
        },
        ignoreInlineComments: {
            type: "boolean"
        },
        ignoreConsecutiveComments: {
            type: "boolean"
        }
    },
    additionalProperties: false
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
    if (!rawOptions) {
        return Object.assign({}, DEFAULTS);
    }

    return Object.assign({}, DEFAULTS, rawOptions[which] || rawOptions);
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

/**
 * Creates a regular expression for each ignorePattern defined in the rule
 * options.
 *
 * This is done in order to avoid invoking the RegExp constructor repeatedly.
 *
 * @param {Object} normalizedOptions The normalized rule options.
 * @returns {void}
 */
function createRegExpForIgnorePatterns(normalizedOptions) {
    Object.keys(normalizedOptions).forEach(key => {
        const ignorePatternStr = normalizedOptions[key].ignorePattern;

        if (ignorePatternStr) {
            const regExp = RegExp(`^\\s*(?:${ignorePatternStr})`);

            normalizedOptions[key].ignorePatternRegExp = regExp;
        }
    });
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
            { enum: ["always", "never"] },
            {
                oneOf: [
                    SCHEMA_BODY,
                    {
                        type: "object",
                        properties: {
                            line: SCHEMA_BODY,
                            block: SCHEMA_BODY
                        },
                        additionalProperties: false
                    }
                ]
            }
        ]
    },

    create(context) {

        const capitalize = context.options[0] || "always",
            normalizedOptions = getAllNormalizedOptions(context.options[1]),
            sourceCode = context.getSourceCode(),
            validCommentMap = new Map();

        createRegExpForIgnorePatterns(normalizedOptions);

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Checks whether a comment is an inline comment.
         *
         * For the purpose of this rule, a comment is inline if:
         * 1. The comment is preceded by a token on the same line; and
         * 2. The command is followed by a token on the same line.
         *
         * Note that the comment itself need not be single-line!
         *
         * Also, it follows from this definition that only block comments can
         * be considered as possibly inline. This is because line comments
         * would consume any following tokens on the same line as the comment.
         *
         * @param {ASTNode} comment The comment node to check.
         * @returns {boolean} True if the comment is an inline comment, false
         * otherwise.
         */
        function isInlineComment(comment) {
            const previousToken = sourceCode.getTokenOrCommentBefore(comment),
                nextToken = sourceCode.getTokenOrCommentAfter(comment);

            return Boolean(
                previousToken &&
                nextToken &&
                comment.loc.start.line === previousToken.loc.end.line &&
                comment.loc.end.line === nextToken.loc.start.line
            );
        }

        /**
         * Determine if a comment follows another valid comment.
         *
         * @param {ASTNode} comment The comment to check.
         * @returns {boolean} True if the comment follows a valid comment.
         */
        function isConsecutiveValidComment(comment) {
            const previousTokenOrComment = sourceCode.getTokenOrCommentBefore(comment);

            return Boolean(
                previousTokenOrComment &&
                ["Block", "Line"].indexOf(previousTokenOrComment.type) !== -1 &&
                validCommentMap.get(previousTokenOrComment)
            );
        }

        /**
         * Check a comment to determine if it is valid for this rule.
         *
         * @param {ASTNode} comment The comment node to process.
         * @param {Object} options The options for checking this comment.
         * @returns {boolean} True if the comment is valid, false otherwise.
         */
        function isCommentValid(comment, options) {

            // 1. Check for default ignore pattern.
            if (DEFAULT_IGNORE_PATTERN.test(comment.value)) {
                return true;
            }

            // 2. Check for custom ignore pattern.
            const commentWithoutAsterisks = comment.value
                .replace(/\*/g, "");

            if (options.ignorePatternRegExp && options.ignorePatternRegExp.test(commentWithoutAsterisks)) {
                return true;
            }

            // 3. Check for inline comments.
            if (options.ignoreInlineComments && isInlineComment(comment)) {
                return true;
            }

            // 4. Is this a consecutive comment (and are we tolerating those)?
            if (options.ignoreConsecutiveComments && isConsecutiveValidComment(comment)) {
                return true;
            }

            // 5. Does the comment start with a possible URL?
            if (MAYBE_URL.test(commentWithoutAsterisks)) {
                return true;
            }

            // 6. Is the initial word character a letter?
            const commentWordCharsOnly = commentWithoutAsterisks
                .replace(WHITESPACE, "");

            if (commentWordCharsOnly.length === 0) {
                return true;
            }

            const firstWordChar = commentWordCharsOnly[0];

            if (!LETTER_PATTERN.test(firstWordChar)) {
                return true;
            }

            // 7. Check the case of the initial word character.
            const isUppercase = firstWordChar !== firstWordChar.toLocaleLowerCase(),
                isLowercase = firstWordChar !== firstWordChar.toLocaleUpperCase();

            if (capitalize === "always" && isLowercase) {
                return false;
            } else if (capitalize === "never" && isUppercase) {
                return false;
            }

            return true;
        }

        /**
         * Process a comment to determine if it needs to be reported.
         *
         * @param {ASTNode} comment The comment node to process.
         * @returns {void}
         */
        function processComment(comment) {
            const options = normalizedOptions[comment.type],
                commentValid = isCommentValid(comment, options);

            if (!commentValid) {
                const message = capitalize === "always" ?
                    ALWAYS_MESSAGE :
                    NEVER_MESSAGE;

                context.report({
                    node: null,         // Intentionally using loc instead
                    loc: comment.loc,
                    message
                });
            }

            validCommentMap.set(comment, commentValid);
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
