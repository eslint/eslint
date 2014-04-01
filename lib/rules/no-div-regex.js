/**
 * @fileoverview Rule to check for ambiguous div operator in regexes
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Literal": function(node) {
            var token = context.getFirstTokens(node, 1)[0],
                nodeType = token.type,
                source;

            if (nodeType === "RegularExpression") {
                source = context.getFirstTokens(node, 1)[0].value;

                if (source[1] === "=") {
                    context.report(node, "A regular expression literal can be confused with '/='.");
                }
            }
        }
    };

};
