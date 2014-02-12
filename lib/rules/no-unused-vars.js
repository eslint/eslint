/**
 * @fileoverview Rule to flag declared but unused variables
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var allowUnusedGlobals = (context.options[0] !== "all"),
        variables = {};

    function lookupVariableName(name) {

        // Convoluted check in case name is "hasOwnProperty"
        if (!Object.prototype.hasOwnProperty.call(variables, name)) {
            return null;
        }
        return variables[name];
    }

    function lookupVariable(variable) {
        var candidates = lookupVariableName(variable.name);
        if (candidates) {
            return candidates.filter(function (candidate) {
                return variable.identifiers.some(function (identifier) {
                    return candidate.node === identifier;
                });
            })[0];
        }
        return candidates;
    }

    function populateVariables(node) {
        var scope = context.getScope(),
            functionName = node && node.id && node.id.name,
            parent = context.getAncestors().pop(),

            // check for function foo(){}.bind(this)
            functionNameUsed = parent && parent.type === "MemberExpression";

        scope.variables.forEach(function(variable) {

            //filter out global variables that we add as part of eslint or arguments variable
            if (variable.identifiers.length > 0) {

                //make sure that this variable is not already in the array
                if (!lookupVariable(variable)) {

                    if (!lookupVariableName(variable.name)) {
                        variables[variable.name] = [];
                    }
                    variables[variable.name].push({
                        name: variable.name,
                        node: variable.identifiers[0],
                        used: (variable.name === functionName) && functionNameUsed
                    });
                }
            }
        });
    }

    function populateGlobalVariables() {
        if (!allowUnusedGlobals) {
            populateVariables();
        }
    }

    function findVariable(name) {
        var scope = context.getScope();
        var scopeVariable = [];

        function filter(variable) {
            return variable.name === name;
        }

        while (scopeVariable.length === 0) {
            scopeVariable = scope.variables.filter(filter);
            if (scopeVariable.length === 0) {
                if (!scope.upper) {
                    return null;
                }
                scope = scope.upper;
            }
        }

        return lookupVariable(scopeVariable[0]);
    }

    function isFunction(node) {
        return node && node.type && (node.type === "FunctionDeclaration" || node.type === "FunctionExpression");
    }

    function markIgnorableUnusedVariables(usedVariable) {

        /* When variables are declared as parameters in a FunctionExpression or
         * FunctionDeclaration, they can go unused so long as at least one
         * to the right of them is used.
         */

        // Find the FunctionExpressions and FunctionDeclarations in which this used variable
        // may be a parameter
        var parent = usedVariable.node.parent;
        if (isFunction(parent)) {
            // Get a list of the param names used in the ancestor Function
            var fnParamNames = parent.params.map(function(param){
                return param.name;
            });
            // Check if the used variable exists among those params
            var variableIndex = fnParamNames.indexOf(usedVariable.name);
            // This will be true if this variable appears in the param list of an ancestor Function Expression
            // or FunctionDeclaration.
            if (variableIndex !== -1) {
                // All params left of the used variables are ignorable.
                var ignorableVariables = fnParamNames.slice(0, variableIndex);
                // Mark them as ignorable.
                ignorableVariables.forEach(function(ignorableVariable){

                    (lookupVariableName(ignorableVariable) || []).forEach(function(variable){
                        variable.ignorable = true;
                    });
                });
            }
        }
    }

    return {
        "FunctionDeclaration": populateVariables,
        "FunctionExpression": populateVariables,
        "Program": populateGlobalVariables,
        "Identifier": function(node) {
            var ancestors = context.getAncestors(node);
            var parent = ancestors.pop();
            var grandparent = ancestors.pop();
            /*if it's not an assignment expression find corresponding
              *variable in the array and mark it as used
              */
            if ((parent.type !== "AssignmentExpression" || node !== parent.left) &&
                (parent.type !== "VariableDeclarator" || (parent.init && parent.init === node)) &&
                parent.type !== "FunctionDeclaration" &&
                (parent.type !== "FunctionExpression" ||
                (grandparent !== null && (grandparent.type === "CallExpression" || grandparent.type === "AssignmentExpression")))) {

                var variable = findVariable(node.name);

                if (variable) {
                    variable.used = true;
                    markIgnorableUnusedVariables(variable, ancestors);
                }

            }
        },

        "Program:exit": function() {
            Object.keys(variables)
                .forEach(function (name) {
                    variables[name].forEach(function (variable) {
                        if (variable.used || variable.ignorable) {
                            return;
                        }
                        context.report(variable.node, "{{var}} is defined but never used", {"var": variable.name});
                    });
                });
        }
    };

};
