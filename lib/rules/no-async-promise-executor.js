/**
 * @fileoverview disallow using an async function as a Promise executor
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow using an async function as a Promise executor",
            category: "Possible Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-async-promise-executor"
        },
        fixable: null,
        schema: []
    },

    create(context) {
        return {
            "NewExpression[callee.name='Promise'][arguments.0.async=true]"(node) {
                context.report({
                    node: context.getSourceCode().getFirstToken(node.arguments[0], token => token.value === "async"),
                    message: "Promise executor functions should not be async."
                });
            }
        };
    }
};
