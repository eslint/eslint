/**
 * @fileoverview Flag expressions in statement position that do not side effect
 * @author Michael Ficarra
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {
        "ExpressionStatement": function(node) {
            if (node.expression.type !== "AssignmentExpression" && node.expression.type !== "CallExpression" && node.expression.type !== "NewExpression") {
                context.report(node, "Expected an assignment or function call and instead saw an expression.");
            }
        }
    };

};
