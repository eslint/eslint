/**
 * @fileoverview Rule to flag use of function declaration identifiers as variables.
 * @author Ian Christian Myers
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var unresolved = Object.create(null);

    /**
     * Collects unresolved references from the global scope, then creates a map to references from its name.
     * Usage of the map is explained at `checkVariable(variable)`.
     * @returns {void}
     */
    function collectUnresolvedReferences() {
        unresolved = Object.create(null);

        var references = context.getScope().through;
        for (var i = 0; i < references.length; ++i) {
            var reference = references[i];
            var name = reference.identifier.name;

            if (name in unresolved === false) {
                unresolved[name] = [];
            }
            unresolved[name].push(reference);
        }
    }

    /**
     * Reports a reference if is non initializer and writable.
     * @param {Reference} reference - A reference to check.
     * @param {int} index - The index of the reference in the references.
     * @param {Reference[]} references - The array that the reference belongs to.
     * @returns {void}
     */
    function checkReference(reference, index, references) {
        var identifier = reference.identifier;

        if (identifier != null &&
            reference.init === false &&
            reference.isWrite() &&
            // Destructuring assignments can have multiple default value,
            // so possibly there are multiple writeable references for the same identifier.
            (index === 0 || references[index - 1].identifier !== identifier)
        ) {
            context.report(
                identifier,
                "'{{name}}' is a function.",
                {name: identifier.name});
        }
    }

    /**
     * Finds and reports references that are non initializer and writable.
     * @param {Variable} variable - A variable to check.
     * @returns {void}
     */
    function checkVariable(variable) {
        if (variable.defs[0].type === "FunctionName") {
            // If the function is in global scope, its references are not resolved (by escope's design).
            // So when references of the function are nothing, this checks in unresolved.
            if (variable.references.length > 0) {
                variable.references.forEach(checkReference);
            } else if (unresolved[variable.name] != null) {
                unresolved[variable.name].forEach(checkReference);
            }
        }
    }

    /**
     * Checks parameters of a given function node.
     * @param {ASTNode} node - A function node to check.
     * @returns {void}
     */
    function checkForFunction(node) {
        context.getDeclaredVariables(node).forEach(checkVariable);
    }

    return {
        "Program": collectUnresolvedReferences,
        "FunctionDeclaration": checkForFunction,
        "FunctionExpression": checkForFunction
    };

};

module.exports.schema = [];
