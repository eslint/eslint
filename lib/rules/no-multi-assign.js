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
            ignoreNonDeclaration: false
        };
        const selectors = [
            "VariableDeclarator > AssignmentExpression.init",
            "PropertyDefinition > AssignmentExpression.value"
        ];

        if (!options.ignoreNonDeclaration) {
            selectors.push("AssignmentExpression > AssignmentExpression.right");
        }

        return {
            [selectors](node) {
                context.report({
                    node,
                    messageId: "unexpectedChain"
                });
            }
        };

    }
};
