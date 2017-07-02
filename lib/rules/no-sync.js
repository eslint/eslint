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
        docs: {
            description: "disallow synchronous methods",
            category: "Node.js and CommonJS",
            recommended: false
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
        const allowAtRootLevel = context.options[0] ? context.options[0].allowAtRootLevel : false;
        const stackOfSyncExpressions = [];
        let setOfSyncExpressions = new Set();

        /**
         * push Sync Expression sets and track Sync Expressions in a new set
         *
         * @returns {void}
         */
        function trackSyncExpression() {
            if (allowAtRootLevel) {
                stackOfSyncExpressions.push(setOfSyncExpressions);
                setOfSyncExpressions = new Set();
            }
        }

        /**
         * Report if the Sync Expression is not in the root level
         *
         * @param {ASTNode} node the FunctionDeclaration/Expression node
         * @returns {void}
         */
        function reportIfSyncInFunction(node) {
            if (allowAtRootLevel) {
                if (setOfSyncExpressions.size > 0) {
                    setOfSyncExpressions.forEach(syncExpression => {
                        context.report({
                            node,
                            message: "Unexpected sync method: '{{propertyName}}'.",
                            data: {
                                propertyName: syncExpression.property.name
                            }
                        });
                    });

                }
                setOfSyncExpressions.clear();
                setOfSyncExpressions = stackOfSyncExpressions.pop();
            }
        }

        return {
            "MemberExpression[property.name=/.*Sync$/]"(node) {
                if (allowAtRootLevel) {
                    setOfSyncExpressions.add(node);
                } else {
                    context.report({
                        node,
                        message: "Unexpected sync method: '{{propertyName}}'.",
                        data: {
                            propertyName: node.property.name
                        }
                    });
                }
            },
            FunctionDeclaration: trackSyncExpression,
            "FunctionDeclaration:exit": reportIfSyncInFunction,
            FunctionExpression: trackSyncExpression,
            "FunctionExpression:exit": reportIfSyncInFunction
        };

    }
};
