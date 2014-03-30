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
            var ancestors = context.getAncestors(),
                previousToken, nextToken;

            if (!/CallExpression|NewExpression/.test(ancestors.pop().type)) {
                previousToken = context.getTokenBefore(node);
                nextToken = context.getTokenAfter(node);
                if (previousToken.value === "(" && nextToken.value === ")") {
                    context.report(node, "Wrapping non-IIFE function literals in parens is unnecessary.");
                }
            }
        }
    };

};
