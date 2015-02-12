/**
 * @fileoverview disallow functions that share a name with a variable
 * @author Vladimir Antonov
 * @copyright 2014 Vladimir Antonov. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function check(node) {
            var name = node.id && node.id.name,
                scope = context.getScope().upper;

            if (!scope.variables || node.type === "FunctionExpression") {
                scope = scope.upper;
            }

            scope.variables.forEach(function(variable) {
                if (variable.name === name) {
                    context.report(node, "function share a name with a variable {{name}}", { name: name });
                }
            });
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": check,
        "FunctionExpression": check
    };
};
