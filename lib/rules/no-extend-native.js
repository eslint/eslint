/**
 * @fileoverview Rule to flag adding properties to native object's prototypes.
 * @author David Nelson
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var nativeObjects = require("../../conf/native-objects.js").nativeObjects,
    i = 0,
    nativeObjectsLength = nativeObjects.length;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "AssignmentExpression": function(node) {
            for(i; i < nativeObjectsLength; i++) {
                if(typeof(node.left.object) !== "undefined" && typeof(node.left.object.object) !== "undefined" &&
                    node.left.object.object.name === nativeObjects[i] && node.left.property.name.length > 0) {
                    context.report(node, nativeObjects[i] + " prototype is read only, properties should not be added.");

                }
            }
        }
    };

};
