/**
 * @fileoverview Rule to disallow empty static blocks.
 * @author Sosuke Suzuki
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

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
                const innerComments = sourceCode.getTokens(node, {
                    includeComments: true,
                    filter: astUtils.isCommentToken
                });

                if (node.body.length === 0 && innerComments.length === 0) {
                    context.report({
                        node,
                        loc: node.loc,
                        messageId: "unexpected"
                    });
                }
            }
        };
    }
};
