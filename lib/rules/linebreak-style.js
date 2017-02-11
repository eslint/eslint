/**
 * @fileoverview Rule to enforce a single linebreak style.
 * @author Erik Mueller
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent linebreak style",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                enum: ["unix", "windows", "consistent"]
            }
        ]
    },

    create(context) {

        const EXPECTED_LF_MSG = "Expected linebreaks to be 'LF' but found 'CRLF'.",
            EXPECTED_CRLF_MSG = "Expected linebreaks to be 'CRLF' but found 'LF'.";

        const sourceCode = context.getSourceCode();

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Builds a fix function that replaces text at the specified range in the source text.
         * @param {int[]} range The range to replace
         * @param {string} text The text to insert.
         * @returns {Function} Fixer function
         * @private
         */
        function createFix(range, text) {
            return function(fixer) {
                return fixer.replaceTextRange(range, text);
            };
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            Program: function checkForlinebreakStyle(node) {
                const linebreakStyle = context.options[0] || "unix",
                    expectedLF = linebreakStyle === "unix",
                    source = sourceCode.getText(),
                    pattern = /\r\n|\r|\n|\u2028|\u2029/g,
                    checkConsistency = linebreakStyle === "consistent" ? {} : null;
                let expectedLFChars = expectedLF ? "\n" : "\r\n";
                let match;

                let i = 0;

                while ((match = pattern.exec(source)) !== null) {
                    i++;

                    if (!checkConsistency && match[0] === expectedLFChars) {
                        continue;
                    }

                    const index = match.index;
                    const range = [index, index + match[0].length];

                    if (checkConsistency) {
                        checkConsistency[match[0]] = checkConsistency[match[0]] || [];
                        checkConsistency[match[0]].push({
                            line: i,
                            index, range
                        });
                    } else {
                        context.report({
                            node,
                            loc: {
                                line: i,
                                column: sourceCode.lines[i - 1].length
                            },
                            message: expectedLF ? EXPECTED_LF_MSG : EXPECTED_CRLF_MSG,
                            fix: createFix(range, expectedLFChars)
                        });
                    }
                }

                if (!checkConsistency) {
                    return;
                }

                if (Object.keys(checkConsistency).length < 2) {
                    return;
                }

                let errorMessage, minorityLfValues;

                if (checkConsistency["\n"].length > checkConsistency["\r\n"].length) {
                    minorityLfValues = checkConsistency["\r\n"];
                    errorMessage = EXPECTED_LF_MSG;
                    expectedLFChars = "\n";
                } else {
                    minorityLfValues = checkConsistency["\n"];
                    errorMessage = EXPECTED_CRLF_MSG;
                    expectedLFChars = "\r\n";
                }

                const percent = (minorityLfValues.length / sourceCode.lines.length) * 100;

                context.report({
                    node,
                    loc: {
                        line: 1,
                        column: 0
                    },
                    message: `Line endings are mixed, ${percent.toFixed(2)}% of lines are inconsistent`
                });

                for (i = 0; i < minorityLfValues.length; i++) {
                    const line = minorityLfValues[i].line;

                    context.report({
                        node,
                        loc: {
                            line,
                            column: sourceCode.lines[line - 1].length
                        },
                        message: errorMessage,
                        fix: createFix(minorityLfValues[i].range, expectedLFChars)
                    });
                }
            }
        };
    }
};
