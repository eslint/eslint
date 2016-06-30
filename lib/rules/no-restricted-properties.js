/**
 * @fileoverview Rule to disallow certain object properties
 * @author Will Klein
 * @copyright 2016 Will Klein. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    if (context.options.length === 0) {
        return {};
    }

    var restrictedProperties = context.options.reduce(function(restrictions, option) {
        var objectName = option.object;
        var propertyName = option.property;

        restrictions[objectName] = restrictions[objectName] || {};
        restrictions[objectName][propertyName] = {
            message: option.message
        };

        return restrictions;
    }, {});

    return {
        "MemberExpression": function(node) {
            var objectName = node.object && node.object.name;
            var propertyName = node.property && node.property.name;
            var matchedObject = restrictedProperties[objectName];
            var matchedObjectProperty = matchedObject && matchedObject[propertyName];

            if (matchedObjectProperty) {
                var message = matchedObjectProperty.message ? " " + matchedObjectProperty.message : "";

                context.report(node, "'{{objectName}}.{{propertyName}}' is restricted from being used.{{message}}", {
                    objectName: objectName,
                    propertyName: propertyName,
                    message: message
                });
            }
        }
    };
};

module.exports.schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "object": {
                "type": "string"
            },
            "property": {
                "type": "string"
            },
            "message": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "required": [
            "object",
            "property"
        ]
    },
    "uniqueItems": true
};
