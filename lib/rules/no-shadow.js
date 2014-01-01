/**
 * @fileoverview Rule to flag on declaring variables already declared in the outer scope
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function checkForShadows(node) {
        var scope = context.getScope();

        //remove variabes that were passed as arguments
        var args = node.params;
        //push 'arguments' into the array
        //args.push({name: "arguments" });
        var variables = scope.variables.filter(function(item) {
            return !args.some(function(variable) {
                return variable.name === item.name;
            });
        });
        //iterate through the array of variables and find duplicates with the upper scope
        var upper = scope.upper;

        function findDups(variables) {
            variables.forEach(function(variable) {
                if (upper.variables.some(function(scopeVar) {
                    //filter out global variables that we add as part of ESLint
                    if (scopeVar.identifiers.length > 0) {
                        return scopeVar.name === variable.name;
                    }
                    return false;
                })) {
                    context.report(variable.identifiers[0], "{{a}} is already declared in the upper scope.", {a: variable.name});
                }
            });
        }

        while(upper) {
            findDups(variables);
            upper = upper.upper;
        }
    }

    return {

        "FunctionDeclaration": checkForShadows,
        "FunctionExpression": checkForShadows
    };

};
