/**
 * @fileoverview Disallow duplicate left and right hand ternary expressions
 * @author Che Fisher
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow duplicate left and right hand ternary expressions",
            category: "Possible Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-dupe-ternary-expressions"
        },

        schema: [],

        messages: {
            duplicateExpression: "Identical left and right-hand expressions '{{expression}}'."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const text = sourceCode.getText();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Test if a node has identical alternate and consequent expressions i.e. id ? expression : expression
         * @param  {ASTNode} node The node to report.
         * @returns {boolean} True if expressions are identical
         * @private
         */
        function isDuplicateExpression(node) {
            const left = node.alternate;
            const right = node.consequent;

            return left && right &&
                text.slice(...left.range) === text.slice(...right.range);
        }

        return {
            ConditionalExpression(node) {
                if (isDuplicateExpression(node)) {
                    context.report({
                        node,
                        messageId: "duplicateExpression",
                        data: {
                            expression: node.alternate
                        }
                    });
                }
            }

        };
    }
};
