/**
 * @fileoverview Rule to flag when re-assigning native objects
 * @author Ilya Volodin
 */

"use strict";

var globals = require("globals");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var NATIVE_OBJECTS = Object.keys(globals.builtin);

module.exports = function(context) {

    var config = context.options[0];
    var exceptions = config && config.exceptions;
    var forbiddenNames = NATIVE_OBJECTS.reduce(function(retv, builtIn) {
        if (exceptions == null || exceptions.indexOf(builtIn) === -1) {
            retv[builtIn] = true;
        }
        return retv;
    }, Object.create(null));

    /**
     * Reports if a given reference's name is same as native object's.
     * @param {Reference} reference - A reference to check.
     * @param {int} index - The index of the reference in the references.
     * @param {Reference[]} references - The array that the reference belongs to.
     * @returns {void}
     */
    function checkThroughReference(reference, index, references) {
        var identifier = reference.identifier;

        if (identifier != null &&
            forbiddenNames[identifier.name] &&
            reference.init === false &&
            reference.isWrite() &&
            // Destructuring assignments can have multiple default value,
            // so possibly there are multiple writeable references for the same identifier.
            (index === 0 || references[index - 1].identifier !== identifier)
        ) {
            context.report(
                identifier,
                "{{name}} is a read-only native object.",
                {name: identifier.name});
        }
    }

    /**
     * Finds and reports variables that its name is same as native object's.
     * @param {Variable} variable - A variable to check.
     * @returns {void}
     */
    function checkVariable(variable) {
        if (forbiddenNames[variable.name]) {
            context.report(
                variable.identifiers[0],
                "Redefinition of '{{name}}'.",
                {name: variable.name});
        }
    }

    return {
        // Checks assignments of global variables.
        // References to implicit global variables are not resolved,
        // so those are in the `through` of the global scope.
        "Program": function() {
            context.getScope().through.forEach(checkThroughReference);
        },

        "VariableDeclaration": function(node) {
            context.getDeclaredVariables(node).forEach(checkVariable);
        }
    };

};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "exceptions": {
                "type": "array",
                "items": {"enum": NATIVE_OBJECTS},
                "uniqueItems": true
            }
        },
        "additionalProperties": false
    }
];
