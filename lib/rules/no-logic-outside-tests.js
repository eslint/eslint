/**
 * @fileoverview Rule to flag when using logical expressions outside of if, for, while, do statements
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "LogicalExpression": function(node) {
            var ancestors = context.getAncestors(node);
            var parent = ancestors.pop();
            if(!(parent && (node === parent.test || parent.type === "LogicalExpression"))) {
                context.report(node, "Expected an assignment or function call and instead saw an expression");
            }
        }
    };

};
