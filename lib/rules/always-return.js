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
        // "constructors" are conventionally named with captial letters
        var isCtr = node.id && node.id.name &&
            node.id.name[0] === node.id.name[0].toUpperCase();

        if (isCtr){
            functions.push({returned: true});
        } else {
            functions.push({returned: false});
        }

        return;
    }

    function didReturnStatement() {
        functions[functions.length - 1].returned = true;
        return;
    }

    function didThrowStatement() {
        functions[functions.length - 1].returned = true;
        return;
    }


    function exitFunction(node) {
        var last = functions.pop();
        if (!last.returned){
            context.report(node,"Function must have return statement.");
        }
        return;
    }


    //-------------------------------------------------------------------------
    // Public
    //-------------------------------------------------------------------------

    return {
        "FunctionDeclaration": enterFunction,
        "FunctionExpression": enterFunction,
        "FunctionDeclaration:exit": exitFunction,
        "FunctionExpression:exit": exitFunction,
        "ReturnStatement" : didReturnStatement,
        "ThrowStatement" : didThrowStatement
    };
};
