/**
 * @fileoverview Rule to disallow unsafe optional chaining
 * @author Yeon JuAn
 */

"use strict";

const ARITHMETIC_OPERATORS = ["+", "-", "/", "*", "%", "**", "+=", "-=", "/=", "*=", "%=", "**="];

/**
 * Checks whether a node is an arithmetic expression or not
 * @param {ASTNode} node node to check
 * @returns {boolean} `true` if a node is an arithmetic expression, otherwise `false`
 */
function isArithmeticExpression(node) {
    return (
        node.type === "BinaryExpression" ||
        node.type === "UnaryExpression" ||
        node.type === "AssignmentExpression"
    ) && ARITHMETIC_OPERATORS.includes(node.operator);
}

/**
 * Checks whether a node is a destructuring pattern or not
 * @param {ASTNode} node node to check
 * @returns {boolean} `true` if a node is a destructuring pattern, otherwise `false`
 */
function isDestructuringPattern(node) {
    return node.type === "ObjectPattern" || node.type === "ArrayPattern";
}

/**
 * Checks whether a ChainExpression make an runtime error or not
 * @param {ASTNode} chainExp a ChainExpression node.
 * @returns {boolean} `true` if it can be a runtime error, otherwise `false`
 */
function isPossiblyError(chainExp) {
    const parent = chainExp.parent;

    switch (parent.type) {
        case "CallExpression":
        case "NewExpression":
            return parent.callee === chainExp && parent.parent.type !== "ChainExpression";
        case "MemberExpression":
            return parent.object === chainExp && parent.parent.type !== "ChainExpression";
        case "TaggedTemplateExpression":
            return parent.tag === chainExp;
        case "ClassDeclaration":
            return parent.superClass === chainExp;
        case "VariableDeclarator":
            return isDestructuringPattern(parent.id) && parent.init === chainExp;
        case "AssignmentExpression":
            return isDestructuringPattern(parent.left) && parent.right === chainExp;
        case "SpreadElement":
            return parent.parent.type !== "ObjectExpression";
        case "BinaryExpression":
            return parent.operator === "in" && parent.right === chainExp;
        default:
            return false;
    }
}

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow using unsafe-optional-chaining.",
            category: "Possible Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-unsafe-optional-chaining"
        },
        schema: [{
            type: "object",
            properties: {
                disallowArithmeticOperators: {
                    type: "boolean",
                    default: false
                }
            },
            additionalProperties: false
        }],
        fixable: null,
        messages: {
            unsafeOptionalChain: "Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError.",
            unsafeArithmetic: "Unsafe arithmetic operation on optional chaining. It can result in NaN."
        }
    },

    create(context) {
        const options = context.options[0] || {};
        const disallowArithmeticOperators = (options.disallowArithmeticOperators) || false;

        /**
         * Reports an error for unsafe optional chaining usage.
         * @param {ASTNode} node node to report
         * @returns {void}
         */
        function reportUnsafeOptionalChain(node) {
            context.report({
                messageId: "unsafeOptionalChain",
                node
            });
        }

        /**
         * Reports an error for unsafe arithmetic operations on optional chaining.
         * @param {ASTNode} node node to report
         * @returns {void}
         */
        function reportUnsafeArithmetic(node) {
            context.report({
                messageId: "unsafeArithmetic",
                node
            });
        }

        return {
            ChainExpression(node) {
                if (
                    disallowArithmeticOperators &&
                    node.parent &&
                    isArithmeticExpression(node.parent)
                ) {
                    reportUnsafeArithmetic(node);
                }
                if (isPossiblyError(node)) {
                    reportUnsafeOptionalChain(node);
                }
            }
        };
    }
};
