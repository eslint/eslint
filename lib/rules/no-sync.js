/**
 * @fileoverview Rule to check for properties whose identifier ends with the string Sync
 * @author Matt DuVall<http://mattduvall.com/>
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "MemberExpression": function(node) {
            var propertyName = node.property.name,
                syncRegex = /.*Sync$/;

            if (syncRegex.exec(propertyName) !== null) {
                context.report(node, "Unexpected sync method: '" + propertyName + "'.");
            }
        }
    };

};
