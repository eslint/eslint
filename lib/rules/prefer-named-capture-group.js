/**
 * @fileoverview Rule to enforce requiring named capture groups in regular expression.
 * @author Pig Fang <https://github.com/g-plane>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const {
    CALL,
    CONSTRUCT,
    ReferenceTracker,
    getStringIfConstant
} = require("eslint-utils");
const regexpp = require("regexpp");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const parser = new regexpp.RegExpParser();

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "enforce using named capture group in regular expression",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-named-capture-group"
        },

        schema: [],

        messages: {
            required: "Capture group '{{group}}' in regular expression should be named."
        }
    },

    create(context) {

        /**
         * Function to check regular expression.
         *
         * @param {string} regex The regular expression to be check.
         * @param {ASTNode} node AST node which contains regular expression.
         * @returns {void}
         */
        function checkRegex(regex, node) {
            try {
                const ast = parser.parsePattern(regex);

                regexpp.visitRegExpAST(ast, {
                    onCapturingGroupEnter(group) {
                        if (!group.name) {
                            context.report({
                                node,
                                messageId: "required",
                                data: {
                                    group: group.raw
                                }
                            });
                        }
                    }
                });
            } catch (_) {

                // ignore regex syntax errors
            }
        }

        return {
            Literal(node) {
                if (node.regex) {
                    checkRegex(node.regex.pattern, node);
                }
            },
            Program() {
                const scope = context.getScope();
                const tracker = new ReferenceTracker(scope);
                const traceMap = {
                    RegExp: {
                        [CALL]: true,
                        [CONSTRUCT]: true
                    }
                };

                for (const { node } of tracker.iterateGlobalReferences(traceMap)) {
                    const regex = getStringIfConstant(node.arguments[0]);

                    if (regex) {
                        checkRegex(regex, node);
                    }
                }
            }
        };
    }
};
