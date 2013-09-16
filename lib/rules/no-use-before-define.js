/**
 * @fileoverview Rule to flag use of variables before they are defined
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    
    "use strict";

    var findDeclaration = function(name, scope) {
        //try searching in the current scope first
        for (var i=0, l=scope.variables.length; i<l; i++) {
            if (scope.variables[i].name === name) {
                return scope.variables[i];
            }
        }
        //check if there's upper scope and call recursivly till we find the variable
        if (scope.upper) {
            return findDeclaration(name, scope.upper);
        }
    };

    var findVariables = function() {
        var scope = context.getScope();

        var checkLocationAndReport = function(reference, declaration) {
            if (declaration.identifiers[0].range[1] > reference.identifier.range[1]) {
                context.report(reference.identifier, "{{a}} was used before it was defined", {a: reference.identifier.name});
            }
        };

        scope.references.forEach(function(reference) {

            //filter out global variables that we add as part of eslint or arguments variable
            if (reference.identifier) {
                //if the reference is resolved check for declaration location
                //if not, it could be function invocation, try to find manually
                if (reference.resolved && reference.resolved.identifiers.length > 0) {
                    checkLocationAndReport(reference, reference.resolved);
                } else {
                    var declaration = findDeclaration(reference.identifier.name, scope);
                    //if there're no identifiers, this is a global environment variable
                    if (declaration && declaration.identifiers.length !== 0) {
                        checkLocationAndReport(reference, declaration);
                    }
                }
            }
        });
    };

    return {
        "Program": findVariables,
        "FunctionExpression": findVariables,
        "FunctionDeclaration": findVariables
    };
};