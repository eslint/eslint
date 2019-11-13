/**
 * @fileoverview Rule to disallow returning value from constructor.
 * @author Pig Fang <https://github.com/g-plane>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow returning value from constructor",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-constructor-return"
        },

        schema: {},

        fixable: null,

        messages: {
            unexpected: "Unexpected return statement in constructor."
        }
    },

    create(context) {
        return {
            "MethodDefinition[kind='constructor'] ReturnStatement"(node) {
                const ancestors = context.getAncestors();
                const ancestor = ancestors[ancestors.length - 3];

                if (
                    ancestor &&
                    ancestor.type === "MethodDefinition" &&
                    ancestor.kind === "constructor" ||
                    node.argument
                ) {
                    context.report({
                        node,
                        messageId: "unexpected"
                    });
                }
            }
        };
    }
};
