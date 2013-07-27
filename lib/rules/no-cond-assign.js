/**
 * @fileoverview Rule to flag assignment in a conditional expression
 * @author Stephen Murray <spmurrayzzz>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var message     = "Unexpected assignment in conditional expression.",
        targetExpr  = "AssignmentExpression";

    function testForAssign(node) {
        var type = node.test.type;
        if (type === targetExpr) {
            context.report(node, message);
        }
    }

    return {
        "IfStatement": function(node) {
            testForAssign(node);
        },
        "WhileStatement": function(node) {
            testForAssign(node);
        },
        "DoWhileStatement": function(node) {
            testForAssign(node);
        }
    };

};
