/**
 * @fileoverview A rule to suggest using of const declaration for variables that are never modified after declared.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets a write reference from a given variable if the variable is modified only
 * once.
 *
 * @param {escope.Variable} variable - A variable to get.
 * @returns {escope.Reference|null} A write reference or null.
 */
function getWriteReferenceIfOnce(variable) {
    var retv = null;

    var references = variable.references;
    for (var i = 0; i < references.length; ++i) {
        var reference = references[i];

        if (reference.isWrite()) {
            if (retv && !(retv.init && reference.init)) {
                // This variable is modified two or more times.
                return null;
            }
            retv = reference;
        }
    }

    return retv;
}

/**
 * Gets a function which checks whether or not a given reference is inside of
 * the specified scope.
 *
 * @param {escope.Scope} scope - A scope to check.
 * @returns {function} A function which checks whether or not a given reference
 *      is inside of the scope.
 */
function isInScope(scope) {
    var sRange = scope.block.range;
    return function(reference) {
        var rRange = reference.from.block.range;
        return sRange[0] <= rRange[0] && rRange[1] <= sRange[1];
    };
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    /**
     * Searches and reports variables that are never modified after declared.
     * @param {Scope} scope - A scope of the search domain.
     * @returns {void}
     */
    function checkForVariables(scope) {
        // Skip the TDZ type.
        if (scope.type === "TDZ") {
            return;
        }

        var variables = scope.variables;
        for (var i = 0; i < variables.length; ++i) {
            var variable = variables[i];
            var def = variable.defs[0];
            var declaration = def && def.parent;
            var statement = declaration && declaration.parent;
            var references = variable.references;
            var identifier = variable.identifiers[0];

            // Skips excludes `let`.
            // And skips if it's at `ForStatement.init`.
            if (!declaration ||
                declaration.type !== "VariableDeclaration" ||
                declaration.kind !== "let" ||
                (statement.type === "ForStatement" && statement.init === declaration)
            ) {
                continue;
            }

            var writer = getWriteReferenceIfOnce(variable);
            if (writer && references.every(isInScope(writer.from))) {
                context.report({
                    node: identifier,
                    message: "'{{name}}' is never modified, use 'const' instead.",
                    data: identifier
                });
            }
        }
    }

    /**
     * Adds multiple items to the tail of an array.
     * @param {any[]} array - A destination to add.
     * @param {any[]} values - Items to be added.
     * @returns {void}
     */
    var pushAll = Function.apply.bind(Array.prototype.push);

    return {
        "Program:exit": function() {
            var stack = [context.getScope()];
            while (stack.length) {
                var scope = stack.pop();
                pushAll(stack, scope.childScopes);

                checkForVariables(scope);
            }
        }
    };

};

module.exports.schema = [];
