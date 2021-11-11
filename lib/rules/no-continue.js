/**
 * @fileoverview Rule to flag use of continue statement
 * @author Borislav Zhivkov
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow `continue` statements",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-continue"
        },

        schema: [],

        messages: {
            unexpected: "Unexpected use of continue statement."
        }
    },

    create(context) {

        return {
            ContinueStatement(node) {
                context.report({ node, messageId: "unexpected" });
            }
        };

    }
};
