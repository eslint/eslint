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
         * @param {string} pattern The regular expression pattern to be check.
         * @param {ASTNode} node AST node which contains regular expression.
         * @param {boolean} uFlag Flag indicates whether unicode mode is enabled or not.
         * @returns {void}
         */
        function checkRegex(pattern, node, uFlag) {
            let ast;

            try {
                ast = parser.parsePattern(pattern, 0, pattern.length, uFlag);
            } catch (_) {

                // ignore regex syntax errors
                return;
            }

            regexpp.visitRegExpAST(ast, {
                onCapturingGroupEnter(group) {
                    if (!group.name) {
                        let locNode, rawPattern, loc;

                        if (node.type === "Literal") {
                            locNode = node;
                            rawPattern = locNode.raw.slice(1, locNode.raw.lastIndexOf("/"));
                        } else {
                            locNode = node.arguments[0];
                            if (locNode.type === "Literal" && typeof locNode.value === "string") {
                                rawPattern = locNode.raw.slice(1, -1);
                            } else if (locNode.type === "TemplateLiteral" && locNode.expressions.length === 0 && locNode.quasis.length === 1) {
                                rawPattern = locNode.quasis[0].value.raw;
                            }
                        }

                        if (pattern === rawPattern && locNode.loc.start.line === locNode.loc.end.line) {
                            loc = {
                                start: {
                                    line: locNode.loc.start.line,
                                    column: locNode.loc.start.column + group.start + 1
                                },
                                end: {
                                    line: locNode.loc.start.line,
                                    column: locNode.loc.start.column + group.end + 1
                                }
                            };
                        } else {
                            loc = locNode.loc;
                        }

                        context.report({
                            node,
                            messageId: "required",
                            loc,
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
