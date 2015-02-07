/**
 * @fileoverview Rule to flag wrapping non-iife in parens
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    /**
     * Checks a function expression to see if its surrounded by parens.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkFunction(node) {
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

    return {
        "ArrowFunctionExpression": checkFunction,
        "FunctionExpression": checkFunction
    };

};
