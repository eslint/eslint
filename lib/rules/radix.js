/**
 * @fileoverview Rule to flag use of parseInt without a radix argument
 * @author James Allardice
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "CallExpression": function(node) {

            if (node.callee.name === "parseInt" && node.arguments.length === 1) {
                context.report(node, "Missing radix parameter.");
            }
        }
    };

};
