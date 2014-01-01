/**
 * @fileoverview Rule to flag creation of function inside a loop
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function checkForLoops(node) {
        var ancestors = context.getAncestors();

        if (ancestors.some(function(ancestor) {
            return ancestor.type === "ForStatement" || ancestor.type === "WhileStatement" || ancestor.type === "DoWhileStatement";
        })) {
            context.report(node, "Don't make functions within a loop");
        }
    }

    return {
        "FunctionExpression": checkForLoops,
        "FunctionDeclaration": checkForLoops
    };
};
