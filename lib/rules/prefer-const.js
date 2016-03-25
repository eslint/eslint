/**
 * @fileoverview A rule to suggest using of const declaration for variables that are never reassigned after declared.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var PATTERN_TYPE = /^(?:.+?Pattern|RestElement|Property)$/;
var DECLARATION_HOST_TYPE = /^(?:Program|BlockStatement|SwitchCase)$/;

/**
 * Adds multiple items to the tail of an array.
 *
 * @param {any[]} array - A destination to add.
 * @param {any[]} values - Items to be added.
 * @returns {void}
 */
var pushAll = Function.apply.bind(Array.prototype.push);

/**
 * Checks whether a given node is located at `ForStatement.init` or not.
 *
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} `true` if the node is located at `ForStatement.init`.
 */
function isInitOfForStatement(node) {
    return node.parent.type === "ForStatement" && node.parent.init === node;
}

/**
 * Checks whether a given Identifier node becomes a VariableDeclaration or not.
 *
 * @param {ASTNode} identifier - An Identifier node to check.
 * @returns {boolean} `true` if the node can become a VariableDeclaration.
 */
function canBecomeVariableDeclaration(identifier) {
    var node = identifier.parent;
    while (PATTERN_TYPE.test(node.type)) {
        node = node.parent;
    }

    return (
        node.type === "VariableDeclarator" ||
        (
            node.type === "AssignmentExpression" &&
            node.parent.type === "ExpressionStatement" &&
            DECLARATION_HOST_TYPE.test(node.parent.parent.type)
        )
    );
}

/**
 * Gets the WriteReference of a given variable if the variable is never
 * reassigned.
 *
 * @param {escope.Variable} variable - A variable to get.
 * @returns {escope.Reference|null} The singular WriteReference or null.
 */
function getWriteReferenceIfOnce(variable) {
    var retv = null;

    var references = variable.references;
    for (var i = 0; i < references.length; ++i) {
        var reference = references[i];

        if (reference.isWrite()) {
            if (retv && !(retv.init && reference.init)) {

                // This variable is reassigned.
                return null;
            }
            retv = reference;
        }
    }

    return retv;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var variables = null;

    /**
     * Reports a given variable if the singular WriteReference of the variable
     * exists in the same scope as the declaration.
     *
     * @param {escope.Variable} variable - A variable to check.
     * @returns {void}
     */
    function checkVariable(variable) {
        if (variable.eslintUsed) {
            return;
        }

        var writer = getWriteReferenceIfOnce(variable);
        if (writer &&
            writer.from === variable.scope &&
            canBecomeVariableDeclaration(writer.identifier)
        ) {
            context.report({
                node: writer.identifier,
                message: "'{{name}}' is never reassigned, use 'const' instead.",
                data: variable
            });
        }
    }

    return {
        "Program": function() {
            variables = [];
        },

        "Program:exit": function() {
            variables.forEach(checkVariable);
            variables = null;
        },

        "VariableDeclaration": function(node) {
            if (node.kind === "let" && !isInitOfForStatement(node)) {
                pushAll(variables, context.getDeclaredVariables(node));
            }
        }
    };
};

module.exports.schema = [];
