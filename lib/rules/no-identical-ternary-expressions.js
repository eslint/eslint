/**
 * @fileoverview Rule to flag ternary operators that have identical left and right expressions
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
            description: "disallow ternary operators with identical left and right hand expressions",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-identical-ternary-expressions"
        },

        schema: [],

        messages: {
            expressions: "Identical left and right hand expressions '{{expression}}'.",
            conditions: "Identical test conditions encountered '{{condition}}'."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const conditions = [];

        /**
         * Checks if the consequent and alternate expressions are identical, stripping out all whitespace first for non literals
         *
         * @param  {string} first a string representation of an expression
         * @param  {string} second a string representation of an expression
         * @param  {boolean} literal true if node type is a string literal
         * @returns {boolean} True if the expressions are logically identical
         * @private
         */
        function identicalExpressions(first, second, literal) {
            if (literal) {
                return first === second;
            }
            return first.replace(/\s/gu, "") === second.replace(/\s/gu, "");
        }

        /**
         * Checks if there are identical test conditions used within a chained ternary operator
         *
         * @param  {ASTNode} node the current node being checked
         * @returns {boolean} True if there are duplicate/identical test conditions
         * @private
         */
        function identicalConditions(node) {
            const testCondition = sourceCode.getText(node.test);

            conditions.push(testCondition);
            if (node.parent.type === "ConditionalExpression") {
                return conditions.some((value, i) => conditions.indexOf(value) !== i);
            }
            return false;
        }

        /**
         * Determins if a given node has identical left and right hand expressions or duplicate test conditions
         * @param  {ASTNode} node the node to check
         * @returns {void}
         * @private
         */
        function checkTernary(node) {
            const leftExpression = sourceCode.getText(node.consequent);
            const rightExpression = sourceCode.getText(node.alternate);
            const literal = node.consequent.type === "Literal" || node.alternate.type === "Literal";

            if (identicalExpressions(leftExpression, rightExpression, literal)) {
                context.report({
                    node,
                    loc: node.alternate.loc.start,
                    messageId: "expressions",
                    data: { expression: leftExpression }
                });
            }

            if (identicalConditions(node)) {
                context.report({
                    node,
                    loc: node.test.loc.start,
                    messageId: "conditions",
                    data: { condition: sourceCode.getText(node.test) }
                });
            }
        }

        return {
            ConditionalExpression: checkTernary
        };
    }
};
