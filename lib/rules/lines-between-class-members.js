/**
 * @fileoverview Rule to check empty newline between class members
 * @author 薛定谔的猫<hh_2013@foxmail.com>
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
            description: "require or disallow an empty line between class members",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/lines-between-class-members"
        },

        fixable: "whitespace",

        schema: [
            {
                enum: ["always", "never"]
            },
            {
                type: "object",
                properties: {
                    exceptAfterSingleLine: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],
        messages: {
            never: "Unexpected blank line between class members.",
            always: "Expected blank line between class members."
        }
    },

    create(context) {

        const options = [];

        options[0] = context.options[0] || "always";
        options[1] = context.options[1] || { exceptAfterSingleLine: false };

        const sourceCode = context.getSourceCode();

        /**
         * Return the last token among the consecutive comment tokens, that have no blank line in between.
         * If there is no comment token, return token in the parameter.
         * @param {Token} token The last token in the member node.
         * @returns {Token} The comment token or token in parameter.
         */
        function getLastConsecutiveTokenAfter(token) {
            const after = sourceCode.getTokenAfter(token, { includeComments: true });

            if (astUtils.isCommentToken(after) && after.loc.start.line - token.loc.end.line <= 1) {
                return getLastConsecutiveTokenAfter(after);
            }
            return token;
        }

        /**
         * Return the first token among the consecutive comment tokens, that have no blank line in between.
         * If there is no comment token, return token in the parameter.
         * @param {Token} token The first token in the member node.
         * @returns {Token} The comment token or token in parameter.
         */
        function getFirstConsecutiveTokenBefore(token) {
            const before = sourceCode.getTokenBefore(token, { includeComments: true });

            if (astUtils.isCommentToken(before) && token.loc.start.line - before.loc.end.line <= 1) {
                return getFirstConsecutiveTokenBefore(before);
            }
            return token;
        }

        return {
            ClassBody(node) {
                const body = node.body;

                for (let i = 0; i < body.length - 1; i++) {
                    const curFirst = sourceCode.getFirstToken(body[i]);
                    const curLast = sourceCode.getLastToken(body[i]);
                    const nextFirst = sourceCode.getFirstToken(body[i + 1]);
                    const isMulti = !astUtils.isTokenOnSameLine(curFirst, curLast);
                    const skip = !isMulti && options[1].exceptAfterSingleLine;
                    const beforePadding = getLastConsecutiveTokenAfter(curLast);
                    const afterPadding = getFirstConsecutiveTokenBefore(nextFirst);
                    const isPadded = afterPadding.loc.start.line - beforePadding.loc.start.line > 1;

                    if ((options[0] === "always" && !skip && !isPadded) ||
                        (options[0] === "never" && isPadded)) {
                        context.report({
                            node: body[i + 1],
                            messageId: isPadded ? "never" : "always",
                            fix(fixer) {
                                return isPadded
                                    ? fixer.replaceTextRange([beforePadding.range[1], afterPadding.range[0]], "\n")
                                    : fixer.insertTextAfter(curLast, "\n");
                            }
                        });
                    }
                }
            }
        };
    }
};
