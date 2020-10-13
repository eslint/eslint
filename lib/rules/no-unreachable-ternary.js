/**
 * @fileoverview Disallow unreachable expressions within nested ternary operators
 * @author Che Fisher
 */
"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow unreachable expressions within nested ternary operators",
            category: "Possible Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-unreachable-ternary"
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowDuplicateOrConditions: {
                        type: "boolean",
                        default: true
                    }
                },
                additionalProperties: false
            }
        ],

        messages: {
            duplicateCondition: "Duplicate ternary conditions '{{condition}}'.",
            duplicateInvertedCondition: "Duplicate inverted ternary conditions '{{condition}}'.",
            equivalentOrCondition: "Equivalent ternary OR conditions '{{condition}}'.",
            duplicateOrCondition: "Duplicate ternary OR conditions '{{condition}}'."
        }
    },

    create(context) {
        const options = context.options[0] || {};
        const allowDuplicateOrConditions = options.allowDuplicateOrConditions !== false;
        const sourceCode = context.getSourceCode();
        const ternaryConditions = [];
        const ternaryOrConditions = [];
        const invertedTernaryConditions = [];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Creates a boolean inverse string representation of the condition
         * @param {string} condition The test condition in string form
         * @returns {string} A string representing the inverted test condition
         */
        function invertExpression(condition) {
            return condition[0] === "!" ? condition.slice(1) : `!${condition}`;
        }

        /**
         * Recursively trim any enclosing parens of a condition
         * @param {string} condition The test condition in string form
         * @param {string[]} operators Any not operands collected as the string is traversed
         * @returns {string} The test condition minus any enclosing parens
         */
        function trimParens(condition, operators = []) {
            let index;

            // we collect logical NOT operands as we traverse the string, in case !(!((thing)))
            for (let i = 0; i < condition.length; i++) {
                if (condition[i] === "!") {
                    operators.push(condition[i]);
                } else {
                    index = i; // set index to the first token that is not "!"
                    break;
                }
            }

            // if we encounter an opening and closing parens, trim them and call this method again
            if (condition[index] === "(" && condition[condition.length - 1] === ")") {
                return trimParens(condition.slice(++index, -1), operators);
            }

            // prevent doubling up of operators in case trimParens doesn't recurse
            return condition[0] === "!" && operators.length > 0
                ? condition
                : operators.join("") + condition;
        }

        /**
         * Gets the test condition and necessary operators minus any unneeded enclosing parens
         * @param  {ASTNode} node The node we will extract a basic test condition from
         * @returns {string} The test condition with necessary operators only
         */
        function getBasicTestCondition(node) {
            return trimParens(astUtils.getParenthesisedText(sourceCode, node));
        }

        /**
         * Recursively splits the given node by the logical and (&&) operator.
         * @param {ASTNode} node The node to split.
         * @returns {ASTNode[]} Array of conditions that makes the node when joined by the operator.
         */
        function splitByAnd(node) {
            const operator = "&&";

            if (node.type === "LogicalExpression" && node.operator === operator) {
                return [...splitByAnd(node.left), ...splitByAnd(node.right)];
            }
            return [node];
        }


        /**
         * Splits a string representation of a test expression by the logical (||) operator.
         * @param  {string} condition The test condition in string form
         * @returns {string[]} An array of whitespace trimmed strings
         */
        function splitByOr(condition) {
            return condition.split("||").map(e => e.trim());
        }

        /**
         * Populates the ternary condition arrays
         * @param {string} condition The test condition in string form
         * @returns {void}
         */
        function populateConditions(condition) {
            const splitOrs = splitByOr(condition);

            ternaryConditions.push(condition);
            invertedTernaryConditions.push(invertExpression(condition));

            if (splitOrs.length > 1) {
                ternaryOrConditions.push(splitOrs);
            }
        }

        /**
         * Determines if arrA is a subset of arrB
         * @param  {Array} arrA The array to compare from
         * @param  {Array} arrB The array to compare against
         * @returns {boolean} True if arrB contains all elements of arrA
         */
        function isSubsetOf(arrA, arrB) {
            return arrA.every(a => arrB.some(b => a === b));
        }


        /**
         * Determins if arrA has any of the same elements as arrB
         * @param  {Array} arrA The array to compare from
         * @param  {Array} arrB The array to compare against
         * @returns {type} True if arrA and arrB share any of the same elements
         */
        function containsDuplicates(arrA, arrB) {
            return arrA.some(a => arrB.includes(a));
        }

        /**
         * Determines if a node is a child of an and (&&) test condition
         * @param  {ASTNode} node The node to determine
         * @returns {boolean} True if the node's parent is an and condition
         */
        function isAndChild(node) {
            return node.parent.type === "LogicalExpression" && node.parent.operator === "&&";
        }

        /**
         * Checks if we have already encountered this condition before
         * @param  {string} condition The test conditon in string form
         * @returns {boolean} True if we have already seen this exact condition before
         */
        function isDuplicate(condition) {
            return ternaryConditions.includes(condition);
        }

        /**
         * Checks if we have already encountered this condition in its inverted form
         * @param  {string} condition The test conditon in string form
         * @returns {boolean} True if we have already seen the inverted form of this condition
         */
        function isInvertedDuplicate(condition) {
            return invertedTernaryConditions.includes(condition);
        }

        /**
         * Checks if we have already encountered this OR condition in any of its forms
         * @param  {string} condition The test condition in string form
         * @returns {boolean} True if we have already seen this condition in any of it's equivalent forms
         */
        function isOrEquivalent(condition) {
            const splitOrs = splitByOr(condition);

            for (const priorOrCondition of ternaryOrConditions) {
                if (isSubsetOf(splitOrs, priorOrCondition)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Checks if we have already encountered this OR condition in any of its forms
         * @param  {string} condition The test condition in string form
         * @returns {boolean} True if we have already seen this condition in any of it's equivalent forms
         */
        function isOrDuplicate(condition) {
            const splitOrs = splitByOr(condition);

            for (const priorOrCondition of ternaryOrConditions) {
                if (containsDuplicates(splitOrs, priorOrCondition)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Get the first encountered duplicate OR condition
         * @param  {string} condition The test condition in string form
         * @returns {string} The duplicate, if present
         */
        function getOrDuplicate(condition) {
            const splitOrs = splitByOr(condition);

            for (const priorOrCondition of ternaryOrConditions) {
                const found = splitOrs.map(c => (priorOrCondition.includes(c) ? c : "")).join("");

                if (found) {
                    return found;
                }
            }
            return "";
        }

        /**
         * Reports a node for violating the rule
         * @param  {type} node The node to report
         * @param  {type} messageId The id of the message
         * @param  {type} condition the faulty condition
         * @returns {void}
         */
        function reportNode(node, messageId, condition) {
            context.report({
                node,
                messageId,
                data: { condition }
            });
        }

        return {
            ConditionalExpression(node) {
                const test = node.test;
                const conditionNodes = splitByAnd(test);

                for (const conditionNode of conditionNodes) {
                    const condition = getBasicTestCondition(conditionNode);
                    const invertedCondition = invertExpression(condition);

                    if (isDuplicate(condition) || isInvertedDuplicate(invertedCondition)) {
                        reportNode(node, "duplicateCondition", condition);
                    }
                    if (isInvertedDuplicate(condition) || isDuplicate(invertedCondition)) {
                        reportNode(node, "duplicateInvertedCondition", condition);
                    }
                    if (!isAndChild(conditionNode) && isOrEquivalent(condition)) {
                        reportNode(node, "equivalentOrCondition", condition);
                    } else
                    if (!isAndChild(conditionNode) && !allowDuplicateOrConditions && isOrDuplicate(condition)) {
                        reportNode(node, "duplicateOrCondition", getOrDuplicate(condition));
                    }
                    populateConditions(condition);
                }
            }

        };
    }
};
