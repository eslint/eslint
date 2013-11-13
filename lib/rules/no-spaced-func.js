/**
 * @fileoverview Rule to check that spaced function application
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function findOpenParen(tokens) {
        var openParenIndices = [];

        tokens.forEach(function(token, i) {
            if (token.value === "(") {
                openParenIndices.push(i);
            }
        });

        return openParenIndices;
    }

    function detectOpenSpaces(node) {
        var tokens = context.getTokens(node),
            openParenIndices = findOpenParen(tokens),
            prevToken,
            curToken,
            isSpaceBetweenRange,
            isPrevTokenValid;

        openParenIndices.forEach(function(i) {
            prevToken = tokens[i-1];
            curToken = tokens[i];
            isSpaceBetweenRange = prevToken.range[1] !== curToken.range[0];
            isPrevTokenValid = prevToken.value !== "(";

            // If theres a gap between the end of the identifier and open paren
            if (isSpaceBetweenRange && isPrevTokenValid) {
                context.report(node, "Spaced function application is not allowed.");
            }
        });
    }

    return {
        "CallExpression": detectOpenSpaces,
        "NewExpression": detectOpenSpaces
    };

};
