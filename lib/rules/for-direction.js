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

                /**
                 * check UpdateExpression add/sub the counter
                 * @param {ASTNode} update UpdateExpression to check
                 * @param {string} counter variable name to check
                 * @returns {int} if add return 1, if sub return -1, if nochange, return 0
                 */
                function updateDirection(update, counter) {
                    if (update.argument.name === counter) {
                        if (update.operator === "++") {
                            return 1;
                        }
                        if (update.operator === "--") {
                            return -1;
                        }
                    }
                    return 0;
                }

                /**
                 * check AssignmentExpression add/sub the counter
                 * @param {ASTNode} update AssignmentExpression to check
                 * @param {string} counter variable name to check
                 * @returns {int} if add return 1, if sub return -1, if nochange, return 0
                 */
                function assignmentDirection(update, counter) {
                    if (update.left.name === counter && update.right.type === "Literal") {
                        if (update.operator === "+=") {
                            return 1;
                        }
                        if (update.operator === "-=") {
                            return -1;
                        }
                    }
                    return 0;
                }

                if (node.test && node.test.type === "BinaryExpression" && node.update) {
                    const counter = node.test.left.name;
                    const operator = node.test.operator;
                    const update = node.update;

                    if (operator === "<" || operator === "<=") {

                        // report error if update sub the counter (--, -=)
                        if (update.type === "UpdateExpression" && updateDirection(update, counter) < 0) {
                            report();
                        }

                        if (update.type === "AssignmentExpression" && assignmentDirection(update, counter) < 0) {
                            report();
                        }
                    } else if (operator === ">" || operator === ">=") {

                        // report error if update add the counter (++, +=)
                        if (update.type === "UpdateExpression" && updateDirection(update, counter) > 0) {
                            report();
                        }

                        if (update.type === "AssignmentExpression" && assignmentDirection(update, counter) > 0) {
                            report();
                        }
                    }
                }
            }
        };
    }
};
