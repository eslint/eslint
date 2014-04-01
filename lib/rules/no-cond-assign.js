/**
 * @fileoverview Rule to flag assignment in a conditional expression
 * @author Stephen Murray <spmurrayzzz>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    function isParenthesised(node) {
        var previousToken = context.getTokenBefore(node),
            nextToken = context.getTokenAfter(node);

        return previousToken.value === "(" && previousToken.range[1] <= node.range[0] &&
            nextToken.value === ")" && nextToken.range[0] >= node.range[1];
    }

    function isParenthesisedTwice(node) {
        var previousToken = context.getTokenBefore(node, 1),
            nextToken = context.getTokenAfter(node, 1);

        return isParenthesised(node) &&
            previousToken.value === "(" && previousToken.range[1] <= node.range[0] &&
            nextToken.value === ")" && nextToken.range[0] >= node.range[1];
    }

    function testForAssign(node) {
        if (node.test && (node.test.type === "AssignmentExpression") && !isParenthesisedTwice(node.test)) {
            context.report(node, "Expected a conditional expression and instead saw an assignment.");
        }
    }

    return {
        "IfStatement": testForAssign,
        "WhileStatement": testForAssign,
        "DoWhileStatement": testForAssign,
        "ForStatement": testForAssign
    };

};
