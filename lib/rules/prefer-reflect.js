/**
 * @fileoverview Rule to suggest using "Reflect" api over Function/Object methods
 * @author Keith Cirkel <http://keithcirkel.co.uk>
 * @deprecated in ESLint v3.9.0
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require `Reflect` methods where applicable",
            category: "ECMAScript 6",
            recommended: false
        },

        deprecated: true,

        schema: [
            {
                type: "object",
                properties: {
                    exceptions: {
                        type: "array",
                        items: {
                            enum: [
                                "apply",
                                "call",
                                "delete",
                                "defineProperty",
                                "getOwnPropertyDescriptor",
                                "getPrototypeOf",
                                "setPrototypeOf",
                                "isExtensible",
                                "getOwnPropertyNames",
                                "preventExtensions"
                            ]
                        },
                        uniqueItems: true
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const existingNames = {
            apply: "Function.prototype.apply",
            call: "Function.prototype.call",
            defineProperty: "Object.defineProperty",
            getOwnPropertyDescriptor: "Object.getOwnPropertyDescriptor",
            getPrototypeOf: "Object.getPrototypeOf",
            setPrototypeOf: "Object.setPrototypeOf",
            isExtensible: "Object.isExtensible",
            getOwnPropertyNames: "Object.getOwnPropertyNames",
            preventExtensions: "Object.preventExtensions"
        };

        const reflectSubsitutes = {
            apply: "Reflect.apply",
            call: "Reflect.apply",
            defineProperty: "Reflect.defineProperty",
            getOwnPropertyDescriptor: "Reflect.getOwnPropertyDescriptor",
            getPrototypeOf: "Reflect.getPrototypeOf",
            setPrototypeOf: "Reflect.setPrototypeOf",
            isExtensible: "Reflect.isExtensible",
            getOwnPropertyNames: "Reflect.getOwnPropertyNames",
            preventExtensions: "Reflect.preventExtensions"
        };

        const exceptions = (context.options[0] || {}).exceptions || [];

        /**
         * Reports the Reflect violation based on the `existing` and `substitute`
         * @param {Object} node The node that violates the rule.
         * @param {string} existing The existing method name that has been used.
         * @param {string} substitute The Reflect substitute that should be used.
         * @returns {void}
         */
        function report(node, existing, substitute) {
            context.report(node, "Avoid using {{existing}}, instead use {{substitute}}.", {
                existing,
                substitute
            });
        }

        return {
            CallExpression(node) {
                const methodName = (node.callee.property || {}).name;
                const isReflectCall = (node.callee.object || {}).name === "Reflect";
                const hasReflectSubsitute = reflectSubsitutes.hasOwnProperty(methodName);
                const userConfiguredException = exceptions.indexOf(methodName) !== -1;

                if (hasReflectSubsitute && !isReflectCall && !userConfiguredException) {
                    report(node, existingNames[methodName], reflectSubsitutes[methodName]);
                }
            },
            UnaryExpression(node) {
                const isDeleteOperator = node.operator === "delete";
                const targetsIdentifier = node.argument.type === "Identifier";
                const userConfiguredException = exceptions.indexOf("delete") !== -1;

                if (isDeleteOperator && !targetsIdentifier && !userConfiguredException) {
                    report(node, "the delete keyword", "Reflect.deleteProperty");
                }
            }
        };

    }
};
