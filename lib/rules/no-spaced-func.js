/**
 * @fileoverview Rule to check that spaced function application
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "CallExpression": function(node) {
            var tokens = context.getTokens(node),
                identifierRange = tokens[0].range,
                openParenRange = tokens[1].range;

            // If theres a gap between the end of the identifier and open paren
            if (identifierRange[1] !== openParenRange[0]) {
                context.report(node, "Spaced function application is not allowed.");
            }
        }
    };

};
