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
        var i, token, hasArgumentList = false, numOpen = 0;

        // start at the end of the token stream; skip over argument list contents
        for(i = tokens.length - 1; i >= 0; --i) {
            token = tokens[i];
            if (token.value === "(") {
                --numOpen;
            } else if (token.value === ")") {
                hasArgumentList = true;
                ++numOpen;
            }
            if (hasArgumentList && numOpen <= 0) {
                return i;
            }
        }
    }

    function detectOpenSpaces(node) {
        var tokens = context.getTokens(node),
            openParenIndex = findOpenParen(tokens),
            openParen = tokens[openParenIndex],
            callee = tokens[openParenIndex - 1];

        // openParenIndex will be undefined for a NewExpression with no argument list
        if (!openParenIndex) { return; }

        // look for a space between the callee and the open paren
        if (callee.range[1] !== openParen.range[0]) {
            context.report(node, "Unexpected space between function name and paren.");
        }
    }

    return {
        "CallExpression": detectOpenSpaces,
        "NewExpression": detectOpenSpaces
    };

};
