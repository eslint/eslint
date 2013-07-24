/**
 * @fileoverview Counts the cyclomatic complexity of each function of the script. See http://en.wikipedia.org/wiki/Cyclomatic_complexity.
 * Counts the number of if, conditional, for, whilte, try, switch/case, 
 * @author Patrick Brosset
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    THRESHOLD = context.options[0];

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    // Storing all functions met during the parsing
    var fns = [];

    // When parsing a new function, store it in our function stack
    function startNewFunction(node) {
        fns.push({ node: node, complexity: 1 });
    }

    // Given a node, find which function it is placed into
    function getFunctionAtRange(node) {
        var stack = [], range = node.range;

        for(var i = 0; i < fns.length; i ++) {
            var fnRange = fns[i].node.range;

            if(fnRange[0] <= range[0] && fnRange[1] >= range[1]) {
                stack.push(fns[i]);
            }
        }

        return stack.sort(function(fn1, fn2) {
            return fn2.node.range[0] - fn1.node.range[0];
        })[0];
    }

    function increaseComplexity(node) {
        var fn = getFunctionAtRange(node);
        fn && fn.complexity ++;
    }

    function increaseSwitchComplexity(node) {
        // Avoiding `default`
        node.test && increaseComplexity(node);
    }

    function increaseLogicalComplexity(node) {
        // Avoiding &&
        node.operator === "||" && increaseComplexity(node);
    }

    function reportComplexity() {
        var i, fn;
        for(i = 0; i < fns.length; i ++) {
            fn = fns[i], name = fn.node.id ? fn.node.id.name : "anonymous";
            if(fn.complexity > THRESHOLD) {
                context.report(fn.node, "Function '{{name}}' has a complexity of {{complexity}}.", { name: name, complexity: fn.complexity });
            }
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": startNewFunction,
        "FunctionExpression": startNewFunction,

        "CatchClause": increaseComplexity,
        "ConditionalExpression": increaseComplexity,
        "LogicalExpression": increaseLogicalComplexity,
        "ForStatement": increaseComplexity,
        "ForInStatement": increaseComplexity,
        "IfStatement": increaseComplexity,
        "SwitchCase": increaseSwitchComplexity,
        "WhileStatement": increaseComplexity,
        "DoWhileStatement": increaseComplexity,

        "Program:after": reportComplexity
    };

};
