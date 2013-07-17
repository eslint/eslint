/**
 * @fileoverview Rule to flag when initializing octal literal
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "Literal": function(node) {
            if (node.raw !== node.value.toString() && node.raw.indexOf("x") < 0) {
                context.report(node, "Octal literals should not be used.");
            }
        }
    };

};
