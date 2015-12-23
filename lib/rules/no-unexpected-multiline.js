/**
 * @fileoverview Rule to spot scenarios where a newline looks like it is ending a statement, but is not.
 * @author Glen Mailer
 * @copyright 2015 Glen Mailer
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = function(context) {

    var FUNCTION_MESSAGE = "Unexpected newline between function and ( of function call.";
    var PROPERTY_MESSAGE = "Unexpected newline between object and [ of property access.";

    /**
     * Check to see if there is a newline between the node and the following open bracket
     * line's expression
     * @param {ASTNode} node The node to check.
     * @param {string} msg The error message to use.
     * @returns {void}
     * @private
     */
    function checkForBreakAfter(node, msg) {
        var paren = context.getTokenAfter(node);
        while (paren.value === ")") {
            paren = context.getTokenAfter(paren);
        }

        if (paren.loc.start.line !== node.loc.end.line) {
            context.report(node, paren.loc.start, msg, { char: paren.value });
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {

        "MemberExpression": function(node) {
            if (!node.computed) {
                return;
            }
            checkForBreakAfter(node.object, PROPERTY_MESSAGE);
        },

        "CallExpression": function(node) {
            if (node.arguments.length === 0) {
                return;
            }
            checkForBreakAfter(node.callee, FUNCTION_MESSAGE);
        }
    };

};

module.exports.schema = [];
