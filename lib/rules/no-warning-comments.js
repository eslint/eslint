/**
 * @fileoverview Rule that warns about used warning comments
 * @author Alexander Schmidt <https://github.com/lxanders>
 */

"use strict";

const escapeRegExp = require("escape-string-regexp");
const astUtils = require("./utils/ast-utils");

const CHAR_LIMIT = 40;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow specified warning terms in comments",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-warning-comments"
        },

        schema: [
            {
                type: "object",
                properties: {
                    terms: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    location: {
                        enum: ["start", "anywhere"]
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unexpectedComment: "Unexpected '{{matchedTerm}}' comment: '{{comment}}'."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode(),
            configuration = context.options[0] || {},
            warningTerms = configuration.terms || ["todo", "fixme", "xxx"],
            location = configuration.location || "start",
            selfConfigRegEx = /\bno-warning-comments\b/u;

        /**
         * Convert a warning term into a RegExp which will match a comment containing that whole word in the specified
         * location ("start" or "anywhere"). If the term starts or ends with non word characters, then the match will not
         * require word boundaries on that side.
         * @param {string} term A term to convert to a RegExp
         * @returns {RegExp} The term converted to a RegExp
         */
        function convertToRegExp(term) {
            const escaped = escapeRegExp(term);

            /*
             * When matching at the start, ignore leading whitespace, and
             * there's no need to worry about word boundaries.
             *
             * These expressions for the prefix and suffix are designed as follows:
             * ^   handles any terms at the beginning of a comment.
             *     e.g. terms ["TODO"] matches `//TODO something`
             * $   handles any terms at the end of a comment
             *     e.g. terms ["TODO"] matches `// something TODO`
             * \s* handles optional leading spaces (for "start" location only)
             *     e.g. terms ["TODO"] matches `//    TODO something`
             * \b  handles terms preceded/followed by word boundary
             *     e.g. terms: ["!FIX", "FIX!"] matches `// FIX!something` or `// something!FIX`
             *          terms: ["FIX"] matches `// FIX!` or `// !FIX`, but not `// fixed or affix`
             */
            const wordBoundary = "\\b";

            let prefix = "";

            if (location === "start") {
                prefix = "^\\s*";
            } else if (/^\w/u.test(term)) {
                prefix = wordBoundary;
            }

            const suffix = /\w$/u.test(term) ? wordBoundary : "";
            const flags = "iu"; // Case-insensitive with Unicode case folding.

            /*
             * For location "start", the typical regex is:
             *   /^\s*ESCAPED_TERM\b/iu.
             *
             * For location "anywhere" the typical regex is
             *   /\bESCAPED_TERM\b/iu
             *
             * If it starts or ends with non-word character, the prefix and suffix empty, respectively.
             */
            return new RegExp(`${prefix}${escaped}${suffix}`, flags);
        }

        const warningRegExps = warningTerms.map(convertToRegExp);

        /**
         * Checks the specified comment for matches of the configured warning terms and returns the matches.
         * @param {string} comment The comment which is checked.
         * @returns {Array} All matched warning terms for this comment.
         */
        function commentContainsWarningTerm(comment) {
            const matches = [];

            warningRegExps.forEach((regex, index) => {
                if (regex.test(comment)) {
                    matches.push(warningTerms[index]);
                }
            });

            return matches;
        }

        /**
         * Checks the specified node for matching warning comments and reports them.
         * @param {ASTNode} node The AST node being checked.
         * @returns {void} undefined.
         */
        function checkComment(node) {
            const comment = node.value;

            if (
                astUtils.isDirectiveComment(node) &&
                selfConfigRegEx.test(comment)
            ) {
                return;
            }

            const matches = commentContainsWarningTerm(comment);

            matches.forEach(matchedTerm => {
                let commentToDisplay = "";
                let truncated = false;

                for (const c of comment.trim().split(/\s+/u)) {
                    const tmp = commentToDisplay ? `${commentToDisplay} ${c}` : c;

                    if (tmp.length <= CHAR_LIMIT) {
                        commentToDisplay = tmp;
                    } else {
                        truncated = true;
                        break;
                    }
                }

                context.report({
                    node,
                    messageId: "unexpectedComment",
                    data: {
                        matchedTerm,
                        comment: `${commentToDisplay}${
                            truncated ? "..." : ""
                        }`
                    }
                });
            });
        }

        return {
            Program() {
                const comments = sourceCode.getAllComments();

                comments
                    .filter(token => token.type !== "Shebang")
                    .forEach(checkComment);
            }
        };
    }
};
