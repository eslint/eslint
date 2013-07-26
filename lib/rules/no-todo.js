/**
 * @fileoverview A rule to disallow TODOs in code
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    function checkForTodoComment(node) {
        if (/TODO\:/.exec(node.value) !== null) {
            context.report(node, "Unexpected TODO comment");
        }
    }

    return {

        "Block": checkForTodoComment,
        "Line": checkForTodoComment
    };

};
