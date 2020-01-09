/**
 * @fileoverview Rule to check use of chained assignment expressions
 * @author Stewart Rand
 */

"use strict";


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow use of chained assignment expressions",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-multi-assign"
        },

        schema: [],

        messages: {
            unexpectedChain: "Unexpected chained assignment."
        }
    },

    create(context) {

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            AssignmentExpression(node) {
                if (["AssignmentExpression", "VariableDeclarator"].indexOf(node.parent.type) !== -1) {
                    context.report({
                        node,
                        messageId: "unexpectedChain"
                    });
                }
            }
        };

    }
};
