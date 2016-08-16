/**
 * @fileoverview Rule to check the spacing around the * in generator functions.
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent spacing around `*` operators in generator functions",
            category: "ECMAScript 6",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                oneOf: [
                    {
                        enum: ["before", "after", "both", "neither"]
                    },
                    {
                        type: "object",
                        properties: {
                            before: {type: "boolean"},
                            after: {type: "boolean"}
                        },
                        additionalProperties: false
                    }
                ]
            }
        ]
    },

    create(context) {

        const mode = (function(option) {
            if (!option || typeof option === "string") {
                return {
                    before: { before: true, after: false },
                    after: { before: false, after: true },
                    both: { before: true, after: true },
                    neither: { before: false, after: false }
                }[option || "before"];
            }
            return option;
        }(context.options[0]));

        const sourceCode = context.getSourceCode();

        /**
         * Gets `*` token from a given node.
         *
         * @param {ASTNode} node - A node to get `*` token. This is one of
         *      FunctionDeclaration, FunctionExpression, Property, and
         *      MethodDefinition.
         * @returns {Token} `*` token.
         */
        function getStarToken(node) {
            let token = sourceCode.getFirstToken(node);

            while (token.value !== "*") {
                token = sourceCode.getTokenAfter(token);
            }

            return token;
        }

        /**
         * Checks the spacing between two tokens before or after the star token.
         * @param {string} side Either "before" or "after".
         * @param {Token} leftToken `function` keyword token if side is "before", or
         *     star token if side is "after".
         * @param {Token} rightToken Star token if side is "before", or identifier
         *     token if side is "after".
         * @returns {void}
         */
        function checkSpacing(side, leftToken, rightToken) {
            if (!!(rightToken.range[0] - leftToken.range[1]) !== mode[side]) {
                const after = leftToken.value === "*";
                const spaceRequired = mode[side];
                const node = after ? leftToken : rightToken;
                const type = spaceRequired ? "Missing" : "Unexpected";
                const message = type + " space " + side + " *.";

                context.report({
                    node,
                    message,
                    fix(fixer) {
                        if (spaceRequired) {
                            if (after) {
                                return fixer.insertTextAfter(node, " ");
                            }
                            return fixer.insertTextBefore(node, " ");
                        }
                        return fixer.removeRange([leftToken.range[1], rightToken.range[0]]);
                    }
                });
            }
        }

        /**
         * Enforces the spacing around the star if node is a generator function.
         * @param {ASTNode} node A function expression or declaration node.
         * @returns {void}
         */
        function checkFunction(node) {
            let starToken;

            if (!node.generator) {
                return;
            }

            if (node.parent.method || node.parent.type === "MethodDefinition") {
                starToken = getStarToken(node.parent);
            } else {
                starToken = getStarToken(node);
            }

            // Only check before when preceded by `function`|`static` keyword
            const prevToken = sourceCode.getTokenBefore(starToken);

            if (prevToken.value === "function" || prevToken.value === "static") {
                checkSpacing("before", prevToken, starToken);
            }

            const nextToken = sourceCode.getTokenAfter(starToken);

            checkSpacing("after", starToken, nextToken);
        }

        return {
            FunctionDeclaration: checkFunction,
            FunctionExpression: checkFunction
        };

    }
};
