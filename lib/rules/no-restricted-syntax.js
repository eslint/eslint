/**
 * @fileoverview Rule to flag use of certain node types
 * @author Burak Yigit Kaya
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow specified syntax",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: {
            type: "array",
            items: [{ type: "string" }],
            uniqueItems: true,
            minItems: 0
        }
    },

    create(context) {
        return context.options.reduce((result, selector) => Object.assign(result, {
            [selector](node) {
                context.report({ node, message: "Using '{{selector}}' is not allowed.", data: { selector } });
            }
        }), {});

    }
};
