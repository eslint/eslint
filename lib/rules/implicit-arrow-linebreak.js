/**
 * @fileoverview enforce the location of arrow function bodies
 * @author Sharmila Jesupaul
 */
"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
    meta: {
        docs: {
            description: "enforce the location of arrow function bodies",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/implicit-arrow-linebreak"
        },
        fixable: "whitespace",
        schema: [
            {
                enum: ["beside", "below"]
            }
        ]
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------
        /**
         * Gets the applicable preference for a particular keyword
         * @returns {string} The applicable option for the keyword, e.g. 'beside'
         */
        function getOption() {
            return context.options[0] || "beside";
        }

        /**
         * Formats the comments depending on whether it's a line or block comment.
         * @param {Comment[]} comments The array of comments between the arrow and body
         * @returns {string} A string of comment text joined by line breaks
         */
        function formatComments(comments) {
            return comments.map(comment => {

                if (comment.type === "Line") {
                    return `//${comment.value}`;
                }

                return `/*${comment.value}*/`;
            }).join("\n");
        }

        /**
         * Validates the location of an arrow function body
         * @param {ASTNode} node The arrow function body
         * @param {string} keywordName The applicable keyword name for the arrow function body
         * @returns {void}
         */
        function validateExpression(node) {
            const option = getOption();

            let tokenBefore = sourceCode.getTokenBefore(node.body);
            const hasParens = tokenBefore.value === "(";

            if (node.type === "BlockStatement") {
                return;
            }

            let fixerTarget = node.body;

            if (hasParens) {

                // Gets the first token before the function body that is not an open paren
                tokenBefore = sourceCode.getTokenBefore(node.body, token => token.value !== "(");
                fixerTarget = sourceCode.getTokenAfter(tokenBefore);
            }

            const comments = sourceCode.getCommentsInside(node).filter(comment => comment.loc.start.line < fixerTarget.loc.start.line);

            if (tokenBefore.loc.end.line === fixerTarget.loc.start.line && option === "below") {
                context.report({
                    node: fixerTarget,
                    message: "Expected a linebreak before this expression.",
                    fix: fixer => fixer.insertTextBefore(fixerTarget, "\n")
                });
            } else if (tokenBefore.loc.end.line !== fixerTarget.loc.start.line && option === "beside") {
                context.report({
                    node: fixerTarget,
                    message: "Expected no linebreak before this expression.",
                    fix: fixer => {
                        const placeBesides = fixer.replaceTextRange([tokenBefore.range[1], fixerTarget.range[0]], " ");

                        if (comments.length > 0) {
                            const parensFixer = [
                                fixer.insertTextAfter(tokenBefore, " (")
                            ];

                            if (node.body.type === "ArrowFunctionExpression" && node.parent.parent.type === "Program") {
                                let currBody = node;
                                let arrowCount = 0;
                                let needParens = 0;
                                let output = "";

                                do {
                                    if (!sourceCode.getFirstTokenBetween(
                                        currBody.params[currBody.params.length - 1],
                                        currBody.body,
                                        astUtils.isOpeningParenToken
                                    )) {
                                       const whiteSpaces = " ".repeat(currBody.params[0].loc.start.column);
                                       output = `\n${whiteSpaces})` + output;

                                       needParens++;
                                    }

                                   arrowCount++;
                                   currBody = currBody.body;
                                } while (currBody.type === "ArrowFunctionExpression");

                                if (arrowCount !== needParens) {

                                    const lastToken = sourceCode.getLastToken(fixerTarget);

                                    return [...parensFixer,
                                        fixer.insertTextAfter(lastToken, output)
                                    ];
                                }

                                return parensFixer;
                            } else if (node.parent.type === "ArrowFunctionExpression") {
                                if (node.body.type === "Identifier") {
                                    let output = "";
                                    let currParent = node;

                                    do {
                                        const whiteSpaces = " ".repeat(currParent.params[0].loc.start.column);

                                        output += `\n${whiteSpaces})`;

                                        currParent = currParent.parent;
                                    } while (currParent.type === "ArrowFunctionExpression");

                                    const lastToken = sourceCode.getLastToken(fixerTarget);

                                    return [...parensFixer, fixer.insertTextAfter(lastToken, output)];
                                }
                            }

                            const firstToken = sourceCode.getFirstToken(
                                node.parent.type === "VariableDeclarator"
                                    ? node.parent.parent : node
                            );

                            const commentText = formatComments(comments);

                            const commentBeforeExpression = fixer.insertTextBefore(
                                firstToken,
                                `${commentText}\n`
                            );

                            return [placeBesides, commentBeforeExpression];
                        }

                        return placeBesides;
                    }
                });
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        return {
            ArrowFunctionExpression: node => validateExpression(node)
        };
    }
};
