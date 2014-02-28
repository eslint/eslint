/**
 * @fileoverview Rule to flag when IIFE is not wrapped in parens
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function wrapped(node) {
        var tokens = context.getTokens(node, 1, 1);
        return tokens[0].value === "(" && tokens[tokens.length - 1].value === ")";
    }

    return {

        "CallExpression": function(node) {
            if (node.callee.type === "FunctionExpression" && !wrapped(node) && !wrapped(node.callee)) {
                context.report(node, "Wrap an immediate function invocation in parentheses.");
            }
        }
    };

};
