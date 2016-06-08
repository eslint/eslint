/**
 * @fileoverview Rule to require braces in arrow function body.
 * @author Alberto Rodríguez
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require braces around arrow function bodies",
            category: "ECMAScript 6",
            recommended: false
        },

        schema: [
            {
                enum: ["always", "as-needed", "except-object"]
            }
        ]
    },

    create: function(context) {
        var always = context.options[0] === "always";
        var asNeeded = !context.options[0] || context.options[0] === "as-needed";
        var exceptObject = context.options[0] === "except-object";

        /**
         * Determines whether a arrow function body needs braces
         * @param {ASTNode} node The arrow function node.
         * @returns {void}
         */
        function validate(node) {
            var arrowBody = node.body;

            if (arrowBody.type === "BlockStatement") {
                var blockBody = arrowBody.body;

                if (blockBody.length !== 1) {
                    return;
                }

                if (blockBody[0].type === "ReturnStatement") {
                    if (blockBody[0].argument.type !== "ObjectExpression") {
                        if (exceptObject || asNeeded) {
                            context.report({
                                node: node,
                                loc: arrowBody.loc.start,
                                message: "Unexpected block statement surrounding arrow body."
                            });
                        } else if (exceptObject) {
                            context.report({
                                node: node,
                                loc: arrowBody.loc.start,
                                message: "Expected block statement surrounding arrow body returning object literal."
                            });
                        }
                    }
                }
            } else {
                if (always) {
                    context.report({
                        node: node,
                        loc: arrowBody.loc.start,
                        message: "Expected block statement surrounding arrow body."
                    });
                } else if (exceptObject && node.body.type === "ObjectExpression") {
                    context.report({
                        node: node,
                        loc: arrowBody.loc.start,
                        message: "Unexpected object literal returned from blockless arrow body."
                    });
                }
            }
        }

        return {
            ArrowFunctionExpression: validate
        };
    }
};
