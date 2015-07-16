/**
 * @fileoverview Disallow reassignment of function parameters.
 * @author Nat Burns
 * @copyright 2014 Nat Burns. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

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
                "Assignment to function parameter '{{name}}'.",
                {name: identifier.name});
        }
    }

    /**
     * Finds and reports references that are non initializer and writable.
     * @param {Variable} variable - A variable to check.
     * @returns {void}
     */
    function checkVariable(variable) {
        if (variable.defs[0].type === "Parameter") {
            variable.references.forEach(checkReference);
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
        "FunctionDeclaration": checkForFunction,
        "FunctionExpression": checkForFunction,
        "ArrowFunctionExpression": checkForFunction
    };

};

module.exports.schema = [];
