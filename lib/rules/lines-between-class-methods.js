/**
 * @fileoverview Rule to enforce lines between class methods
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


module.exports = {
    meta: {
        docs: {
            description: "enforce lines between class methods",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: null,

        schema: [
            {
                oneOf: [
                    {
                        enum: ["always", "never"]
                    },
                    {
                        type: "object",
                        properties: {
                            multiLine: {
                                enum: ["always", "never"]
                            },
                            singleLine: {
                                enum: ["always", "never"]
                            }
                        },
                        additionalProperties: false,
                        minProperties: 1
                    }
                ]
            }
        ]
    },

    create(context) {

        // const options = {};
        const config = context.options[0] || "always";

        const ALWAYS_MESSAGE = "Methods must be padded by blank lines.";
        const NEVER_MESSAGE = "Methods must not be padded by blank lines.";

        const sourceCode = context.getSourceCode();

        /**
         * Checks if there is padding between two tokens
         * @param {Token} first The first token
         * @param {Token} second The second token
         * @returns {boolean} True if there is at least a line between the tokens
         */
        function isPaddingBetweenTokens(first, second) {
            return second.loc.start.line - first.loc.end.line >= 2;
        }

        /**
         * Checks the given BlockStatement node to be padded if the block is not empty.
         * @param {ASTNode} node The AST node of a BlockStatement.
         * @returns {void} undefined.
         */
        function checkPadding(node) {
            for (let i = 0; i < node.body.length - 1; i++) {
                const prev = sourceCode.getLastToken(node.body[i]);
                const next = sourceCode.getFirstToken(node.body[i + 1]);
                const padded = isPaddingBetweenTokens(prev, next);

                if (config === "always" && !padded) {
                    context.report({
                        node,
                        message: ALWAYS_MESSAGE
                    });
                } else if (config === "never" && padded) {
                    context.report({
                        node,
                        message: NEVER_MESSAGE
                    });
                }
            }
        }

        return {
            ClassBody: checkPadding
        };

    }
};
