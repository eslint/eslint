/**
 * @fileoverview Rule to disallow certain object properties
 * @author Will Klein & Eli White
 */

"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow certain properties on certain objects",
            category: "Best Practices",
            recommended: false
        },

        schema: {
            type: "array",
            items: {
                anyOf: [ // `object` and `property` are both optional, but at least one of them must be provided.
                    {
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
                        required: ["object"]
                    },
                    {
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
                        required: ["property"]
                    }
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

        const restrictedProperties = new Map();
        const globallyRestrictedObjects = new Map();
        const globallyRestrictedProperties = new Map();

        restrictedCalls.forEach(option => {
            const objectName = option.object;
            const propertyName = option.property;

            if (typeof objectName === "undefined") {
                globallyRestrictedProperties.set(propertyName, {message: option.message});
            } else if (typeof propertyName === "undefined") {
                globallyRestrictedObjects.set(objectName, {message: option.message});
            } else {
                if (!restrictedProperties.has(objectName)) {
                    restrictedProperties.set(objectName, new Map());
                }

                restrictedProperties.get(objectName).set(propertyName, {
                    message: option.message
                });
            }
        });

        return {
            MemberExpression(node) {
                const objectName = node.object && node.object.name;
                const propertyName = astUtils.getStaticPropertyName(node);
                const matchedObject = restrictedProperties.get(objectName);
                const matchedObjectProperty = matchedObject ? matchedObject.get(propertyName) : globallyRestrictedObjects.get(objectName);
                const globalMatchedProperty = globallyRestrictedProperties.get(propertyName);

                if (matchedObjectProperty) {
                    const message = matchedObjectProperty.message ? " " + matchedObjectProperty.message : "";

                    context.report(node, "'{{objectName}}.{{propertyName}}' is restricted from being used.{{message}}", {
                        objectName,
                        propertyName,
                        message
                    });
                } else if (globalMatchedProperty) {
                    const message = globalMatchedProperty.message ? " " + globalMatchedProperty.message : "";

                    context.report(node, "'{{propertyName}}' is restricted from being used.{{message}}", {
                        propertyName,
                        message
                    });
                }
            }
        };
    }
};
