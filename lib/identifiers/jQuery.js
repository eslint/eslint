/**
 * @fileoverview Identifier for jQuery framework
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Identifier Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "CallExpression": function(node) {
            if (node.callee && (node.callee.name === "$" || node.callee.name === "jQuery")) {
                //Set jQuery as a framework used
                context.addContext(node, "jQuery");
                context.isInContext("jQuery");
            }
        },

        "MemberExpression": function(node) {

            if (node.object && (node.object.name === "$" || node.object.name === "jQuery")) {
                //Set jQuery as a framework used
                context.addContext(node, "jQuery");
            }
        },

        "CallExpression:after": function(node) {
            context.removeContext(node, "jQuery");
        },

        "MemberExpression:after": function(node) {
            context.removeContext(node, "jQuery");
        }
    };

};
