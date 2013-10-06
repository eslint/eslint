/**
 * @fileoverview Rule to flag when regex literals are not wrapped in parens
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Literal": function(node) {
            var token = context.getTokens(node)[0],
                nodeType = token.type,
                source;

            if (nodeType === "RegularExpression") {
                source = context.getSource(node, 1, 1);
                if (source[0] !== "(" && source[source.len-1] !== ")") {
                    context.report(node, "Wrap the /regexp/ literal in parens to disambiguate the slash operator.");
                }
            }
        }
    };

};
