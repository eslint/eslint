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
            identifierRange,
            openParenRange;

        openParenIndices.forEach(function(i) {
            identifierRange = tokens[i-1].range;
            openParenRange = tokens[i].range;

            // If theres a gap between the end of the identifier and open paren
            if (identifierRange[1] !== openParenRange[0]) {
                context.report(node, "Spaced function application is not allowed.");
            }
        });
    }

    return {

        "CallExpression": detectOpenSpaces,
        "NewExpression": detectOpenSpaces
    };

};
