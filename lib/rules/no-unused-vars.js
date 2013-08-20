/**
 * @fileoverview Rule to flag declared but unused variables
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var variables = [];

    var populateVariables = function() {
        var scope = context.getScope();
        scope.variables.forEach(function(variable) {
            //filter out global variables that we add as part of eslint or arguments variable
            if (variable.identifiers.length > 0) {
                //make sure that this variable is not already in the array
                if (!variables.some(function(storedVariable) {
                    return storedVariable.name === variable.name && storedVariable.node === variable.identifiers[0];
                })) {
                    variables.push({name: variable.name, node: variable.identifiers[0]});
                }
            }
        });
    };

    var findVariable = function(name) {
        var scope = context.getScope();
        var scopeVariable = [];
        var filter = function(variable) {
            return variable.name === name;
        };
        while (scopeVariable.length === 0) {
            scopeVariable = scope.variables.filter(filter);
            if (scopeVariable.length === 0) {
                if (!scope.upper) {
                    return null;
                }
                scope = scope.upper;
            }
        }
        return variables.filter(function(variable) {
            return variable.name === scopeVariable[0].name && variable.node === scopeVariable[0].identifiers[0];
        })[0];
    };

    return {
        "FunctionDeclaration": populateVariables,
        "FunctionExpression": populateVariables,
        "Program": populateVariables,
        "Identifier": function(node) {
            var ancestors = context.getAncestors(node);
            var parent = ancestors.pop();
            var grandparent = ancestors.pop();
            /*if it's not an assignment expression find corresponding
              *variable in the array and mark it as used
              */
            if ((parent.type !== "AssignmentExpression" || node !== parent.left) &&
                parent.type !== "VariableDeclarator" &&
                parent.type !== "FunctionDeclaration" &&
                (parent.type !== "FunctionExpression" ||
                (grandparent!==null && grandparent.type === "CallExpression"))) {
                var variable = findVariable(node.name);
                if (variable) {
                    variable.used = true;
                }
            }
        },
        "Program:after": function() {
            var unused = variables.filter(function(variable) {
                return !variable.used;
            });
            unused.forEach(function(variable) {
                context.report(variable.node, "{{var}} is defined but never used", {"var": variable.name});
            });
        }
    };

};
