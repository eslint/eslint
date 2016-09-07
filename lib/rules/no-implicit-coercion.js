/**
 * @fileoverview A rule to disallow the type conversions with shorter notations.
 * @author Toru Nagashima
 */

"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const INDEX_OF_PATTERN = /^(?:i|lastI)ndexOf$/;
const ALLOWABLE_OPERATORS = ["~", "!!", "+", "*"];

/**
 * Parses and normalizes an option object.
 * @param {Object} options - An option object to parse.
 * @returns {Object} The parsed and normalized option object.
 */
function parseOptions(options) {
    options = options || {};
    return {
        boolean: "boolean" in options ? Boolean(options.boolean) : true,
        number: "number" in options ? Boolean(options.number) : true,
        string: "string" in options ? Boolean(options.string) : true,
        allow: options.allow || []
    };
}

/**
 * Checks whether or not a node is a double logical nigating.
 * @param {ASTNode} node - An UnaryExpression node to check.
 * @returns {boolean} Whether or not the node is a double logical nigating.
 */
function isDoubleLogicalNegating(node) {
    return (
        node.operator === "!" &&
        node.argument.type === "UnaryExpression" &&
        node.argument.operator === "!"
    );
}

/**
 * Checks whether or not a node is a binary negating of `.indexOf()` method calling.
 * @param {ASTNode} node - An UnaryExpression node to check.
 * @returns {boolean} Whether or not the node is a binary negating of `.indexOf()` method calling.
 */
function isBinaryNegatingOfIndexOf(node) {
    return (
        node.operator === "~" &&
        node.argument.type === "CallExpression" &&
        node.argument.callee.type === "MemberExpression" &&
        node.argument.callee.property.type === "Identifier" &&
        INDEX_OF_PATTERN.test(node.argument.callee.property.name)
    );
}

/**
 * Checks whether or not a node is a multiplying by one.
 * @param {BinaryExpression} node - A BinaryExpression node to check.
 * @returns {boolean} Whether or not the node is a multiplying by one.
 */
function isMultiplyByOne(node) {
    return node.operator === "*" && (
        node.left.type === "Literal" && node.left.value === 1 ||
        node.right.type === "Literal" && node.right.value === 1
    );
}

/**
 * Checks whether the result of a node is numeric or not
 * @param {ASTNode} node The node to test
 * @returns {boolean} true if the node is a number literal or a `Number()`, `parseInt` or `parseFloat` call
 */
function isNumeric(node) {
    return (
        node.type === "Literal" && typeof node.value === "number" ||
        node.type === "CallExpression" && (
            node.callee.name === "Number" ||
            node.callee.name === "parseInt" ||
            node.callee.name === "parseFloat"
        )
    );
}

/**
 * Returns the first non-numeric operand in a BinaryExpression. Designed to be
 * used from bottom to up since it walks up the BinaryExpression trees using
 * node.parent to find the result.
 * @param {BinaryExpression} node The BinaryExpression node to be walked up on
 * @returns {ASTNode|null} The first non-numeric item in the BinaryExpression tree or null
 */
function getNonNumericOperand(node) {
    const left = node.left,
        right = node.right;

    if (right.type !== "BinaryExpression" && !isNumeric(right)) {
        return right;
    }

    if (left.type !== "BinaryExpression" && !isNumeric(left)) {
        return left;
    }

    return null;
}

/**
 * Checks whether a node is a string literal or not.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} Whether or not the passed in node is a
 * string literal or not.
 */
function isStringLiteral(node) {
    return astUtils.isStringLiteral(node) && node.type !== "TemplateLiteral";
}

/**
 * Checks whether a node is an empty string literal or not.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} Whether or not the passed in node is an
 * empty string literal or not.
 */
function isEmptyString(node) {
    return isStringLiteral(node) && node.value === "";
}

/**
 * Checks whether or not a node is a concatenating with an empty string.
 * @param {ASTNode} node - A BinaryExpression node to check.
 * @returns {boolean} Whether or not the node is a concatenating with an empty string.
 */
function isConcatWithEmptyString(node) {
    return node.operator === "+" && (
        (isEmptyString(node.left) && !isStringLiteral(node.right)) ||
        (isEmptyString(node.right) && !isStringLiteral(node.left))
    );
}

/**
 * Checks whether or not a node is appended with an empty string.
 * @param {ASTNode} node - An AssignmentExpression node to check.
 * @returns {boolean} Whether or not the node is appended with an empty string.
 */
function isAppendEmptyString(node) {
    return node.operator === "+=" && isEmptyString(node.right);
}

/**
 * Returns the operand that is not an empty string from a flagged BinaryExpression.
 * @param {ASTNode} node - The flagged BinaryExpression node to check.
 * @returns {ASTNode} The operand that is not an empty string from a flagged BinaryExpression.
 */
function getNonEmptyOperand(node) {
    return isEmptyString(node.left) ? node.right : node.left;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow shorthand type conversions",
            category: "Best Practices",
            recommended: false
        },

        schema: [{
            type: "object",
            properties: {
                boolean: {
                    type: "boolean"
                },
                number: {
                    type: "boolean"
                },
                string: {
                    type: "boolean"
                },
                allow: {
                    type: "array",
                    items: {
                        enum: ALLOWABLE_OPERATORS
                    },
                    uniqueItems: true
                }
            },
            additionalProperties: false
        }]
    },

    create(context) {
        const options = parseOptions(context.options[0]);
        const sourceCode = context.getSourceCode();

        return {
            UnaryExpression(node) {
                let operatorAllowed;

                // !!foo
                operatorAllowed = options.allow.indexOf("!!") >= 0;
                if (!operatorAllowed && options.boolean && isDoubleLogicalNegating(node)) {
                    context.report(
                        node,
                        "use `Boolean({{code}})` instead.", {
                            code: sourceCode.getText(node.argument.argument)
                        });
                }

                // ~foo.indexOf(bar)
                operatorAllowed = options.allow.indexOf("~") >= 0;
                if (!operatorAllowed && options.boolean && isBinaryNegatingOfIndexOf(node)) {
                    context.report(
                        node,
                        "use `{{code}} !== -1` instead.", {
                            code: sourceCode.getText(node.argument)
                        });
                }

                // +foo
                operatorAllowed = options.allow.indexOf("+") >= 0;
                if (!operatorAllowed && options.number && node.operator === "+" && !isNumeric(node.argument)) {
                    context.report(
                        node,
                        "use `Number({{code}})` instead.", {
                            code: sourceCode.getText(node.argument)
                        });
                }
            },

            // Use `:exit` to prevent double reporting
            "BinaryExpression:exit"(node) {
                let operatorAllowed;

                // 1 * foo
                operatorAllowed = options.allow.indexOf("*") >= 0;
                const nonNumericOperand = !operatorAllowed && options.number && isMultiplyByOne(node) && getNonNumericOperand(node);

                if (nonNumericOperand) {
                    context.report(
                        node,
                        "use `Number({{code}})` instead.", {
                            code: sourceCode.getText(nonNumericOperand)
                        });
                }

                // "" + foo
                operatorAllowed = options.allow.indexOf("+") >= 0;
                if (!operatorAllowed && options.string && isConcatWithEmptyString(node)) {
                    context.report(
                        node,
                        "use `String({{code}})` instead.", {
                            code: sourceCode.getText(getNonEmptyOperand(node))
                        });
                }
            },

            AssignmentExpression(node) {

                // foo += ""
                const operatorAllowed = options.allow.indexOf("+") >= 0;

                if (!operatorAllowed && options.string && isAppendEmptyString(node)) {
                    context.report(
                        node,
                        "use `{{code}} = String({{code}})` instead.", {
                            code: sourceCode.getText(getNonEmptyOperand(node))
                        });
                }
            }
        };
    }
};
