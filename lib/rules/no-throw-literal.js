/**
 * @fileoverview Rule to restrict what can be thrown as an exception.
 * @author Dieter Oberkofler
 */

"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow throwing literals as exceptions",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/no-throw-literal"
        },

        schema: [],

        messages: {
            object: "Expected an error object to be thrown.",
            undef: "Do not throw undefined."
        }
    },

    create(context) {

        return {

            ThrowStatement(node) {
                if (!astUtils.couldBeError(node.argument)) {
                    context.report({ node, messageId: "object" });
                } else if (node.argument.type === "Identifier") {
                    if (node.argument.name === "undefined") {
                        context.report({ node, messageId: "undef" });
                    }
                }

            }

        };

    }
};
