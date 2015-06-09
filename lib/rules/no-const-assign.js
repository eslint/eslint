/**
 * @fileoverview A rule to disallow modifying variables that are declared using `const`
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
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
                "`{{name}}` is constant.",
                {name: identifier.name});
        }
    }

    /**
     * Finds and reports references that are non initializer and writable.
     * @param {Variable} variable - A variable to check.
     * @returns {void}
     */
    function checkVariable(variable) {
        variable.references.forEach(checkReference);
    }

    return {
        "VariableDeclaration": function(node) {
            if (node.kind === "const") {
                context.getDeclaredVariables(node).forEach(checkVariable);
            }
        }
    };

};

module.exports.schema = [];
