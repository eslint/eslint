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
                var keyName = property.key.name || property.key.value;
                var key = property.kind + "-" + keyName;

                if (nodeProps[key]) {
                    context.report(node, "Duplicate key '{{key}}'.", { key: keyName });
                } else {
                    nodeProps[key] = true;
                }
            });

        }
    };

};
