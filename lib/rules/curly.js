/**
 * @fileoverview Rule to flag statements without curly braces
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "IfStatement": function(node) {

            if (node.consequent.type !== "BlockStatement") {
                context.report(node, "Expected { after 'if' condition.");
            }

            if (node.alternate && node.alternate.type !== "BlockStatement") {
                context.report(node, "Expected { after 'else'.");
            }
        },

        "WhileStatement": function(node) {

            if (node.body.type !== "BlockStatement") {
                context.report(node, "Expected { after 'while' condition.");
            }

        },

        "ForStatement": function(node) {

            if (node.body.type !== "BlockStatement") {
                context.report(node, "Expected { after 'for' condition.");
            }

        }
    };

};
