/**
 * @fileoverview Rule to flag no-unneeded-ternary
 * @author Gyandeep Singh
 */

"use strict";

const astUtils = require("../ast-utils");

// Operators that always result in a boolean value
const BOOLEAN_OPERATORS = new Set(["==", "===", "!=", "!==", ">", ">=", "<", "<=", "in", "instanceof"]);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow ternary operators when simpler alternatives exist",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    defaultAssignment: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ],

        fixable: "code"
    },

    create(context) {
        const options = context.options[0] || {};
        const defaultAssignment = options.defaultAssignment !== false;
        const sourceCode = context.getSourceCode();

        /**
         * Test if the node is a boolean literal
         * @param {ASTNode} node - The node to report.
         * @returns {boolean} True if the its a boolean literal
         * @private
         */
        function isBooleanLiteral(node) {
            return node.type === "Literal" && typeof node.value === "boolean";
        }

        /**
         * Tests if a given node always evaluates to a boolean value
         * @param {ASTNode} node - An expression node
         * @returns {boolean} True if it is determined that the node will always evaluate to a boolean value
         */
        function isBooleanExpression(node) {
            return node.type === "BinaryExpression" && BOOLEAN_OPERATORS.has(node.operator) ||
                node.type === "UnaryExpression" && node.operator === "!";
        }

        /**
         * Test if the node matches the pattern id ? id : expression
         * @param {ASTNode} node - The ConditionalExpression to check.
         * @returns {boolean} True if the pattern is matched, and false otherwise
         * @private
         */
        function matchesDefaultAssignment(node) {
            return node.test.type === "Identifier" &&
                   node.consequent.type === "Identifier" &&
                   node.test.name === node.consequent.name;
        }

        return {

            ConditionalExpression(node) {
                if (isBooleanLiteral(node.alternate) && isBooleanLiteral(node.consequent)) {
                    context.report({
                        node,
                        loc: node.consequent.loc.start,
                        message: "Unnecessary use of boolean literals in conditional expression.",
                        fix(fixer) {
                            return isBooleanExpression(node.test) ? fixer.replaceText(node, astUtils.getParenthesisedText(sourceCode, node.test)) : null;
                        }
                    });
                } else if (!defaultAssignment && matchesDefaultAssignment(node)) {
                    context.report({
                        node,
                        loc: node.consequent.loc.start,
                        message: "Unnecessary use of conditional expression for default assignment.",
                        fix: fixer => fixer.replaceText(node, `${astUtils.getParenthesisedText(sourceCode, node.test)} || ${astUtils.getParenthesisedText(sourceCode, node.alternate)}`)
                    });
                }
            }
        };
    }
};
