/**
 * @fileoverview Rule to flag assignment in a conditional expression
 * @author Stephen Murray <spmurrayzzz>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var message     = "Expected a conditional expression and instead saw an assignment.",
        targetExpr  = "AssignmentExpression";

    function testForAssign(node) {
        var type = node.test.type;
        if (type === targetExpr) {
            context.report(node, message);
        }
    }

    return {
        "IfStatement": testForAssign,
        "WhileStatement": testForAssign,
        "DoWhileStatement": testForAssign,
        "ForStatement": testForAssign
    };

};
