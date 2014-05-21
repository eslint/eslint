/**
 * @fileoverview Rule to flag function without return statement.
 * @author Justin Falcone
 */

//-----------------------------------------------------------------------------
// Rule Definition
//-----------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var functions = [];

    //-------------------------------------------------------------------------
    // Helpers
    //-------------------------------------------------------------------------

    function enterFunction(node) {
        var params = {returned: false};

        // constructors should be named with captial letters
        var isCtr = node.id && node.id.name &&
            node.id.name[0] === node.id.name[0].toUpperCase();

        if (isCtr){
            params.returned = true;
        }

        // IIFEs should be wrapped in parens
        var previousToken = context.getTokenBefore(node);
        var isWrapped = previousToken && previousToken.value === "(";


        if (isWrapped){
            params.wrapped = true;
        }

        functions.push(params);

        return;
    }

    function didReturnOrThrowStatement() {
        functions[functions.length - 1].returned = true;
        return;
    }

    function exitFunction(node) {
        // IIFEs must be called immediately
        var nextToken = context.getTokenAfter(node);
        var isCalled = nextToken && nextToken.value === "(";

        var last = functions.pop();

        if (last.returned || last.wrapped && isCalled){
            return;
        }

        context.report(node,"Function must have return statement.");
    }


    //-------------------------------------------------------------------------
    // Public
    //-------------------------------------------------------------------------

    return {
        "FunctionDeclaration": enterFunction,
        "FunctionExpression": enterFunction,
        "FunctionDeclaration:exit": exitFunction,
        "FunctionExpression:exit": exitFunction,
        "ReturnStatement" : didReturnOrThrowStatement,
        "ThrowStatement" : didReturnOrThrowStatement
    };
};
