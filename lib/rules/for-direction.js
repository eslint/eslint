/**
 * @fileoverview enforce "for" loop update clause moving the counter in the right direction.(for-direction)
 * @author Aladdin-ADD<hh_2013@foxmail.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce \"for\" loop update clause moving the counter in the right direction.",
            category: "Possible Errors",
            recommended: false
        },
        fixable: null,
        schema: []
    },

    create(context) {

        return {
            ForStatement(node) {

                /**
                 * report an error.
                 * @returns {void}
                 */
                function report() {
                    context.report({
                        node,
                        message: "enforce \"for\" loop update clause moving the counter in the right direction."
                    });
                }

                if (node.test && node.test.type === "BinaryExpression" && node.update) {
                    const counter = node.test.left.name;
                    const operator = node.test.operator;
                    const update = node.update;

                    if (operator === "<" || operator === "<=") {

                        // report error if update sub the counter (--, -=)
                        if (update.type === "UpdateExpression" && update.argument.name === counter && update.operator === "--") {
                            report();
                        }

                        if (update.type === "AssignmentExpression" && update.left.name === counter && update.operator === "-=") {
                            report();
                        }
                    } else if (operator === ">" || operator === ">=") {

                        // report error if update add the counter (++, +=)
                        if (update.type === "UpdateExpression" && update.argument.name === counter && update.operator === "++") {
                            report();
                        }

                        if (update.type === "AssignmentExpression" && update.left.name === counter && update.operator === "+=") {
                            report();
                        }
                    }
                }
            }
        };
    }
};
