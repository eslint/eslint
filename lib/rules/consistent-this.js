/**
 * @fileoverview Rule to enforce consistent naming of "this" context variables
 * @author Raphael Pigulla
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "VariableDeclaration": function(node) {
            var alias = context.options[0];

            node.declarations.forEach(function(declaration) {
                if (declaration.id.name === alias &&
                        !(declaration.init && declaration.init.type === "ThisExpression")) {

                    context.report(
                        node,
                        "Designated 'this' alias '{{alias}}' is not assigned " +
                            "to the current execution context.",
                        { alias: declaration.id.name }
                    );
                }

                if (declaration.init &&
                        declaration.init.type === "ThisExpression" &&
                        declaration.id.name !== alias) {

                    context.report(
                        node,
                        "Unexpected alias '{{alias}}' for 'this'.",
                        { alias: declaration.id.name }
                    );
                }
            });
        }
    };

};
