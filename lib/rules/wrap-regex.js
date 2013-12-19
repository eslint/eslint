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
                source,
                grandparent,
                ancestors;

            if (nodeType === "RegularExpression") {
                source = context.getTokens(node, 1, 1)[0].value;
                ancestors = context.getAncestors();
                grandparent = ancestors[ancestors.length - 1];

                if (grandparent.type === "MemberExpression" &&
                        source[0] !== "(" && source[source.len - 1] !== ")") {
                    context.report(node, "Wrap the /regexp/ literal in parens to disambiguate the slash operator.");
                }
            }
        }
    };

};
