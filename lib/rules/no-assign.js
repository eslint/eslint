/**
 * @fileoverview Rule to flag ambiguous assignment operators in comparisons
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function checkForAssignment(node) {
        if (node.test.type === "AssignmentExpression") {
            context.report(node, "Unexpected assignment expression.");
        }
    }

    return {
        "IfStatement": checkForAssignment,
        "WhileStatement": checkForAssignment,
        "ForStatement": checkForAssignment
    }
};
