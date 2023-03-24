/**
 * @fileoverview Rule to enforce the use of `u` flag on RegExp.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const {
    CALL,
    CONSTRUCT,
    ReferenceTracker,
    getStringIfConstant
} = require("@eslint-community/eslint-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Enforce the use of `u` flag on RegExp",
            recommended: false,
            url: "https://eslint.org/docs/rules/require-unicode-regexp"
        },

        messages: {
            requireUFlag: "Use the 'u' flag."
        },

        schema: []
    },

    create(context) {

        const sourceCode = context.getSourceCode();

        return {
            "Literal[regex]"(node) {
                const flags = node.regex.flags || "";

                if (!flags.includes("u")) {
                    context.report({ node, messageId: "requireUFlag" });
                }
            },

            Program(node) {
                const scope = sourceCode.getScope(node);
                const tracker = new ReferenceTracker(scope);
                const trackMap = {
                    RegExp: { [CALL]: true, [CONSTRUCT]: true }
                };

                for (const { node: refNode } of tracker.iterateGlobalReferences(trackMap)) {
                    const flagsNode = refNode.arguments[1];
                    const flags = getStringIfConstant(flagsNode, scope);

                    if (!flagsNode || (typeof flags === "string" && !flags.includes("u"))) {
                        context.report({ node: refNode, messageId: "requireUFlag" });
                    }
                }
            }
        };
    }
};
