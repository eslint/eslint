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
                if (node.body.length === 0) {
                    const closingBrace = sourceCode.getLastToken(node);

                    if (sourceCode.getCommentsBefore(closingBrace).length === 0) {
                        context.report({
                            node,
                            messageId: "unexpected"
                        });
                    }
                }
            }
        };
    }
};
