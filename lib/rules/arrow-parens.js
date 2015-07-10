/**
 * @fileoverview Rule to require parens in arrow function arguments.
 * @author Jxck
 * @copyright 2015 Jxck. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var message = "Expected parentheses around arrow function argument.";

    /**
     * Determines whether a arrow function argument end with `)`
     * @param {ASTNode} node The arrow function node.
     * @returns {void}
     */
    function parens(node) {
        var token = context.getFirstToken(node);
        if (token.type === "Identifier") {
            var after = context.getTokenAfter(token);
            if (after.value !== ")") {
                context.report(node, message);
            }
        }
    }

    return {
        "ArrowFunctionExpression": parens
    };
};

module.exports.schema = [];
