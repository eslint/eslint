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
                context.report(node, "{{functionName}} function has too many parameters", { functionName: node.id.name });
            }
        },

        "FunctionExpression": function(node) {
            if (node.params.length > numParams) {
                context.report(node, "{{functionName}} function has too many parameters", { functionName: node.id ? node.id.name : "Anonymous" });
            }
        }
    };

};
