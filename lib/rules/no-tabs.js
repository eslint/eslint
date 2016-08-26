/**
 * @fileoverview Rule to check for tabs inside a file
 * @author Gyandeep Singh
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
const regex = /\t/g;
const INDENT = "    ";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow tabs in file",
            category: "Stylistic Issues",
            recommended: false
        },
        schema: [],
        fixable: "whitespace"
    },

    create(context) {
        return {
            Program(node) {
                const source = context.getSourceCode();
                let scriptIndex = 0;

                // Split the source code instead of using the `.lines` property, because we must
                // make sure that a linebreak is exactly one character. Dangling \r at the end of a
                // line is of no concern to us.
                source.text.split("\n").forEach((line, index) => {
                    let match;

                    // .exec() returns null when it cannot find more matches
                    while ((match = regex.exec(line))) {
                        const range = [
                            scriptIndex + match.index,
                            scriptIndex + match.index + 1
                        ];
                        const astNode = source.getNodeByRangeIndex(range[0]);
                        const replacement =
                            astNode.type === "Literal" ||
                            astNode.type === "TemplateElement"
                        ? "\\t"
                        : INDENT;

                        context.report({
                            node,
                            loc: {
                                line: index + 1,
                                column: match.index + 1
                            },
                            message: "Unexpected tab character.",

                            fix(fixer) {
                                return fixer.replaceTextRange(range, replacement);
                            }
                        });
                    }

                    // The + 1 is to account for linebreaks
                    scriptIndex += line.length + 1;
                });
            }
        };
    }
};
