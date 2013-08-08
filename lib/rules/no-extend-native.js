/**
 * @fileoverview Rule to flag adding properties to native object's prototypes.
 * @author David Nelson
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "AssignmentExpression": function(node) {
            if(node.left.object.object.name === "Object" && node.left.property.name.length > 0) {
                context.report(node, "Object prototype is read only, properties should not be added.");
            }
        }
    };

};