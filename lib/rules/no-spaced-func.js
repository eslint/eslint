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
        var i, token, openParenIndices = [], numOpen = 0, startedArgList = false;

        // start at the end of the token stream; only processes the argument list
        for(i = tokens.length - 1; i >= 0; --i) {
            token = tokens[i];
            if (token.value === "(") {
                openParenIndices.unshift(i);
                startedArgList = true;
                --numOpen;
            } else if (token.value === ")") {
                ++numOpen;
            } else if (startedArgList && numOpen <= 0) {
                break;
            }

        }

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

            if (!prevToken) {
                return;
            }

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
