/**
 * @fileoverview Rule to flag statements without curly braces
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "IfStatement": function(node) {

            if (node.consequent.type !== "BlockStatement") {
                context.report(node, "Expected { after 'if' condition.");
            }

            if (node.alternate && node.alternate.type !== "BlockStatement" &&
                    node.alternate.type !== "IfStatement") {
                context.report(node, "Expected { after 'else'.");
            }
        },

        "WhileStatement": function(node) {

            if (node.body.type !== "BlockStatement") {
                context.report(node, "Expected { after 'while' condition.");
            }

        },

        "DoWhileStatement": function (node) {

            if (node.body.type !== "BlockStatement") {
                context.report(node, "Expected { after 'do'.");
            }

        },

        "ForStatement": function(node) {

            if (node.body.type !== "BlockStatement") {
                context.report(node, "Expected { after 'for' condition.");
            }

        }
    };

};
