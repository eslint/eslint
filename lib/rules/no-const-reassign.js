/**
 * @fileoverview Rule to flag reassignments of constants.
 * @author Jason Brumwell
 * @copyright 2015 Jason Brumwell. All rights reserved
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var MESSAGE = "Invalid assignment to const {{name}}.";

    /**
     * Check if a node is a unary delete expression
     *
     * @param {ASTNode} node - The node to compare
     * @returns {boolean} True if it's a unary delete expression, false if not.
     * @private
    */
    function isDeleted(node) {
        return (
            node &&
            node.type === "UnaryExpression" &&
            node.operator === "delete" &&
            node.argument.type === "Identifier"
        );
    }

    /**
     * Determines if the reference should be counted as a re-assignment
     *
     * @param {Reference} ref The reference to check.
     * @returns {boolean} True if it's a valid reassignment, false if not.
     * @private
    */
    function isReassignment(ref) {
        var isWrite = (ref.isWrite() || !ref.isReadOnly());

        if (!isWrite && isDeleted(ref.identifier.parent)) {
            isWrite = true;
        }

        return isWrite;
    }

    /**
     * Report a reference as invalid
     *
     * @param {string} name - the variables name
     * @param {Reference} ref - the reference to report
     * @returns {void}
     * @private
    */
    function report(name, ref) {
        context.report(ref.identifier, MESSAGE, {name: name});
    }

    /**
     * Assigns references to corresponding variable
     *
     * @param {Scope} scope - an escope object
     * @param {Variable} variable - variable to apply references too
     * @returns {Variable} returns the variable with references
     * @private
    */
    function transformGlobalVariables(scope, variable) {
        scope.references.forEach(function(ref) {
            if (ref.identifier.name === variable.name) {
                variable.references.push(ref);
            }
        });

        return variable;
    }

    /**
     * Checks for and reports reassigned constants
     *
     * @param {Scope} scope - an escope Scope object
     * @returns {void}
     * @private
    */
    function checkScope(scope) {
        var variables = scope.variables;

        if (!scope.functionExpressionScope) {
            for (var i = 0, l = variables.length; i < l; ++i) {
                // skip implicit "arguments" variable
                if (scope.type === "function" && variables[i].name === "arguments" && variables[i].identifiers.length === 0) {
                    continue;
                }

                var def = variables[i].defs[0];

                // only constants
                if (!def || def.kind !== "const") {
                    continue;
                }

                var variable = variables[i];
                var references = variable.references;
                var name = variable.name;
                var assignments = references.filter(isReassignment);

                if (assignments.length > 1) {
                    // remove original assigment
                    assignments.shift();

                    assignments.forEach(report.bind(null, name));
                }
            }
        }

        scope.childScopes.forEach(checkScope);
    }

    return {
        "Program:exit": function() {
            if (context.ecmaFeatures.blockBindings) {
                var scope = context.getScope();

                if (scope.type === "global") {
                    scope = {
                        childScopes: scope.childScopes,
                        variables: scope.variables.map(transformGlobalVariables.bind(null, scope))
                    };
                }

                checkScope(scope);
            }
        }
    };

};
