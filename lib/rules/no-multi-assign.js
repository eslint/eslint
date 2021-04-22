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

        schema: [{
            type: "object",
            properties: {
                ignoreNonDeclaration: {
                    type: "boolean",
                    default: false
                },
                ignoreOperators: {
                    type: "array",
                    items: { enum: ["=", "&=", "|=", "^=", "<<=", ">>=", ">>>=", "+=", "-=", "*=", "/=", "%=", "**=", "&&=", "||=", "??="] },
                    uniqueItems: true,
                    default: []
                }
            },
            additionalProperties: false
        }],

        messages: {
            unexpectedChain: "Unexpected chained assignment."
        }
    },

    create(context) {

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------
        const options = context.options[0] || {
            ignoreNonDeclaration: false,
            ignoreOperators: []
        };
        const targetParent = options.ignoreNonDeclaration ? ["VariableDeclarator"] : ["AssignmentExpression", "VariableDeclarator"];
        const ignoreOperators = options.ignoreOperators || [];

        return {
            AssignmentExpression(node) {
                if (targetParent.indexOf(node.parent.type) !== -1 && ignoreOperators.indexOf(node.operator) === -1) {
                    context.report({
                        node,
                        messageId: "unexpectedChain"
                    });
                }
            }
        };

    }
};
