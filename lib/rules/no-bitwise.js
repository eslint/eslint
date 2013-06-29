/**
 * @fileoverview Rule to flag bitwise identifiers
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    context.on("BinaryExpression", function(node) {

        // warn for ^ | &
        if (node.operator.match(/^[\^&\|]$/)) {
            context.report(node, "Unexpected use of " + node.operator + " found.");
        }


    });

};
