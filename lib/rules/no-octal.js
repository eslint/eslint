/**
 * @fileoverview Rule to flag when initializing octal literal
 * @author Ilya Volodin
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "Literal": function(node) {
            if (node.raw != node.value && node.raw.indexOf("x") < 0) {
                context.report(node, "Octal literals should not be used.");
            }
        }
    };

};
