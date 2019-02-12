/**
 * @fileoverview Rule to flag when using constructor without parentheses
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("../util/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "require parentheses when invoking a constructor with no arguments",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/new-parens"
        },

        fixable: "code",
        schema: {
            anyOf: [
                {
                    type: "array",
                    items: [
                        {
                            enum: ["always", "never"]
                        }
                    ],
                    minItems: 0,
                    maxItems: 1
                }
            ]
        },
        messages: {
            missing: "Missing '()' invoking a constructor.",
            using: "'()' included invoking a constructor with no arguments."
        }
    },

    create(context) {
        const options = context.options;
        const always = options[0] !== "never"; // Default is never

        const sourceCode = context.getSourceCode();

        return {
            NewExpression(node) {
                if (node.arguments.length !== 0) {
                    return; // if there are arguments, there have to be parens
                }

                const lastToken = sourceCode.getLastToken(node);
                const hasLastParen = lastToken && astUtils.isClosingParenToken(lastToken);
                const hasParens = hasLastParen && astUtils.isOpeningParenToken(sourceCode.getTokenBefore(lastToken));

                if (always) {
                    if (!hasParens) {
                        context.report({
                            node,
                            messageId: "missing",
                            fix: fixer => fixer.insertTextAfter(node, "()")
                        });
                    }
                } else {
                    if (hasParens) {
                        context.report({
                            node,
                            messageId: "using",
                            fix: fixer => [
                                fixer.remove(sourceCode.getTokenBefore(lastToken)),
                                fixer.remove(lastToken),
                                fixer.insertTextBefore(node, "("),
                                fixer.insertTextAfter(node, ")")
                            ]
                        });
                    }
                }
            }
        };
    }
};
