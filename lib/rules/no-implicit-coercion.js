/**
 * @fileoverview A rule to disallow the type conversions with shorter notations.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var INDEX_OF_PATTERN = /^(?:i|lastI)ndexOf$/;

/**
 * Parses and normalizes an option object.
 * @param {object} options - An option object to parse.
 * @returns {object} The parsed and normalized option object.
 */
function parseOptions(options) {
    options = options || {};
    return {
        boolean: "boolean" in options ? Boolean(options.boolean) : true,
        number: "number" in options ? Boolean(options.number) : true,
        string: "string" in options ? Boolean(options.string) : true
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
 * @param {ASTNode} node - A BinaryExpression node to check.
 * @returns {boolean} Whether or not the node is a multiplying by one.
 */
function isMultiplyByOne(node) {
    return node.operator === "*" && (
        (node.left.type === "Literal" && node.left.value === 1) ||
        (node.right.type === "Literal" && node.right.value === 1)
    );
}

/**
 * Checks whether or not a node is a concatenating with an empty string.
 * @param {ASTNode} node - A BinaryExpression node to check.
 * @returns {boolean} Whether or not the node is a concatenating with an empty string.
 */
function isConcatWithEmptyString(node) {
    return node.operator === "+" && (
        (node.left.type === "Literal" && node.left.value === "") ||
        (node.right.type === "Literal" && node.right.value === "")
    );
}

/**
 * Gets a node that is the left or right operand of a node, is not the specified literal.
 * @param {ASTNode} node - A BinaryExpression node to get.
 * @param {any} value - A literal value to check.
 * @returns {ASTNode} A node that is the left or right operand of the node, is not the specified literal.
 */
function getOtherOperand(node, value) {
    if (node.left.type === "Literal" && node.left.value === value) {
        return node.right;
    }
    return node.left;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = parseOptions(context.options[0]);

    return {
        "UnaryExpression": function(node) {
            // !!foo
            if (options.boolean && isDoubleLogicalNegating(node)) {
                context.report(
                    node,
                    "use `Boolean({{code}})` instead.",
                    {code: context.getSource(node.argument.argument)});
            }

            // ~foo.indexOf(bar)
            if (options.boolean && isBinaryNegatingOfIndexOf(node)) {
                context.report(
                    node,
                    "use `{{code}} !== -1` instead.",
                    {code: context.getSource(node.argument)});
            }

            // +foo
            if (options.number && node.operator === "+") {
                context.report(
                    node,
                    "use `Number({{code}})` instead.",
                    {code: context.getSource(node.argument)});
            }
        },

        "BinaryExpression": function(node) {
            // 1 * foo
            if (options.number && isMultiplyByOne(node)) {
                context.report(
                    node,
                    "use `Number({{code}})` instead.",
                    {code: context.getSource(getOtherOperand(node, 1))});
            }

            // "" + foo
            if (options.string && isConcatWithEmptyString(node)) {
                context.report(
                    node,
                    "use `String({{code}})` instead.",
                    {code: context.getSource(getOtherOperand(node, ""))});
            }
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "boolean": {
                "type": "boolean"
            },
            "number": {
                "type": "boolean"
            },
            "string": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }
];
