/**
 * @fileoverview Rule to flag use of duplicate property identifers in object literals
 * @author James Allardice & Oral Dalay
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

            for(var identifier in keys){
                if(keys.hasOwnProperty(identifier) && keys[identifier] > 1){
                    context.report(node, "Duplicate key '" + identifier + "'");
                }
            }

        }
    };

};
