/**
 * @fileoverview enforce the location of arrow function bodies
 * @author Sharmila Jesupaul
 */
"use strict";

const {
    isArrowToken,
    isParenthesised,
    isOpeningParenToken
} = require("../ast-utils");

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
         * @param {Integer} column The column number of the first token
         * @returns {string} A string of comment text joined by line breaks
         */
        function formatComments(comments, column) {
            const whiteSpaces = " ".repeat(column);

            return `${comments.map(comment => {

                if (comment.type === "Line") {
                    return `//${comment.value}`;
                }

                return `/*${comment.value}*/`;
            }).join(`\n${whiteSpaces}`)}\n${whiteSpaces}`;
        }

        /**
         * Finds the first token depending on the parent type
         * @param {Node} node The validated node
         * @returns {Token|Node} The node to prepend comments to
         */
        function findFirstToken(node) {
            switch (node.parent.type) {
                case "VariableDeclarator":
                    return sourceCode.getFirstToken(node.parent.parent);
                case "CallExpression":
                case "Property":
                    return sourceCode.getFirstToken(node.parent);
                default:
                    return node;
            }
        }

        /**
         * Helper function for adding parentheses fixes for nodes containing nested arrow functions
         * @param {Fixer} fixer Fixer
         * @param {Token} arrow - The arrow token
         * @param {ASTNode} arrowBody - The arrow function body
         * @returns {Function[]} autofixer -- wraps function bodies with parentheses
         */
        function addParentheses(fixer, arrow, arrowBody) {
            const parenthesesFixes = [];
            let closingParentheses = "";

            let followingBody = arrowBody;
            let currentArrow = arrow;

            while (currentArrow) {
                if (!isParenthesised(sourceCode, followingBody)) {
                    parenthesesFixes.push(
                        fixer.insertTextAfter(currentArrow, " (")
                    );

                    const paramsToken = sourceCode.getTokenBefore(currentArrow, token =>
                        isOpeningParenToken(token) || token.type === "Identifier");

                    const whiteSpaces = " ".repeat(paramsToken.loc.start.column);

                    closingParentheses = `\n${whiteSpaces})${closingParentheses}`;
                }

                currentArrow = sourceCode.getTokenAfter(currentArrow, isArrowToken);

                if (currentArrow) {
                    followingBody = sourceCode.getTokenAfter(currentArrow, token => !isOpeningParenToken(token));
                }
            }

            return [...parenthesesFixes,
                fixer.insertTextAfter(arrowBody, closingParentheses)
            ];
        }

        /**
         * Autofixes the function body to collapse onto the same line as the arrow.
         * If comments exist, prepends the comments before the arrow function.
         * If the function body contains arrow functions, appends the function bodies with parentheses.
         * @param {Token} arrow The arrow token.
         * @param {ASTNode} arrowBody the function body
         * @param {ASTNode} node The evaluated node
         * @returns {Function} autofixer -- validates the node to adhere to besides
         */
        function autoFixBesides(arrow, arrowBody, node) {
            return fixer => {
                const placeBesides = fixer.replaceTextRange([arrow.range[1], arrowBody.range[0]], " ");

                const comments = sourceCode.getCommentsInside(node).filter(comment =>
                    comment.loc.start.line < arrowBody.loc.start.line);

                if (comments.length) {

                    const precedingArrow = sourceCode.getTokenBefore(arrow, isArrowToken);

                    // Check if any arrow functions follow
                    if (sourceCode.getTokenAfter(arrow, isArrowToken)) {
                        return addParentheses(fixer, arrow, arrowBody);
                    }

                    if (precedingArrow) {
                        return null;
                    }

                    const firstToken = findFirstToken(node);

                    const commentText = formatComments(comments, firstToken.loc.start.column);

                    const commentBeforeExpression = fixer.insertTextBeforeRange(
                        firstToken.range,
                        commentText
                    );

                    return [placeBesides, commentBeforeExpression];
                }

                return placeBesides;
            };
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
                    fix: autoFixBesides(tokenBefore, fixerTarget, node)
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
