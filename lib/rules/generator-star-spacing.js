/**
 * @fileoverview Rule to check the spacing around the * in generator functions.
 * @author Jamund Ferguson
 * @copyright 2015 Brandon Mills. All rights reserved.
 * @copyright 2014 Jamund Ferguson. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var mode = {
        before: { before: true, after: false },
        after: { before: false, after: true },
        both: { before: true, after: true },
        neither: { before: false, after: false }
    }[context.options[0] || "before"];

    /**
     * Checks the spacing between two tokens before or after the star token.
     * @param {string} side Either "before" or "after".
     * @param {Token} leftToken `function` keyword token if side is "before", or
     *     star token if side is "after".
     * @param {Token} rightToken Star token if side is "before", or identifier
     *     token if side is "after".
     * @returns {void}
     */
    function checkSpacing(side, leftToken, rightToken) {
        if (!!(rightToken.range[0] - leftToken.range[1]) !== mode[side]) {
            context.report(
                leftToken.value === "*" ? leftToken : rightToken,
                "{{type}} space {{side}} *.",
                {
                    type: mode[side] ? "Missing" : "Unexpected",
                    side: side
                }
            );
        }
    }

    /**
     * Enforces the spacing around the star if node is a generator function.
     * @param {ASTNode} node A function expression or declaration node.
     * @returns {void}
     */
    function checkFunction(node) {
        var prevToken, starToken, nextToken;

        if (!node.generator) {
            return;
        }

        if (node.parent.method || node.parent.type === "MethodDefinition") {
            starToken = context.getTokenBefore(node, 1);
        } else {
            starToken = context.getFirstToken(node, 1);
        }

        // Only check before when preceded by `function` keyword
        prevToken = context.getTokenBefore(starToken);
        if (prevToken.value === "function" || prevToken.value === "static") {
            checkSpacing("before", prevToken, starToken);
        }

        // Only check after when followed by an identifier
        nextToken = context.getTokenAfter(starToken);
        if (nextToken.type === "Identifier") {
            checkSpacing("after", starToken, nextToken);
        }
    }

    return {
        "FunctionDeclaration": checkFunction,
        "FunctionExpression": checkFunction
    };

};
