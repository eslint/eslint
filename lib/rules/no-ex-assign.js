/**
 * @fileoverview Rule to flag assignment of the exception parameter
 * @author Stephen Murray <spmurrayzzz>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var inCatch = false,
        exceptionName = null;

    return {

        "CatchClause": function(node) {
            inCatch = true;
            exceptionName = node.param.name;
        },

        "CatchClause:exit": function() {
            inCatch = false;
            exceptionName = null;
        },

        "AssignmentExpression": function(node) {

            if (inCatch) {

                if (node.left.name === exceptionName) {
                    context.report(node, "Do not assign to the exception parameter.");
                }
            }
        }

    };

};
