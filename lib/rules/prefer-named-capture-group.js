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
            required: "Capture group '{{group}}' should be converted to a named or non-capturing group."
        }
    },

    create(context) {

        /**
         * Function to check regular expression.
         *
         * @param {string} regex The regular expression to be check.
         * @param {ASTNode} node AST node which contains regular expression.
         * @param {boolean} uFlag Flag indicates whether unicode mode is enabled or not.
         * @returns {void}
         */
        function checkRegex(regex, node, uFlag) {
            let ast;

            try {
                ast = parser.parsePattern(regex, 0, regex.length, uFlag);
            } catch (_) {

                // ignore regex syntax errors
                return;
            }

            regexpp.visitRegExpAST(ast, {
                onCapturingGroupEnter(group) {
                    if (!group.name) {
                        const locNode = node.type === "Literal" ? node : node.arguments[0];

                        context.report({
                            node,
                            messageId: "required",
                            loc: {
                                start: {
                                    line: locNode.loc.start.line,
                                    column: locNode.loc.start.column + group.start + 1
                                },
                                end: {
                                    line: locNode.loc.start.line,
                                    column: locNode.loc.start.column + group.end + 1
                                }
                            },
                            data: {
                                group: group.raw
                            }
                        });
                    }
                }
            });
        }

        return {
            Literal(node) {
                if (node.regex) {
                    checkRegex(node.regex.pattern, node, node.regex.flags.includes("u"));
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
                    const flags = getStringIfConstant(node.arguments[1]);

                    if (regex) {
                        checkRegex(regex, node, flags && flags.includes("u"));
                    }
                }
            }
        };
    }
};
