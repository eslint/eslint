/**
 * @fileoverview Rule to flag wrapping none-iffe in parens
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

            if (!/CallExpression|NewExpression/.test(ancestors.pop().type)) {
                var tokens = context.getTokens(node, 1, 1);
                if (tokens[0].value === "(" && tokens[tokens.length - 1].value === ")") {
                    context.report(node, "Wrapping non-IIFE function literals in parens is unnecessary.");
                }
            }
        }
    };

};
