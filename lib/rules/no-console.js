/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    context.on("MemberExpression", function(node) {

        if (node.object.name === "console") {
            context.report(node, "Unexpected console statement.");
        }

    });

};
