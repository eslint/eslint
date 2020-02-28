/**
 * @fileoverview Enforce newlines between operands of ternary expressions
 * @author Kai Cataldo
 */

"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "enforce newlines between operands of ternary expressions",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/multiline-ternary"
        },

        schema: [
            {
                enum: ["always", "always-multiline", "never"]
            }
        ],

        messages: {
            expectedTestCons: "Expected newline between test and consequent of ternary expression.",
            expectedConsAlt: "Expected newline between consequent and alternate of ternary expression.",
            unexpectedTestCons: "Unexpected newline between test and consequent of ternary expression.",
            unexpectedConsAlt: "Unexpected newline between consequent and alternate of ternary expression."
        },

        fixable: "whitespace"
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const option = context.options[0];
        const multiline = option !== "never";
        const allowSingleLine = option === "always-multiline";

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            ConditionalExpression(node) {
                const areTestAndConsequentOnSameLine = astUtils.isTokenOnSameLine(node.test, node.consequent);
                const areConsequentAndAlternateOnSameLine = astUtils.isTokenOnSameLine(node.consequent, node.alternate);

                if (!multiline) {
                    if (!areTestAndConsequentOnSameLine) {
                        context.report({
                            node: node.test,
                            messageId: "unexpectedTestCons",
                            fix: fixer => {
                                const testToken = astUtils.isParenthesised(sourceCode, node.test)
                                    ? sourceCode.getTokenAfter(node.test)
                                    : node.test;

                                const consequentToken = astUtils.isParenthesised(sourceCode, node.consequent)
                                    ? sourceCode.getTokenBefore(node.consequent)
                                    : node.consequent;

                                return (
                                    fixer.replaceTextRange(
                                        [
                                            testToken.range[1],
                                            consequentToken.range[0]
                                        ],
                                        " ? "
                                    )
                                );
                            }
                        });
                    }

                    if (!areConsequentAndAlternateOnSameLine) {
                        context.report({
                            node: node.consequent,
                            messageId: "unexpectedConsAlt",
                            fix: fixer => {
                                const consequentToken = astUtils.isParenthesised(sourceCode, node.consequent)
                                    ? sourceCode.getTokenAfter(node.consequent)
                                    : node.consequent;

                                const alternateToken = astUtils.isParenthesised(sourceCode, node.alternate)
                                    ? sourceCode.getTokenBefore(node.alternate)
                                    : node.alternate;

                                return (
                                    fixer.replaceTextRange(
                                        [
                                            consequentToken.range[1],
                                            alternateToken.range[0]
                                        ],
                                        " : "
                                    )
                                );
                            }
                        });
                    }
                } else {
                    if (allowSingleLine && node.loc.start.line === node.loc.end.line) {
                        return;
                    }

                    if (areTestAndConsequentOnSameLine) {
                        context.report({
                            node: node.test,
                            messageId: "expectedTestCons",
                            fix: fixer => {
                                const testToken = astUtils.isParenthesised(sourceCode, node.test)
                                    ? sourceCode.getTokenAfter(node.test)
                                    : node.test;

                                const consequentToken = astUtils.isParenthesised(sourceCode, node.consequent)
                                    ? sourceCode.getTokenBefore(node.consequent)
                                    : node.consequent;

                                return (
                                    fixer.replaceTextRange(
                                        [
                                            testToken.range[1],
                                            consequentToken.range[0]
                                        ],
                                        "\n? "
                                    )
                                );
                            }
                        });
                    }

                    if (areConsequentAndAlternateOnSameLine) {
                        context.report({
                            node: node.consequent,
                            messageId: "expectedConsAlt",
                            fix: fixer => {
                                const consequentToken = astUtils.isParenthesised(sourceCode, node.consequent)
                                    ? sourceCode.getTokenAfter(node.consequent)
                                    : node.consequent;

                                const alternateToken = astUtils.isParenthesised(sourceCode, node.alternate)
                                    ? sourceCode.getTokenBefore(node.alternate)
                                    : node.alternate;

                                return (
                                    fixer.replaceTextRange(
                                        [
                                            consequentToken.range[1],
                                            alternateToken.range[0]
                                        ],
                                        "\n: "
                                    )
                                );
                            }
                        });
                    }
                }
            }
        };
    }
};
