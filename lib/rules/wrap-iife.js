/**
 * @fileoverview Rule to flag when IIFE is not wrapped in parens
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "CallExpression": function(node) {
            if (node.callee.type === "FunctionExpression") {
                var tokens = context.getTokens(node.callee, 1, 1);
                if (tokens[0].value !== "(" && tokens[tokens.length - 1].value !== ")") {
                    context.report(node, "Wrap an immediate function invocation in parentheses");
                }
            }
        }
    };

};
