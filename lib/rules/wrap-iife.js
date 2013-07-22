/**
 * @fileoverview Rule to flag use of an IIFE that is not wrapped in a pair of parentheses
 * @author James Allardice
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "CallExpression": function(node) {

            if (node.callee.type === "FunctionExpression") {
                var tokens = context.getTokens(node, 1, 1),
                    parens = 0;

                if (tokens[0].value !== "(") {
                    parens = 1;
                } else {
                    for (var i = 0, len = tokens.length; i < len; i++) {
                        if (tokens[i].value === "(") {
                            parens++;
                        } else if (tokens[i].value === ")") {
                            parens--;
                        }
                    }
                }
                if (parens) {
                    context.report(node, "Wrap an immediate function invocation in parentheses.");
                }
            }
        }
    };

};
