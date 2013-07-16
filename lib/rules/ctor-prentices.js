/**
 * @fileoverview Rule to flag when using constructor without prentices
 * @author Ilya Volodin
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "NewExpression": function(node, tokens) {
            var prenticesTokens = tokens.filter(function(token) {
                return token.value === "(" || token.value === ")";
            });
            if (prenticesTokens.length !== 2) {
                context.report(node, "Missing '()' invoking a constructor");
            }
        }
    };

};
