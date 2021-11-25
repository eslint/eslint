/**
 * @fileoverview Prefers Object.hasOwn instead of Object.prototype.hasOwnProperty
 * @author Nitin Kumar, Gautam Arora
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

/**
 * Checks to see if a property name object exists in the subtree recursively.
 * @param {node} node to evalutate.
 * @returns {boolean} `true` if object property exists, `false` otherwise.
 */
function checkForObject(node) {
    if (!node.object) {
        return false;
    }

    /*
     * Object.hasOwnProperty.call(obj, prop) or ({}).hasOwnProperty.call(obj, prop) - `true`
     * ({ foo }.hasOwnProperty.call(obj, prop)) - `false`, object literal should be empty
     */
    if (node.object.name === "Object" || (node.object.type === "ObjectExpression" && node.object.properties.length === 0)) {
        return true;
    }

    const propertyName = astUtils.getStaticPropertyName(node.object);

    if (propertyName === "hasOwnProperty" || propertyName === "prototype") {
        return checkForObject(node.object);
    }

    return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "disallow use of Object.prototype.hasOwnProperty.call(…) and prefer use of Object.hasOwn(…)",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-object-has-own"
        },
        schema: [],
        messages: {
            useHasOwn: "Prefer using Object.hasOwn(…) over Object.prototype.hasOwnProperty.call(…)."
        }
    },
    create(context) {
        return {
            CallExpression(node) {
                const calleePropertyName = astUtils.getStaticPropertyName(node.callee);
                const objectPropertyName = astUtils.getStaticPropertyName(node.callee.object);
                const isObject = checkForObject(node.callee);

                if (
                    calleePropertyName === "call" &&
                    objectPropertyName === "hasOwnProperty" &&
                    isObject
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
