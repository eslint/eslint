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
        var tokens = context.getTokens(node, 1, 1),
            firstToken = tokens[0],
            lastToken = tokens[tokens.length - 1];

        return firstToken.value === "(" && firstToken.range[1] <= node.range[0] &&
            lastToken.value === ")" && lastToken.range[0] >= node.range[1];
    }

    function isParenthesisedTwice(node) {
        var tokens = context.getTokens(node, 2, 2),
            firstToken = tokens[0],
            lastToken = tokens[tokens.length - 1];

        return isParenthesised(node) &&
            firstToken.value === "(" && firstToken.range[1] <= node.range[0] &&
            lastToken.value === ")" && lastToken.range[0] >= node.range[1];
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
