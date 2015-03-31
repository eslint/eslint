/**
 * @fileoverview Binary binary operator style - enforces binary operator styles of two types: last and first
 * @author Benoît Zugmeyer
 * @copyright 2015 Benoît Zugmeyer. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var style = context.options[0] || "last",
        exceptions = {};

    if (context.options.length === 2 && context.options[1].hasOwnProperty("exceptions")) {
        exceptions = context.options[1].exceptions;
    }

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Checks whether two tokens are on the same line.
     * @param {ASTNode} left The leftmost token.
     * @param {ASTNode} right The rightmost token.
     * @returns {boolean} True if the tokens are on the same line, false if not.
     * @private
     */
    function isSameLine(left, right) {
        return left.loc.end.line === right.loc.start.line;
    }

    /**
     * Checks the operator placement
     * @param {ASTNode} node The binary operator node to check
     * @private
     * @returns {void}
     */
    function validateBinaryExpression(node) {
        var leftToken = context.getLastToken(node.left || node.id);
        var operatorToken = context.getTokenAfter(leftToken);
        var rightToken = context.getTokenAfter(operatorToken);
        var operator = operatorToken.value;

        // if single line
        if (isSameLine(operatorToken, leftToken) &&
                isSameLine(rightToken, operatorToken)) {

            return;

        } else if (!isSameLine(operatorToken, leftToken) &&
                !isSameLine(rightToken, operatorToken)) {

            // lone operator
            context.report(node, {
                line: operatorToken.loc.end.line,
                column: operatorToken.loc.start.column
            }, "Bad line breaking before and after '" + operator + "'.");

        } else if (style === "first" && isSameLine(operatorToken, leftToken)) {

            context.report(node, "'" + operator + "' should be placed first.");

        } else if (style === "last" && isSameLine(operatorToken, rightToken)) {

            context.report(node, {
                line: operatorToken.loc.end.line,
                column: operatorToken.loc.end.column
            }, "'" + operator + "' should be placed last.");
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    var nodes = {};

    if (!exceptions.BinaryExpression) {
        nodes.BinaryExpression = validateBinaryExpression;
    }

    if (!exceptions.LogicalExpression) {
        nodes.LogicalExpression = validateBinaryExpression;
    }

    if (!exceptions.AssignmentExpression) {
        nodes.AssignmentExpression = validateBinaryExpression;
    }

    if (!exceptions.VariableDeclarator) {
        nodes.VariableDeclarator = function (node) {
            if (node.init) {
                validateBinaryExpression(node);
            }
        };
    }

    return nodes;
};
