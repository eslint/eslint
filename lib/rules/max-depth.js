/**
 * @fileoverview A rule to set the maximum depth block can be nested in a function.
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
        maxDepth = context.options[0] || 4;

    function startFunction() {
        functionStack.push(0);
    }

    function endFunction() {
        functionStack.pop();
    }

    function pushBlock(node) {
        var len = ++functionStack[functionStack.length - 1];

        if (len > maxDepth) {
            context.report(node, "Blocks are nested too deeply ({{depth}}).",
                    { depth: len });
        }
    }

    function popBlock() {
        functionStack[functionStack.length - 1]--;
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "Program": startFunction,
        "FunctionDeclaration": startFunction,
        "FunctionExpression": startFunction,

        "IfStatement": pushBlock,
        "SwitchStatement": pushBlock,
        "TryStatement": pushBlock,
        "DoWhileStatement": pushBlock,
        "WhileStatement": pushBlock,
        "WithStatement": pushBlock,
        "ForStatement": pushBlock,
        "ForInStatement": pushBlock,

        "IfStatement:after": popBlock,
        "SwitchStatement:after": popBlock,
        "TryStatement:after": popBlock,
        "DoWhileStatement:after": popBlock,
        "WhileStatement:after": popBlock,
        "WithStatement:after": popBlock,
        "ForStatement:after": popBlock,
        "ForInStatement:after": popBlock,

        "FunctionDeclaration:after": endFunction,
        "FunctionExpression:after": endFunction,
        "Program:after": endFunction
    };

};
