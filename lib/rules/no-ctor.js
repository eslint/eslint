/**
 * @fileoverview Rule to flag when using constructor for wrapper objects
 * @author Ilya Volodin
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "NewExpression": function(node) {
            var wrapperObjects = ["String", "Number", "Boolean", "Math", "JSON"];
            if (wrapperObjects.indexOf(node.callee.name) > -1) {
                context.report(node, "Do not use " + node.callee.name + " as a constructor");
            }
        }
    };

};
