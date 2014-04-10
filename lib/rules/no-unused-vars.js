/**
 * @fileoverview Rule to flag declared but unused variables
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var config = {
        vars: "local",
        args: "after-used"
    };
    if (context.options[0]) {
        if (typeof(context.options[0]) === "string") {
            config.vars = context.options[0];
        } else {
            config.vars = context.options[0].vars || config.vars;
            config.args = context.options[0].args || config.args;
        }
    }

    var allowUnusedGlobals = (config.vars !== "all"),
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
            functionName = node && node.id && node.id.name;

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
                        used: (variable.name === functionName)
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

    /**
     * Check if funcNode has paramNode as an identifier of one of its params.
     *
     * @param {FunctionExpression|FunctionDeclaration} funcNode Node which to
     *                                                          check for param
     * @param {Identifier} paramNode Node which can be an identifier for a param
     * @returns {boolean} If funcNode has paramNode as an identifier of one of
     *                    its params
     */
    function functionHasParam(funcNode, paramNode) {
        for (var i = 0, len = funcNode.params.length; i < len; i++) {
            if (funcNode.params[i] === paramNode) {
                return true;
            }
        }
        return false;
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

            var ignorableVariables;
            var fnParamNames;

            if (config.args !== "all") {
                // Get a list of the param names used in the ancestor Function
                fnParamNames = parent.params.map(function(param){
                    return param.name;
                });
            }

            switch (config.args) {

                case "all":
                    break;

                case "none":
                    ignorableVariables = fnParamNames;
                    break;

                case "after-used":
                default:

                    // Check if the used variable exists among those params
                    var variableIndex = fnParamNames.indexOf(usedVariable.name);

                    // This will be true if this variable appears in the param list of an ancestor Function Expression
                    // or FunctionDeclaration.
                    if (variableIndex !== -1) {
                        // All params left of the used variables are ignorable.
                        ignorableVariables = fnParamNames.slice(0, variableIndex);
                    }
                    break;
            }

            if (ignorableVariables) {
                // Mark them as ignorable.
                ignorableVariables.forEach(function(ignorableVariable){

                    lookupVariableName(ignorableVariable).forEach(function(variable){
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

            /*
             * if it's not an assignment expression find corresponding
             * variable in the array and mark it as used
             */
            if ((parent.type !== "AssignmentExpression" || node !== parent.left) &&
                (parent.type !== "VariableDeclarator" || (parent.init && parent.init === node)) &&
                parent.type !== "FunctionDeclaration" &&
                !(parent.type === "MemberExpression" && parent.property === node && !parent.computed) &&
                !(parent.type === "Property" && parent.kind === "init" && parent.key === node) &&
                !(parent.type === "FunctionExpression" && functionHasParam(parent, node)) &&
                (parent.type !== "FunctionExpression" ||
                    (grandparent !== null &&
                    (grandparent.type === "CallExpression" || grandparent.type === "AssignmentExpression")))) {

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
