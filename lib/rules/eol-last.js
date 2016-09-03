/**
 * @fileoverview Require or disallow file to end with single newline.
 * @author Nodeca Team <https://github.com/nodeca>
 */
"use strict";

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
                enum: ["unix", "windows", "none"]
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
                    linebreakStyle = context.options[0] || "unix",
                    linebreaks = {
                        unix: "\n",
                        windows: "\r\n",
                        none: ""
                    },
                    linebreak = linebreaks[linebreakStyle],
                    lastCharacter = src[src.length - 1],
                    endsWithNewline = lastCharacter === "\n";

                if (linebreakStyle !== "none") {
                    if (!endsWithNewline) {

                        // file is not newline-terminated
                        context.report({
                            node,
                            loc: location,
                            message: "Newline required at end of file but not found.",
                            fix(fixer) {
                                return fixer.insertTextAfterRange([0, src.length], linebreak);
                            }
                        });
                    }
                } else if (endsWithNewline) {

                    // file is newline-terminated
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
