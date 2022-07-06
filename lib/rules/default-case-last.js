/**
 * @fileoverview Rule to enforce default clauses in switch statements to be last
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Enforce default clauses in switch statements to be last",
            recommended: false,
            url: "https://eslint.org/docs/rules/default-case-last"
        },

        schema: [],

        messages: {
            notLast: "Default clause should be the last clause."
        }
    },

    create(context) {
        return {
            SwitchStatement(node) {
                const cases = node.cases,
                    indexOfDefault = cases.findIndex(c => c.test === null);

                if (indexOfDefault !== -1 && indexOfDefault !== cases.length - 1) {
                    const defaultClause = cases[indexOfDefault];

                    context.report({ node: defaultClause, messageId: "notLast" });
                }
            }
        };
    }
};
