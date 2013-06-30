/**
 * @fileoverview Rule to flag use of constructors without capital letters
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "NewExpression": function(node) {
            var callee = node.callee.name;

            if (callee.charAt(0) === callee.charAt(0).toLowerCase()) {
                context.report(node, "A constructor name should start with an uppercase letter.");
            }
        }
    };

};
