/**
 * @fileoverview Prefers Object.hasOwn instead of Object.prototype.hasOwnProperty
 * @author Nitin Kumar, Gautam Arora
 */

"use strict";

/**
 * Checks to see if a property name object exists in the subtree recursively.
 * @param {node} node to evalutate.
 * @returns {boolean} `True` if object property exists, false otherwise.
 */
function checkForObject(node) {
    if (!node.object) {
        return false;
    }
    if (node.object.name === "Object") {
        return true;
    }
    return checkForObject(node.object);
}


module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "disallow use of Object.prototype.hasOwnProperty and prefer use of Object.hasOwn",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-object-has-own"
        },
        schema: [],
        messages: {
            useHasOwn: "Prefer using hasOwn property instead of hasOwnProperty."
        }
    },
    create(context) {
        return {
            MemberExpression(node) {
                const propertyName = node.property.name;
                const isObject = checkForObject(node);
                const isObjectExpression =
                    node.object.type === "ObjectExpression";

                if (
                    propertyName === "hasOwnProperty" &&
                    (isObject || isObjectExpression)
                ) {
                    context.report({
                        node,
                        messageId: "useHasOwn"
                    });
                }
            }
        };
    }
};
