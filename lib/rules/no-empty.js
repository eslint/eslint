/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "BlockStatement": function(node) {
            var ancestors = context.getAncestors(), parentType;

            if (ancestors.length) {
                parentType = ancestors[ancestors.length - 1].type;
                if (parentType === "FunctionExpression" || parentType === "FunctionDeclaration") {
                    return;
                }
            }

            if (node.body.length === 0) {
                context.report(node, "Empty block statement.");
            }
        },

        "SwitchStatement": function(node) {

            if (typeof node.cases === "undefined") {
                context.report(node, "Empty switch statement.");
            }
        },

        "EmptyStatement": function(node) {
            context.report(node, "Empty statement.");
        }
    };

};
