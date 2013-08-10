/**
 * @fileoverview Rule to flag when using new Function
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "FunctionExpression": function(node) {
            
            var ancestors = context.getAncestors();
            
            if (ancestors.pop().type !== "CallExpression") {
                var tokens = context.getTokens(node, 1, 1);
                if (tokens[0].value === "(" && tokens[tokens.length - 1].value === ")") {
                    context.report(node, "Wrapping non-IIFE function literals in parens is unnecessary.");
                }
            }
        }
    };

};
