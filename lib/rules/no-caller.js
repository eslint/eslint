/**
 * @fileoverview Rule to flag use of arguments.callee and arguments.caller.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "MemberExpression": function(node) {
            var objectName = node.object.name,
                propertyName = node.property.name;

            if (objectName === "arguments" && !node.computed && propertyName && propertyName.match(/^calle[er]$/)) {
                context.report(node, "Avoid arguments.{{property}}.", { property: propertyName });
            }

        }
    };

};
