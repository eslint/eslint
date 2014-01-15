/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "BlockStatement": function(node) {
            var ancestors = context.getAncestors(),
                parentType = ancestors[ancestors.length - 1].type;

            if (/FunctionExpression|FunctionDeclaration|TryStatement|CatchClause/.test(parentType)) {
                return;
            }

            if (node.body.length === 0) {
                context.report(node, "Empty block statement.");
            }
        },

        "SwitchStatement": function(node) {

            if (typeof node.cases === "undefined" || node.cases.length === 0) {
                context.report(node, "Empty switch statement.");
            }
        }
    };

};
