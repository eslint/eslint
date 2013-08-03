/**
 * @fileoverview Rule to flag use of duplicate keys in an object.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "ObjectExpression": function(node) {

            // Object that will be a map of properties--safe because we will
            // prefix all of the keys.
            var nodeProps = {};

            node.properties.forEach(function(property) {

                // Create a safe key by prefixing with "$-".
                var safeKey = "$-" + (property.key.name || property.key.value);

                if (nodeProps[safeKey]) {
                    context.report(node, "Duplicate key '{{key}}'.", { key: safeKey.split("-")[1] });
                } else {
                    nodeProps[safeKey] = true;
                }
            });

        }
    };

};
