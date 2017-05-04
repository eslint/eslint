/**
 * @fileoverview Rule to
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const SELECTOR = `:matches(${
    [
        "BreakStatement", "ContinueStatement", "DebuggerStatement",
        "EmptyStatement", "ExportAllDeclaration", "ExportDefaultDeclaration",
        "ExportNamedDeclaration", "ExpressionStatement", "ImportDeclaration",
        "ReturnStatement", "ThrowStatement", "VariableDeclaration"
    ].join(",")
})`;

module.exports = {
    meta: {
        docs: {
            description: "enforce location of semicolons",
            category: "Stylistic Issues",
            recommended: false
        },
        schema: [{
            anyOf: [
                { enum: ["last", "first"] },
                {
                    type: "object",
                    properties: {
                        statements: { enum: ["last", "first"] },
                        forLoopHead: { enum: ["last", "first"] }
                    },
                    additionalProperty: false
                }
            ]
        }],
        fixable: "whitespace"
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const options = context.options[0] || "last";
        const statementLoc = typeof options === "string" ? options : (options.statements || "last");
        const forLoopHeadLoc = typeof options === "string" ? options : (options.forLoopHead || "last");

        /**
         * Check whether comments exist between the given 2 tokens.
         * @param {Token} left The left token to check.
         * @param {Token} right The right token to check.
         * @returns {boolean} `true` if comments exist between the given 2 tokens.
         */
        function commentsExistBetween(left, right) {
            return sourceCode.getFirstTokenBetween(
                left,
                right,
                {
                    includeComments: true,
                    filter: astUtils.isCommentToken
                }
            ) !== null;
        }

        /**
         * Check the given semicolon token.
         * @param {Token} semiToken The semicolon token to check.
         * @param {string} expected The expected location to check.
         * @returns {void}
         */
        function check(semiToken, expected) {
            const prevToken = sourceCode.getTokenBefore(semiToken);
            const nextToken = sourceCode.getTokenAfter(semiToken);
            const prevIsSameLine = !prevToken || astUtils.isTokenOnSameLine(prevToken, semiToken);
            const nextIsSameLine = !nextToken || astUtils.isTokenOnSameLine(semiToken, nextToken);

            if ((expected === "last" && !prevIsSameLine) || (expected === "first" && !nextIsSameLine)) {
                context.report({
                    loc: semiToken.loc,
                    message: "Expected this semicolon to be at {{pos}}.",
                    data: {
                        pos: (expected === "last")
                            ? "the last of the previous line"
                            : "the head of the next line"
                    },
                    fix(fixer) {
                        if (commentsExistBetween(prevToken, nextToken)) {
                            return null;
                        }

                        const start = prevToken ? prevToken.range[1] : semiToken.range[0];
                        const end = nextToken ? nextToken.range[0] : semiToken.range[1];
                        const text = (expected === "last") ? ";\n" : "\n;";

                        return fixer.replaceTextRange([start, end], text);
                    }
                });
            }
        }

        return {
            [SELECTOR](node) {
                const lastToken = sourceCode.getLastToken(node);

                if (astUtils.isSemicolonToken(lastToken)) {
                    check(lastToken, statementLoc);
                }
            },

            ForStatement(node) {
                const firstSemi = node.init && sourceCode.getTokenAfter(node.init);
                const secondSemi = node.test && sourceCode.getTokenAfter(node.test);

                if (firstSemi) {
                    check(firstSemi, forLoopHeadLoc);
                }
                if (secondSemi) {
                    check(secondSemi, forLoopHeadLoc);
                }
            }
        };
    }
};
