/**
 * @fileoverview Rule to flag when using new Date
 * @author Jacob Gable
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "NewExpression": function(node) {
            if (node.callee.name === "Date") {
                context.report(node, "The Date constructor is not timezone friendly.");
            }
        }
    };

};
