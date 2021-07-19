/**
 * @fileoverview Rule to flag when return statement contains assignment
 * @author Ilya Volodin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const SENTINEL_TYPE = /^(?:[a-zA-Z]+?Statement|ArrowFunctionExpression|FunctionExpression|ClassExpression)$/u;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow assignment operators in `return` statements",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-return-assign"
        },

        schema: [
            {
                enum: ["except-parens", "always"]
            },
            {
                type: "object",
                properties: {
                    ignoreSideEffects: { type: "boolean" }
                }
            }
        ],

        messages: {
            returnAssignment: "Return statement should not contain assignment.",
            arrowAssignment: "Arrow function should not return assignment.",
            sideEffectAssignment: "Sequence expression should not contain side effect assignments."
        }
    },

    create(context) {
        const always = (context.options[0] || "except-parens") !== "except-parens";
        const ignoreSideEffects = Object.assign({ ignoreSideEffects: false }, context.options[1]).ignoreSideEffects;
        const sourceCode = context.getSourceCode();

        return {
            AssignmentExpression(node) {
                if (!always && astUtils.isParenthesised(sourceCode, node)) {
                    return;
                }

                let currentChild = node;
                let parent = currentChild.parent;
                let sideEffectParent;

                // Find ReturnStatement, ArrowFunctionExpression, or SequenceExpression in ancestors.
                while (parent && !SENTINEL_TYPE.test(parent.type)) {

                    // Ignore all but the last expression of a SequenceExpression
                    if (parent.type === "SequenceExpression" &&
                        parent.expressions[parent.expressions.length - 1] !== currentChild
                    ) {
                        if (ignoreSideEffects) {
                            return;
                        }
                        sideEffectParent = parent;
                    }
                    currentChild = parent;
                    parent = parent.parent;
                }

                // Reports.
                if (sideEffectParent &&
                    parent &&
                    ["ReturnStatement", "ArrowFunctionExpression"].includes(parent.type)
                ) {
                    context.report({
                        node: sideEffectParent,
                        messageId: "sideEffectAssignment"
                    });
                } else if (parent && parent.type === "ReturnStatement") {
                    context.report({
                        node: parent,
                        messageId: "returnAssignment"
                    });
                } else if (parent && parent.type === "ArrowFunctionExpression" && parent.body === currentChild) {
                    context.report({
                        node: parent,
                        messageId: "arrowAssignment"
                    });
                }
            }
        };
    }
};
