/**
 * @fileoverview Rule to flag use of a probable unsafe integer
 * @author Joshua Westerheide
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks to see if a CallExpression's callee node is `parseInt` or
 * `Number.parseInt`.
 * @param {ASTNode} calleeNode The callee node to evaluate.
 * @returns {boolean} True if the callee is `parseInt` or `Number.parseInt`,
 * false otherwise.
 */
function isParseInt(calleeNode) {
    switch (calleeNode.type) {
        case "Identifier":
            return calleeNode.name === "parseInt";
        case "MemberExpression":
            return calleeNode.object.type === "Identifier" &&
                calleeNode.object.name === "Number" &&
                calleeNode.property.type === "Identifier" &&
                calleeNode.property.name === "parseInt";

        // no default
    }

    return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow unsafe integers",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-unsafe-integer"
        },

        schema: [],

        messages: {
            unsafe: "Possible unsafe integer {{value}}.",
            "unsafe-parsing": "Possible unsafe integer {{value}} parsing."
        }
    },

    create(context) {
        return {
            Literal(node) {
                if (typeof node.value === "number" && !Number.isSafeInteger(node.value)) {
                    context.report({ node, messageId: "unsafe", data: { value: node.raw } });
                }
            },

            "CallExpression[arguments.length>=1]"(node) {
                const strNode = node.arguments[0];

                if (
                    strNode.type === "Literal" &&
                    typeof strNode.value === "string" &&
                    isParseInt(node.callee)
                ) {
                    let radix = 10;

                    if (node.arguments.length === 2) {
                        radix = node.arguments[1].value;
                    }

                    const num = Number.parseInt(strNode.value, radix);

                    if (!Number.isSafeInteger(num)) {
                        context.report({ node, messageId: "unsafe-parsing", data: { value: strNode.value } });
                    }
                }
            }
        };
    }
};
