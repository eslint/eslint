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
    if (node.object.name === "Object" || (node.object.type === "ObjectExpression" && node.object.properties.length === 0)) {
        return true;
    }
    return checkForObject(node.object);
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
            CallExpression(node) {
                const calleePropertyName = astUtils.getStaticPropertyName(node.callee);
                const isObject = checkForObject(node.callee);
                const objectPropertyName = astUtils.getStaticPropertyName(node.callee.object);

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
