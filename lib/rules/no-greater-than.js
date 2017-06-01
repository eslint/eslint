/**
 * @fileoverview Rule to disallow > and >= operators.
 * @author Christophe Maillard
 */
"use strict";

module.exports = {

    meta: {
        docs: {
            description: "disallow > and >= operators",
            category: "Best Practices",
            recommended: false
        },
        fixable: "code",
        schema: []
    },

    create: context => {

        const sourceCode = context.getSourceCode();

        const OPERATOR_FLIP_MAP = {
            ">": "<",
            ">=": "<="
        };

        /**
        * Returns a string representation of a BinaryExpression node with its sides/operator flipped around (credits to yoda rule).
        * @param {ASTNode} node The BinaryExpression node.
        * @returns {string} A string representation of the node with the sides and operator flipped.
        */
        function getFlippedString(node) {

            const operatorToken = sourceCode.getFirstTokenBetween(node.left, node.right, token => token.value === node.operator);
            const textBeforeOperator = sourceCode.getText().slice(sourceCode.getTokenBefore(operatorToken).range[1], operatorToken.range[0]);
            const textAfterOperator = sourceCode.getText().slice(operatorToken.range[1], sourceCode.getTokenAfter(operatorToken).range[0]);
            const leftText = sourceCode.getText().slice(node.range[0], sourceCode.getTokenBefore(operatorToken).range[1]);
            const rightText = sourceCode.getText().slice(sourceCode.getTokenAfter(operatorToken).range[0], node.range[1]);

            return rightText + textBeforeOperator + OPERATOR_FLIP_MAP[operatorToken.value] + textAfterOperator + leftText;

        }

        return {
            BinaryExpression(node) {

                if (OPERATOR_FLIP_MAP.hasOwnProperty(node.operator)) {
                    context.report({
                        node,
                        message: "Expected {{expectedOperator}} instead of {{actualOperator}}.",
                        data: {
                            actualOperator: node.operator,
                            expectedOperator: OPERATOR_FLIP_MAP[node.operator]
                        },
                        fix: fixer => fixer.replaceText(node, getFlippedString(node))
                    });
                }

            }
        };

    }

};
