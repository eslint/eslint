/**
 * @fileoverview Rule to flag when return statement contains assignment
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "ReturnStatement": function(node) {
            if (node.argument && node.argument.type === "AssignmentExpression") {
                context.report(node, "Return statement should not contain assigment.");
            }
        }
    };

};
