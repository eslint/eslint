/**
 * @fileoverview Rule to disallow an empty pattern
 * @author Alberto Rodríguez
 */
"use strict";

const astUtils = require("./utils/ast-utils");

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

                // Allow {} and {} = {} empty object patterns as parameters when allowObjectPatternsAsParameters is true
                if (
                    allowObjectPatternsAsParameters &&
                    (
                        astUtils.isFunction(node.parent) ||
                        (
                            node.parent.type === "AssignmentPattern" &&
                            astUtils.isFunction(node.parent.parent) &&
                            node.parent.right.type === "ObjectExpression" &&
                            node.parent.right.properties.length === 0
                        )
                    )
                ) {
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
