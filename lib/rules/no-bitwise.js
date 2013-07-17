/**
 * @fileoverview Rule to flag bitwise identifiers
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "BinaryExpression": function(node) {

            // warn for ^ | &
            if (node.operator.match(/^[\^&\|]$/)) {
                context.report(node, "Unexpected use of " + node.operator + " found.");
            }


        }
    };

};
