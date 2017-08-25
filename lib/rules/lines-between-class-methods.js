/**
 * @fileoverview Rule to enforce lines between class methods
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
"use strict";

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

        const options = {};
        const config = context.options[0] || "always";

        if (typeof config === "object") {
            options.multiLine = config.multiLine === "always";
            options.singleLine = config.singleLine === "always";
        } else {
            options.multiLine = options.singleLine = config === "always";
        }

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
            const body = node.body;

            for (let i = 0; i < body.length - 1; i++) {

                // only check padding between methods definition.
                if (body[i].type !== "MethodDefinition" || body[i + 1].type !== "MethodDefinition") {
                    break;
                }

                const cur = sourceCode.getLastToken(body[i]);
                const next = sourceCode.getFirstToken(body[i + 1]);
                const isPadded = isPaddingBetweenTokens(cur, next);
                const isMulti = body[i].range[1].line - body[i].range[0].line > 1;
                const shouldPadded = isMulti ? options.multiLine : options.singleLine;

                if (shouldPadded !== isPadded) {
                    context.report({
                        node,
                        message: shouldPadded ? ALWAYS_MESSAGE : NEVER_MESSAGE
                    });
                }
            }
        }

        return {
            ClassBody: checkPadding
        };

    }
};
