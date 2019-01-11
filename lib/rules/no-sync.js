/**
 * @fileoverview Rule to check for properties whose identifier ends with the string Sync
 * @author Matt DuVall<http://mattduvall.com/>
 */

/* jshint node:true */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow synchronous methods",
            category: "Node.js and CommonJS",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-sync"
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowAtRootLevel: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        const assignmentExpressionSelector = "AssignmentExpression[right.type=MemberExpression][right.property.name=/.*Sync$/]";
        const variableDeclarationSelector = "VariableDeclaration MemberExpression[property.name=/.*Sync$/]";
        const callExpressionSelector = "CallExpression[callee.property.name=/.*Sync$/]";
        const completeSelector = `:matches(${assignmentExpressionSelector},${variableDeclarationSelector}, ${callExpressionSelector}`;

        const selector = context.options[0] && context.options[0].allowAtRootLevel
            ? `:function ${completeSelector}`
            : completeSelector;

        return {
            [selector](node) {
                context.report({
                    node,
                    message: "Unexpected sync method: '{{propertyName}}'.",
                    data: {
                        propertyName: node.property.name
                    }
                });
            }
        };

    }
};
