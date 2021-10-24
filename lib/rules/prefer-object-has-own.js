/**
 * @fileoverview Prefers Object.hasOwn instead of Object.prototype.hasOwnProperty
 * @author Gautam Arora <gautamarora6248@gmail.com>
 * See LICENSE file in root directory for full license.
 */

"use strict";

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description:
                "disallow use of Object.prototype.hasOwnProperty and prefer use of Object.hasOwn",
            recommended: "false",
            url: "https://eslint.org/docs/rules/prefer-object-has-own"
        },
        schema: [],
        messages: {
            useHasOwnMessage:
                "Use Object.hasOwn instead of Object.prototype.hasOwnProperty."
        }
    },
    create(context) {

        // declare the state of the rule
        return {
            MemberExpression(node) {
                if (
                    node.property.name === "hasOwnProperty" &&
                    node.object.object.name === "Object"
                ) {
                    const messageId = "useHasOwnMessage";

                    context.report({
                        messageId,
                        node
                    });
                }
            }
        };
    }
};
