/**
 * @fileoverview Rule to flag use of ternary operators.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "ConditionalExpression": function(node) {
            context.report(node, "Ternary operator used.");
        }

    };

};
