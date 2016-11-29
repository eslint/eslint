/**
 * @fileoverview Rule to flag matching strings
 * @author Jonny Arnold
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow strings that match a given regular expression",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [
            {
                type: "string"
            }
        ]
    },

    create(context) {

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        const pattern = context.options[0] || "^$",
            regex = new RegExp(pattern);

        return {
            Literal(node) {
                if (typeof node.value === "string" && regex.test(node.value)) {
                    context.report(
                        node,
                        "String '{{value}}' is not allowed.",
                        { value: node.value }
                    );
                }
            }
        };

    }
};
