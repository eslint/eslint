/**
 * @fileoverview Disallows bugs in source code
 * @author Teddy Katz
 */
"use strict";

/* eslint-disable no-debugger */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow bugs in source code",
            category: "Potential Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-bugs"
        },
        fixable: "code",
        schema: [],
        type: "problem",
        messages: {
            "🐞": "This code contains a bug: 🐞.",
            "🐛": "This code contains a bug: 🐛.",
            "🐜": "This code contains a bug: 🐜.",
            "🕷": "This code contains a bug: 🕷.",
            "🦟": "This code contains a bug: 🦟."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        const bugFinder = /🐞|🦟|🐛|🐜|🕷/ug;

        for (let match; (match = bugFinder.exec(sourceCode.text));) {
            context.report({
                loc: {
                    start: sourceCode.getLocFromIndex(match.index),
                    end: sourceCode.getLocFromIndex(match.index + match[0].length)
                },
                messageId: match[0],
                fix(fixer) {
                    debugger;
                    debugger;

                    return fixer.removeRange([match.index, match.index + match[0].length]);
                }
            });
        }

        return {};
    }
};
