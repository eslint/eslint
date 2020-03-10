/**
 * @fileoverview Rule to flag use of unary increment and decrement operators.
 * @author Ian Christian Myers
 * @author Brody McKee (github.com/mrmckeb)
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determines whether the given node is the update node of a `ForStatement`.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is `ForStatement` update.
 */
function isForStatementUpdate(node) {
    const parent = node.parent;

    return parent.type === "ForStatement" && parent.update === node;
}

/**
 * Determines whether the given node is considered to be a for loop "afterthought" by the logic of this rule.
 * In particular, if it is the update node of a `ForStatement`, or an operand of a sequence expression that is the update node.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} `true` if the node is a for loop afterthought.
 */
function isForLoopAfterthought(node) {
    const parent = node.parent;

    return isForStatementUpdate(node) ||
        parent.type === "SequenceExpression" && isForStatementUpdate(parent);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow the unary operators `++` and `--`",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-plusplus"
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowForLoopAfterthoughts: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            unexpectedUnaryOp: "Unary operator '{{operator}}' used."
        }
    },

    create(context) {

        const config = context.options[0];
        let allowForLoopAfterthoughts = false;

        if (typeof config === "object") {
            allowForLoopAfterthoughts = config.allowForLoopAfterthoughts === true;
        }

        return {

            UpdateExpression(node) {
                if (allowForLoopAfterthoughts && isForLoopAfterthought(node)) {
                    return;
                }

                context.report({
                    node,
                    messageId: "unexpectedUnaryOp",
                    data: {
                        operator: node.operator
                    }
                });
            }

        };

    }
};
