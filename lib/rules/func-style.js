/**
 * @fileoverview Rule to enforce a particular function style
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        defaultOptions: ["expression", {}],

        docs: {
            description: "Enforce the consistent use of either `function` declarations or expressions",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/func-style"
        },

        schema: [
            {
                enum: ["declaration", "expression"]
            },
            {
                type: "object",
                properties: {
                    allowArrowFunctions: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            expression: "Expected a function expression.",
            declaration: "Expected a function declaration."
        }
    },

    create(context) {
        const [style, { allowArrowFunctions }] = context.options;
        const enforceDeclarations = (style === "declaration");
        const stack = [];

        const nodesToCheck = {
            FunctionDeclaration(node) {
                stack.push(false);

                if (!enforceDeclarations && node.parent.type !== "ExportDefaultDeclaration") {
                    context.report({ node, messageId: "expression" });
                }
            },
            "FunctionDeclaration:exit"() {
                stack.pop();
            },

            FunctionExpression(node) {
                stack.push(false);

                if (enforceDeclarations && node.parent.type === "VariableDeclarator") {
                    context.report({ node: node.parent, messageId: "declaration" });
                }
            },
            "FunctionExpression:exit"() {
                stack.pop();
            },

            ThisExpression() {
                if (stack.length > 0) {
                    stack[stack.length - 1] = true;
                }
            }
        };

        if (!allowArrowFunctions) {
            nodesToCheck.ArrowFunctionExpression = function() {
                stack.push(false);
            };

            nodesToCheck["ArrowFunctionExpression:exit"] = function(node) {
                const hasThisExpr = stack.pop();

                if (enforceDeclarations && !hasThisExpr && node.parent.type === "VariableDeclarator") {
                    context.report({ node: node.parent, messageId: "declaration" });
                }
            };
        }

        return nodesToCheck;

    }
};
