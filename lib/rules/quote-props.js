/**
 * @fileoverview Rule to flag non-quoted property names in object literals.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Property": function(node) {
            var key = node.key;

            // Check if the property name is quoted
            if (key.type !== "Literal") {
                context.report(node, "Non-quoted property `{{key}}` found.", { key: key.name });
            }

        }
    };

};
