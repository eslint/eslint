/**
 * @fileoverview Rule to disallow empty static blocks.
 * @author Sosuke Suzuki
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
            description: "Disallow empty static blocks",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-empty-static-block"
        },

        schema: [],

        messages: {
            unexpected: "Unexpected empty static block."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            StaticBlock(node) {
                const [blockOpenToken] = sourceCode.getFirstTokens(node, {
                    filter: token => token.type === "Punctuator" && token.value === "{"
                });
                const innerComments =
                    sourceCode.getCommentsInside(node).filter(commentToken => blockOpenToken.range[1] < commentToken.range[0]);

                if (node.body.length === 0 && innerComments.length === 0) {
                    context.report({
                        node,
                        messageId: "unexpected"
                    });
                }
            }
        };
    }
};
