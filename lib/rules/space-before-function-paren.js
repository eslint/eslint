/**
 * @fileoverview Rule to validate spacing before function paren.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent spacing before `function` definition opening parenthesis",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                oneOf: [
                    {
                        enum: ["always", "never"]
                    },
                    {
                        type: "object",
                        properties: {
                            anonymous: {
                                enum: ["always", "never", "ignore"]
                            },
                            named: {
                                enum: ["always", "never", "ignore"]
                            },
                            asyncArrow: {
                                enum: ["always", "never", "ignore"]
                            }
                        },
                        additionalProperties: false
                    },
                    {
                        type: "object",
                        properties: {
                            declaration: {
                                enum: ["always", "never", "ignore"]
                            },
                            expression: {
                                enum: ["always", "never", "ignore"]
                            },
                            arrowExpression: {
                                enum: ["always", "never", "ignore"]
                            }
                        },
                        additionalProperties: false
                    }
                ]
            }
        ]
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const baseConfig = typeof context.options[0] === "string" ? context.options[0] : "always";
        const overrideConfig = typeof context.options[0] === "object" ? context.options[0] : {};
        const isUsingNodeType = overrideConfig.declaration || overrideConfig.expression || overrideConfig.arrowExpression;

        /**
         * Determines whether a function has a name.
         * @param {ASTNode} node The function node.
         * @returns {boolean} Whether the function has a name.
         */
        function isNamedFunction(node) {
            if (node.id) {
                return true;
            }

            const parent = node.parent;

            return parent.type === "MethodDefinition" ||
                (parent.type === "Property" &&
                    (
                        parent.kind === "get" ||
                        parent.kind === "set" ||
                        parent.method
                    )
                );
        }

        /**
         * Determines if an arrow function is worth checking
         * @param {ASTNode} node The function node
         * @returns {boolean} `true` if the node should be checked
         */
        function shouldCheckArrowFunction(node) {

            // Always ignore non-async functions and arrow functions without parens, e.g. async foo => bar
            return node.async && astUtils.isOpeningParenToken(sourceCode.getFirstToken(node, { skip: 1 }));
        }

        /**
         * Gets the config for a given function
         * @param {ASTNode} node The function node
         * @returns {string} "always", "never", or "ignore"
         */
        function getConfigForFunction(node) {

            // If we are comparing against node types, then compare by their type
            if (isUsingNodeType) {
                if (node.type === "ArrowFunctionExpression") {
                    if (shouldCheckArrowFunction(node)) {
                        return overrideConfig.arrowExpression || baseConfig;
                    }
                    return "ignore";
                } else if (node.type === "FunctionExpression") {
                    return overrideConfig.expression || baseConfig;
                } else if (node.type === "FunctionDeclaration") {
                    return overrideConfig.declaration || baseConfig;
                }
                throw new Error(`Unexpected function type encountered: ${node.type}`);
            }

            // Otheriwse, compare against named/anonymous
            if (node.type === "ArrowFunctionExpression") {
                if (shouldCheckArrowFunction(node)) {
                    return overrideConfig.asyncArrow || baseConfig;
                }
            } else if (isNamedFunction(node)) {
                return overrideConfig.named || baseConfig;

            // `generator-star-spacing` should warn anonymous generators. E.g. `function* () {}`
            } else if (!node.generator) {
                return overrideConfig.anonymous || baseConfig;
            }

            return "ignore";
        }

        /**
         * Checks the parens of a function node
         * @param {ASTNode} node A function node
         * @returns {void}
         */
        function checkFunction(node) {
            const functionConfig = getConfigForFunction(node);

            if (functionConfig === "ignore") {
                return;
            }

            const rightToken = sourceCode.getFirstToken(node, astUtils.isOpeningParenToken);
            const leftToken = sourceCode.getTokenBefore(rightToken);
            const hasSpacing = sourceCode.isSpaceBetweenTokens(leftToken, rightToken);

            if (hasSpacing && functionConfig === "never") {
                context.report({
                    node,
                    loc: leftToken.loc.end,
                    message: "Unexpected space before function parentheses.",
                    fix: fixer => fixer.removeRange([leftToken.range[1], rightToken.range[0]])
                });
            } else if (!hasSpacing && functionConfig === "always") {
                context.report({
                    node,
                    loc: leftToken.loc.end,
                    message: "Missing space before function parentheses.",
                    fix: fixer => fixer.insertTextAfter(leftToken, " ")
                });
            }
        }

        return {
            ArrowFunctionExpression: checkFunction,
            FunctionDeclaration: checkFunction,
            FunctionExpression: checkFunction
        };
    }
};
