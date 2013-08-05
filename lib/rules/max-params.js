/**
 * @fileoverview Rule to flag when a function has too many parameters
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var numParams = context.options[0] || 3;

    return {

        "FunctionDeclaration": function(node) {
            if (node.params.length > numParams) {
                context.report(node, "This function has too many parameters ({{count}}). Maximum allowed is {{max}}.", {
                    count: node.params.length,
                    max: numParams
                });
            }
        },

        "FunctionExpression": function(node) {
            if (node.params.length > numParams) {
                context.report(node, "This function has too many parameters ({{count}}). Maximum allowed is {{max}}.", {
                    count: node.params.length,
                    max: numParams
                });
            }
        }
    };

};
