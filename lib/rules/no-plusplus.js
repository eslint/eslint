/**
 * @fileoverview Rule to flag use of unary increment and decrement operators.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "UpdateExpression": function(node) {
            context.report(node, "Unary operator '" + node.operator + "' used.");
        }

    };

};
