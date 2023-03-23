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
const astUtils = require("./utils/ast-utils.js");
const { isValidWithUnicodeFlag } = require("./utils/unicode/regular-expressions");

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

        hasSuggestions: true,

        messages: {
            addUFlag: "Add the 'u' flag.",
            requireUFlag: "Use the 'u' flag."
        },

        schema: []
    },

    create(context) {
        return {
            "Literal[regex]"(node) {
                const flags = node.regex.flags || "";

                if (!flags.includes("u")) {
                    context.report({
                        messageId: "requireUFlag",
                        node,
                        suggest: isValidWithUnicodeFlag(context.languageOptions.ecmaVersion, node.regex.pattern)
                            ? [
                                {
                                    fix(fixer) {
                                        return fixer.insertTextAfter(node, "u");
                                    },
                                    messageId: "addUFlag"
                                }
                            ]
                            : null
                    });
                }
            },

            Program() {
                const scope = context.getScope();
                const sourceCode = context.getSourceCode();
                const tracker = new ReferenceTracker(scope);
                const trackMap = {
                    RegExp: { [CALL]: true, [CONSTRUCT]: true }
                };

                for (const { node } of tracker.iterateGlobalReferences(trackMap)) {
                    const [patternNode, flagsNode] = node.arguments;
                    const pattern = getStringIfConstant(patternNode, scope);
                    const flags = getStringIfConstant(flagsNode, scope);

                    if (!flagsNode || (typeof flags === "string" && !flags.includes("u"))) {
                        context.report({
                            messageId: "requireUFlag",
                            node,
                            suggest: typeof pattern === "string" && isValidWithUnicodeFlag(context.languageOptions.ecmaVersion, pattern)
                                ? [
                                    {
                                        fix(fixer) {
                                            if (flagsNode) {
                                                if ((flagsNode.type === "Literal" && typeof flagsNode.value === "string") || flagsNode.type === "TemplateLiteral") {
                                                    const flagsNodeText = sourceCode.getText(flagsNode);

                                                    return fixer.replaceText(flagsNode, [
                                                        flagsNodeText.slice(0, flagsNodeText.length - 1),
                                                        flagsNodeText.slice(flagsNodeText.length - 1)
                                                    ].join("u"));
                                                }

                                                return fixer.insertTextAfter(node.arguments[1], " + \"u\"");
                                            }

                                            const penultimateToken = sourceCode.getLastToken(node, { skip: 1 }); // skip closing parenthesis

                                            return fixer.insertTextAfter(
                                                penultimateToken,
                                                astUtils.isCommaToken(penultimateToken)
                                                    ? ' "u",'
                                                    : ', "u"'
                                            );
                                        },
                                        messageId: "addUFlag"
                                    }
                                ]
                                : null
                        });
                    }
                }
            }
        };
    }
};
