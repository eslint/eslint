/**
 * @fileoverview A rule to disallow modifying variables of class declarations
 * @author Toru Nagashima
 */

"use strict";

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow reassigning class members",
            category: "ECMAScript 6",
            recommended: true
        },

        schema: []
    },

    create: function(context) {

        /**
         * Finds and reports references that are non initializer and writable.
         * @param {Variable} variable - A variable to check.
         * @returns {void}
         */
        function checkVariable(variable) {
            astUtils.getModifyingReferences(variable.references).forEach(function(reference) {
                context.report(
                    reference.identifier,
                    "'{{name}}' is a class.",
                    {name: reference.identifier.name});

            });
        }

        /**
         * Finds and reports references that are non initializer and writable.
         * @param {ASTNode} node - A ClassDeclaration/ClassExpression node to check.
         * @returns {void}
         */
        function checkForClass(node) {
            context.getDeclaredVariables(node).forEach(checkVariable);
        }

        return {
            "ClassDeclaration": checkForClass,
            "ClassExpression": checkForClass
        };

    }
};
