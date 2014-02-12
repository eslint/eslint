/**
 * @fileoverview A rule to set the maximum number of statements in a function.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    var functionStack = [],
        maxStatements = context.options[0] || 10;

    function startFunction() {
        functionStack.push(0);
    }

    function endFunction(node) {
        var count = functionStack.pop();

        if (count > maxStatements) {
            context.report(node, "This function has too many statements ({{count}}). Maximum allowed is {{max}}.",
                    { count: count, max: maxStatements });
        }
    }

    function countStatements(node) {
        functionStack[functionStack.length - 1] += node.body.length;
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": startFunction,
        "FunctionExpression": startFunction,

        "BlockStatement": countStatements,

        "FunctionDeclaration:exit": endFunction,
        "FunctionExpression:exit": endFunction
    };

};
