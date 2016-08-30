/**
 * @fileoverview Rule to disallow certain object properties
 * @author Will Klein & Eli White
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow certain properties on certain objects",
            category: "Node.js and CommonJS",
            recommended: false
        },

        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    object: {
                        type: "string"
                    },
                    property: {
                        type: "string"
                    },
                    message: {
                        type: "string"
                    }
                },
                additionalProperties: false,
                required: [
                    "object",
                    "property"
                ]
            },
            uniqueItems: true
        }
    },

    create(context) {
        const restrictedCalls = context.options;

        if (restrictedCalls.length === 0) {
            return {};
        }

        const restrictedProperties = context.options.reduce(function(restrictions, option) {
            const objectName = option.object;
            const propertyName = option.property;

            restrictions[objectName] = restrictions[objectName] || {};
            restrictions[objectName][propertyName] = {
                message: option.message
            };

            return restrictions;
        }, {});

        return {
            MemberExpression(node) {
                const objectName = node.object && node.object.name;
                const propertyName = node.property && node.property.name;
                const matchedObject = restrictedProperties[objectName];
                const matchedObjectProperty = matchedObject && matchedObject[propertyName];

                if (matchedObjectProperty) {
                    const message = matchedObjectProperty.message ? " " + matchedObjectProperty.message : "";

                    context.report(node, "'{{objectName}}.{{propertyName}}' is restricted from being used.{{message}}", {
                        objectName,
                        propertyName,
                        message
                    });
                }
            }
        };
    }
};
