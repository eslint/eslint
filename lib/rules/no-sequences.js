/**
 * @fileoverview Rule to flag use of comma operator
 * @author Brandon Mills
 */

"use strict";

var astUtils = require("../ast-utils");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var config = context.options[0] || {},
        ignoreParenthesized = config.ignoreParenthesized !== false,
        allowIndirectEval = config.allowIndirectEval !== false;

    /**
     * Parts of the grammar that are required to have parens.
     */
    var parenthesized = {
        "DoWhileStatement": "test",
        "IfStatement": "test",
        "SwitchStatement": "discriminant",
        "WhileStatement": "test",
        "WithStatement": "object"

        // Omitting CallExpression - commas are parsed as argument separators
        // Omitting NewExpression - commas are parsed as argument separators
        // Omitting ForInStatement - parts aren't individually parenthesised
        // Omitting ForStatement - parts aren't individually parenthesised
    };

    var isParenthesised = astUtils.isParenthesised.bind(astUtils, context);

    /**
     * Determines whether a node is required by the grammar to be wrapped in
     * parens, e.g. the test of an if statement.
     * @param {ASTNode} node - The AST node
     * @returns {boolean} True if parens around node belong to parent node.
     */
    function requiresExtraParens(node) {
        return node.parent && parenthesized[node.parent.type] &&
                node === node.parent[parenthesized[node.parent.type]];
    }

    /**
     * Check if a node is wrapped in two levels of parens.
     * @param {ASTNode} node - The AST node
     * @returns {boolean} True if two parens surround the node on each side.
     */
    function isParenthesisedTwice(node) {
        var previousToken = context.getTokenBefore(node, 1),
            nextToken = context.getTokenAfter(node, 1);

        return isParenthesised(node) && previousToken && nextToken &&
            previousToken.value === "(" && previousToken.range[1] <= node.range[0] &&
            nextToken.value === ")" && nextToken.range[0] >= node.range[1];
    }

    return {
        "SequenceExpression": function(node) {
            // Always allow sequences in for statement update
            if (node.parent.type === "ForStatement" &&
                    (node === node.parent.init || node === node.parent.update)) {
                return;
            }

            // Wrapping a sequence in extra parens indicates intent
            if (requiresExtraParens(node)) {
                if (ignoreParenthesized && isParenthesisedTwice(node)) {
                    return;
                }
            } else if (
                isParenthesised(node) && (
                ignoreParenthesized ||
                node.expressions[node.expressions.length - 1].name === "eval" && allowIndirectEval
            )) {
                return;
            }

            var child = context.getTokenAfter(node.expressions[0]);
            context.report(node, child.loc.start, "Unexpected use of comma operator.");
        }
    };

};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "ignoreParenthesized": {
                "type": "boolean"
            },
            "allowIndirectEval": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }
];

