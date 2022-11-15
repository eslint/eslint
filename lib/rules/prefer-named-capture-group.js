/**
 * @fileoverview Rule to enforce requiring named capture groups in regular expression.
 * @author Pig Fang <https://github.com/g-plane>
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
} = require("eslint-utils");
const regexpp = require("regexpp");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const parser = new regexpp.RegExpParser();

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Enforce using named capture group in regular expression",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-named-capture-group"
        },

        // https://github.com/eslint-community/eslint-plugin-eslint-plugin/issues/281
        // eslint-disable-next-line eslint-plugin/require-meta-has-suggestions -- 👆
        hasSuggestions: true,

        schema: [],

        messages: {
            addGroupName: "Add name to capture group.",
            addNonCapture: "Convert group to non-capturing.",
            required: "Capture group '{{group}}' should be converted to a named or non-capturing group."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        /**
         * Function to check regular expression.
         * @param {string} pattern The regular expression pattern to be check.
         * @param {ASTNode} node AST node which contains regular expression or a call/new expression.
         * @param {ASTNode} regexNode AST node which contains regular expression.
         * @param {boolean} uFlag Flag indicates whether unicode mode is enabled or not.
         * @returns {void}
         */
        function checkRegex(pattern, node, regexNode, uFlag) {
            let ast;

            try {
                ast = parser.parsePattern(pattern, 0, pattern.length, uFlag);
            } catch {

                // ignore regex syntax errors
                return;
            }

            regexpp.visitRegExpAST(ast, {
                onCapturingGroupEnter(group) {
                    if (!group.name) {
                        const rawText = sourceCode.getText(regexNode);
                        const start = regexNode.range[0] + rawText.indexOf("(", group.start) + 1;

                        context.report({
                            node,
                            messageId: "required",
                            data: {
                                group: group.raw
                            },
                            ...(!rawText.includes("\\") && ({
                                suggest: [
                                    {
                                        fix(fixer) {
                                            return fixer.insertTextBeforeRange(
                                                [start, start],
                                                `?<temp${((pattern.match(/temp\d+/gu) || []).length || 0) + 1}>`
                                            );
                                        },
                                        messageId: "addGroupName"
                                    },
                                    {
                                        fix(fixer) {
                                            return fixer.insertTextBeforeRange(
                                                [start, start],
                                                "?:"
                                            );
                                        },
                                        messageId: "addNonCapture"
                                    }
                                ]
                            }))
                        });
                    }
                }
            });
        }

        return {
            Literal(node) {
                if (node.regex) {
                    checkRegex(node.regex.pattern, node, node, node.regex.flags.includes("u"));
                }
            },
            Program() {
                const scope = context.getScope();
                const tracker = new ReferenceTracker(scope);
                const traceMap = {
                    RegExp: {
                        [CALL]: true,
                        [CONSTRUCT]: true
                    }
                };

                for (const { node } of tracker.iterateGlobalReferences(traceMap)) {
                    const regex = getStringIfConstant(node.arguments[0]);
                    const flags = getStringIfConstant(node.arguments[1]);

                    if (regex) {
                        checkRegex(regex, node, node.arguments[0], flags && flags.includes("u"));
                    }
                }
            }
        };
    }
};
