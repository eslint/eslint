/**
 * @fileoverview Rule to flag use of duplicate property identifers in object literals
 * @author James Allardice
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "ObjectExpression": function(node) {

            var keys = {};

            node.properties.forEach(function (property) {
                var identifier = property.key.name;
                keys[identifier] = ++keys[identifier] || 1;
            });

            Object.keys(keys).forEach(function (key) {
                if (keys[key] > 1) {
                    context.report(node, "Duplicate key '" + key + "'.");
                }
            });
        }
    };

};
