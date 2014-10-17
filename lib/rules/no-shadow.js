/**
 * @fileoverview Rule to flag on declaring variables already declared in the outer scope
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    /**
     * Checks if a variable is contained in the list of given scope variables.
     * @param {Object} variable The variable to check.
     * @param {Array} scopeVars The scope variables to look for.
     * @returns {boolean} Whether or not the variable is contains in the list of scope variables.
     */
    function isContainedInScopeVars(variable, scopeVars) {
        return scopeVars.some(function (scopeVar) {
            if (scopeVar.identifiers.length > 0) {
                return variable.name === scopeVar.name;
            }
            return false;
        });
    }

    /**
     * Checks if the given variables are shadowed in the given scope.
     * @param {Array} variables The variables to look for
     * @param {Object} scope The scope to be checked.
     * @returns {void}
     */
    function checkShadowsInScope(variables, scope) {
        variables.forEach(function (variable) {
            if (isContainedInScopeVars(variable, scope.variables)) {
                context.report(variable.identifiers[0], "{{a}} is already declared in the upper scope.", {a: variable.name});
            }
        });
    }

    /**
     * Filters all variables of a list which already occur in another list.
     * @param {Array} variableListA List of variables which should be filtered.
     * @param {Array} variableListB List of variables which should no occur in variableListA.
     * @returns {Array} Filtered list of variables.
     */
    function filterVariableList(variableListA, variableListB) {
        return variableListA.filter(function (variableA) {
            return !variableListB.some(function (variableB) {
                return variableA.name === variableB.name;
            });
        });
    }

    /**
     * Checks the given node for shadowed variables.
     * @param {ASTNode} node The AST node of a FunctionDeclaration or FunctionExpression.
     * @returns {void}
     */
    function checkForShadows(node) {
        var scope = context.getScope(),
            args = node.params,
            variables = filterVariableList(scope.variables, args);

        // iterate through the array of variables and find duplicates with the upper scope
        var upper = scope.upper;
        while (upper) {
            checkShadowsInScope(variables, upper);
            upper = upper.upper;
        }
    }

    return {
        "FunctionDeclaration": checkForShadows,
        "FunctionExpression": checkForShadows
    };

};
