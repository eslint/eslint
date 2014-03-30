/**
 * @fileoverview Rule to flag when IIFE is not wrapped in parens
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";
    var style = context.options[0] || "outside";

    function wrapped(node) {
        var previousToken = context.getTokenBefore(node),
            nextToken = context.getTokenAfter(node);
        return previousToken && previousToken.value === "(" &&
            nextToken && nextToken.value === ")";
    }

    return {

        "CallExpression": function(node) {
            if (node.callee.type === "FunctionExpression") {
                var callExpressionWrapped = wrapped(node),
                    functionExpressionWrapped = wrapped(node.callee);

                if (!callExpressionWrapped && !functionExpressionWrapped) {
                    context.report(node, "Wrap an immediate function invocation in parentheses.");
                } else if (style === "inside" && !functionExpressionWrapped) {
                    context.report(node, "Wrap only the function expression in parens.");
                } else if (style === "outside" && !callExpressionWrapped) {
                    context.report(node, "Move the invocation into the parens that contain the function.");
                }
            }
        }
    };

};
