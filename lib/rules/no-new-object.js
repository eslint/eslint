/**
 * @fileoverview A rule to disallow calls to the Object constructor
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "NewExpression": function(node) {
            if (node.callee.name === "Object") {
                context.report(node, "Use the object literal notation {}");
            }
        }
    };

};
