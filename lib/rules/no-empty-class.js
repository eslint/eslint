/**
 * @fileoverview Rule to flag the use of empty character classes in regular expressions
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Literal": function(node) {
            var tokens = context.getTokens(node);
            tokens.forEach(function (token) {
                if (token.type === "RegularExpression" && !/^\/([^\\[]|\\.|\[([^\\\]]|\\.)+\])*\/$/.test(token.value)) {
                    context.report(node, "Empty class.");
                }
            });
        }

    };

};
