/**
 * @fileoverview Rule to flag use of certain node types
 * @author Burak Yigit Kaya
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const esquery = require("esquery");

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
        return {
            Program(ast) {
                context.options.forEach(selector => {
                    esquery(ast, selector).forEach(matchedNode => {
                        context.report({
                            node: matchedNode,
                            message: "Using '{{selector}}' is not allowed.",
                            data: { selector }
                        });
                    });
                });
            }
        };
    }
};
