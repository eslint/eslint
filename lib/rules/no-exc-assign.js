/**
 * @fileoverview Rule to flag assignment of the exception parameter
 * @author Stephen Murray <spmurrayzzz>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "CatchClause": function(node) {
            var catchParam = node.param.name;
            var catchBody = node.body.body;
            for (var i = 0; i < catchBody.length; i++) {
                var line        = catchBody[i],
                    targetExpr  = "AssignmentExpression",
                    lineType    = line.expression.type,
                    assignee    = line.expression.left;
                
                if (lineType === targetExpr && assignee.name === catchParam) {
                    context.report(node, "Unexpected assignment of exception parameter.");
                }
            }
        }
    };

};
