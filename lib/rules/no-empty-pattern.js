/**
 * @fileoverview Rule to disallow an empty pattern
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "Disallow empty destructuring patterns",
            recommended: true,
            url: "https://eslint.org/docs/latest/rules/no-empty-pattern"
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowObjectPatternsAsParameters: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unexpected: "Unexpected empty {{type}} pattern."
        }
    },

    create(context) {
        const options = context.options[0] || {},
            allowObjectPatternsAsParameters = options.allowObjectPatternsAsParameters || false;

        return {
            ObjectPattern(node) {

                if (node.properties.length > 0) {
                    return;
                }

                // Allow {} empty object patterns in Arrow functions as parameters when allowObjectPatternsAsParameters is true
                if ((node.parent.type === "ArrowFunctionExpression" || node.parent.type === "FunctionDeclaration" || node.parent.type === "FunctionExpression") &&
                allowObjectPatternsAsParameters === true &&
                node.properties.length === 0) {
                    return;
                }

                // Allow {} = {} empty object patterns in Arrow functions as parameters when allowObjectPatternsAsParameters is true
                if (node.parent.type === "AssignmentPattern" &&
                (node.parent.parent.type === "ArrowFunctionExpression" || node.parent.parent.type === "FunctionDeclaration" || node.parent.parent.type === "FunctionExpression") &&
                node.parent.right.type === "ObjectExpression" &&
                node.parent.right.properties.length === 0 &&
                allowObjectPatternsAsParameters === true &&
                node.properties.length === 0) {
                    return;
                }

                context.report({ node, messageId: "unexpected", data: { type: "object" } });
            },
            ArrayPattern(node) {
                if (node.elements.length === 0) {
                    context.report({ node, messageId: "unexpected", data: { type: "array" } });
                }
            }
        };
    }
};
