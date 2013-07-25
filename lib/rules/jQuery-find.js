/**
 * @fileoverview Rule to suggest using find() instead of context
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "CallExpression": function(node) {
            if (context.isInContext("jQuery")) {
                if (node.arguments.length > 1) {
                    context.report(node, "Use .find() instead of context.");
                }
            }
        }
    };

};
