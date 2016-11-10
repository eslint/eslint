/**
 * @fileoverview Disallows unnecessary `return await`
 * @author Jordan Harband
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const message = "Redundant use of `await` on a return value.";

module.exports = {
    meta: {
        docs: {
            description: "disallow unnecessary `return await`",
            category: "Best Practices",
            recommended: false // TODO: set to true
        },
        fixable: false,
        schema: [
        ]
    },

    create(context) {
        return {
            ArrowFunctionExpression(node) {
                if (node.async && node.body.type === "AwaitExpression") {
                    const sourceCode = context.getSourceCode();
                    const loc = node.body.loc;

                    context.report({
                        node: sourceCode.getFirstToken(node.body),
                        loc,
                        message,
                    });
                }
            },
            ReturnStatement(node) {
                const argument = node.argument;

                if (argument && argument.type === "AwaitExpression") {
                    const sourceCode = context.getSourceCode();
                    const loc = argument.loc;

                    context.report({
                        node: sourceCode.getFirstToken(argument),
                        loc,
                        message,
                    });
                }
            },
        };
    }
};
