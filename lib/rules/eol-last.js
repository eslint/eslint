/**
 * @fileoverview Require or disallow file to end with single newline.
 * @author Nodeca Team <https://github.com/nodeca>
 * @author kdex <https://github.com/kdex>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const lodash = require("lodash");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce at least one newline (or absence thereof) at the end of files",
            category: "Stylistic Issues",
            recommended: false
        },
        fixable: "whitespace",
        schema: [
            {
                enum: ["always", "never", "unix", "windows"]
            },
            {
                type: "object",
                properties: {
                    style: {
                        type: "string"
                    }
                },
                required: ["style"],
                additionalProperties: false
            }
        ]
    },
    create(context) {

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            Program: function checkBadEOF(node) {
                const sourceCode = context.getSourceCode(),
                    src = sourceCode.getText(),
                    location = {
                        column: 1,
                        line: sourceCode.lines.length
                    },
                    linebreaks = {
                        unix: "\n",
                        windows: "\r\n"
                    },
                    endsWithNewline = lodash.endsWith(src, "\n");

                let useEOLs = context.options[0] || "always",
                    options = context.options[1] || { style: "unix" },
                    linebreak = "";

                // Normalize arguments
                if (!context.options[1]) {
                    if (useEOLs !== "always" && useEOLs !== "never") {

                        // Deprecated arguments; user has provided style only
                        options = {
                            style: useEOLs
                        };
                        useEOLs = "always";
                    }
                }
                if (useEOLs === "always") {
                    linebreak = linebreaks[options.style];
                    if (!endsWithNewline) {

                        // File is not newline-terminated, but should be
                        context.report({
                            node,
                            loc: location,
                            message: "Newline required at end of file but not found.",
                            fix(fixer) {
                                return fixer.insertTextAfterRange([0, src.length], linebreak);
                            }
                        });
                    } else {

                        // File is newline-terminated, but it might be the wrong EOL
                        if (linebreak === linebreaks.windows) {

                            // For CRLF, it's enough to check if the file ends with CRLF
                            if (!lodash.endsWith(src, linebreaks.windows)) {
                                context.report({
                                    node,
                                    loc: location,
                                    message: "Expected a Windows newline and instead found a Unix newline.",
                                    fix(fixer) {
                                        const finalEOL = /(?:\n)$/,
                                            match = finalEOL.exec(sourceCode.text),
                                            start = match.index,
                                            end = sourceCode.text.length;

                                        return fixer.replaceTextRange([start, end], linebreak);
                                    }
                                });
                            }
                        } else if (linebreak === linebreaks.unix) {

                            // For LF, we must instead check that there's no CRLF.
                            // This is necessary since both CRLF and LF end with LF.
                            if (lodash.endsWith(src, linebreaks.windows)) {
                                context.report({
                                    node,
                                    loc: location,
                                    message: "Expected a Unix newline and instead found a Windows newline.",
                                    fix(fixer) {
                                        const finalEOL = /(?:\r\n)$/,
                                            match = finalEOL.exec(sourceCode.text),
                                            start = match.index,
                                            end = sourceCode.text.length;

                                        return fixer.replaceTextRange([start, end], linebreak);
                                    }
                                });
                            }
                        }
                    }
                } else if (useEOLs === "never" && endsWithNewline) {

                    // File is newline-terminated, but shouldn't be
                    context.report({
                        node,
                        loc: location,
                        message: "Newline not allowed at end of file.",
                        fix(fixer) {
                            const finalEOLs = /(?:\r?\n)+$/,
                                match = finalEOLs.exec(sourceCode.text),
                                start = match.index,
                                end = sourceCode.text.length;

                            return fixer.replaceTextRange([start, end], "");
                        }
                    });
                }
            }
        };
    }
};
