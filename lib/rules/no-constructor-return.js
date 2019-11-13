/**
 * @fileoverview Rule to disallow returning value from constructor.
 * @author Pig Fang <https://github.com/g-plane>
 */

"use strict";

const astUtils = require("./utils/ast-utils");

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
                const ancestors = context.getAncestors().reverse();
                const ctorIndex = ancestors.findIndex(
                    ancestor => ancestor.type === "MethodDefinition" && ancestor.kind === "constructor"
                );
                const upperFnIndex = ancestors.findIndex(astUtils.isFunction);

                if (~upperFnIndex && upperFnIndex < ctorIndex - 1) {
                    return;
                }

                if (
                    ancestors[2] &&
                    ancestors[2].type === "MethodDefinition" &&
                    ancestors[2].kind === "constructor" ||
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
