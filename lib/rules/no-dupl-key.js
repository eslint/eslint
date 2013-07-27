/**
 * @fileoverview Rule to flag duplicate object keys
 * @author Stephen Murray <spmurrayzzz>
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var message = "Duplicate key in object expression.";

    return {

        "ObjectExpression": function(node) {
            var keys    = {},
                props   = node.properties;

            for (var i = 0; i < props.length; i++) {
                var keyName = props[i].key.name;
                if (keys[keyName]) {
                    context.report(node, message);
                } else {
                    keys[keyName] = true;
                }
            }
        }
    };

};
