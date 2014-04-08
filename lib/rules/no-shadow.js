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
        var scope = context.getScope(),
            isFunctionExpression = (node.type === "FunctionExpression"),
            args = node.params,
            variables = scope.variables.filter(function(item) {
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
                        return scopeVar.name === variable.name && !isFunctionExpression;
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
