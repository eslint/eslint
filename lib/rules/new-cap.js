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
            var constructorName = "";

            if (node.callee.type === "MemberExpression") {
                constructorName = node.callee.property.name;
            } else {
                constructorName = node.callee.name;
            }

            if (constructorName.charAt(0) === constructorName.charAt(0).toLowerCase()) {
                context.report(node, "A constructor name should start with an uppercase letter.");
            }
        }
    };

};
