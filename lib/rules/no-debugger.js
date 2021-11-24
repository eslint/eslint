/**
 * @fileoverview Rule to flag use of a debugger statement
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow the use of `debugger`",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-debugger"
        },

        fixable: null,
        schema: [],

        messages: {
            unexpected: "Unexpected 'debugger' statement."
        }
    },

    create(context) {

        return {
            DebuggerStatement(node) {
                context.report({
                    node,
                    messageId: "unexpected"
                });
            }
        };

    }
};
