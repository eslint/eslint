/**
 * @fileoverview Rule to enforce lines between class methods
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
"use strict";

const astUtils = require("../ast-utils");

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

        // "always" => {multiLine: "always", singleLine: "always"}
        // "never" => {multiLine: "never", singleLine: "never"}
        if (typeof config === "string") {
            options.multiLine = options.singleLine = config;
        } else {
            options.multiLine = config.multiLine;
            options.singleLine = config.singleLine;
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
         * Checks the given MethodDefinition node to be padded.
         * @param {ASTNode} node The AST node of a MethodDefinition.
         * @returns {void} undefined.
         */
        function checkPadding(node) {

            const body = node.body;

            for (let i = 0; i < body.length - 1; i++) {

                // only check padding between methods definition.
                if (body[i].type !== "MethodDefinition" || body[i + 1].type !== "MethodDefinition") {
                    break;
                }

                const curFirst = sourceCode.getFirstToken(body[i]);
                const curLast = sourceCode.getLastToken(body[i]);
                const nextFirst = sourceCode.getFirstToken(body[i + 1]);
                const isPadded = isPaddingBetweenTokens(curLast, nextFirst);
                const isMulti = !astUtils.isTokenOnSameLine(curFirst, curLast);

                if ((isMulti && (options.multiLine === "always") !== isPadded) || !isMulti && (options.singleLine === "always") !== isPadded) {
                    context.report({
                        node,
                        message: isPadded ? NEVER_MESSAGE : ALWAYS_MESSAGE,
                        fix(fixer) {
                            return isPadded
                                ? fixer.replaceTextRange([curLast.range[1], nextFirst.range[0]], "\n")
                                : fixer.insertTextAfter(curLast, "\n");
                        }
                    });
                }
            }
        }

        return {
            ClassBody: checkPadding
        };

    }
};
