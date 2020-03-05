/**
 * @fileoverview Rule to ensure newline per method call when chaining calls
 * @author Rajendra Patil
 * @author Burak Yigit Kaya
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
            description: "require a newline after each call in a method chain",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/newline-per-chained-call"
        },

        fixable: "whitespace",

        schema: [{
            type: "object",
            properties: {
                depthCalculationStyle: {
                    type: "string",
                    enum: ["all", "trailingMembers"],
                    default: "trailingMembers"
                },
                ignoreChainWithDepth: {
                    type: "integer",
                    minimum: 0,
                    default: 2
                },
                includeBracketedProperties: {
                    type: "boolean",
                    default: true
                },
                includeMethodCalls: {
                    type: "boolean",
                    default: true
                },
                includeProperties: {
                    type: "boolean",
                    default: false
                },
                multilineBreakStyle: {
                    type: "string",
                    enum: ["never", "object", "statement"],
                    default: "never"
                }
            },
            additionalProperties: false
        }],

        messages: {
            expectedLineBreak: "Expected line break before `{{propertyName}}`."
        }
    },

    create(context) {
        const options = context.options[0] || {},
            depthCalculationStyle = options.depthCalculationStyle || "trailingMembers",
            ignoreChainWithDepth = options.ignoreChainWithDepth || 2,
            includeBracketedProperties = (
                typeof options.includeBracketedProperties !== "undefined"
                    ? options.includeBracketedProperties
                    : true
            ),
            includeMethodCalls = (
                typeof options.includeMethodCalls !== "undefined"
                    ? options.includeMethodCalls
                    : true
            ),
            includeProperties = (
                typeof options.includeProperties !== "undefined"
                    ? options.includeProperties
                    : false
            ),
            multilineBreakStyle = options.multilineBreakStyle || "never";

        const sourceCode = context.getSourceCode();

        /**
         * Get the prefix of a given MemberExpression node.
         * If the MemberExpression node is a computed value it returns a
         * left bracket. If not it returns a period.
         * @param  {ASTNode} node A MemberExpression node to get
         * @returns {string} The prefix of the node.
         */
        function getPrefix(node) {
            return node.computed ? "[" : ".";
        }

        /**
         * Gets the property text of a given MemberExpression node.
         * If the text is multiline, this returns only the first line.
         * @param {ASTNode} node A MemberExpression node to get.
         * @returns {string} The property text of the node.
         */
        function getPropertyText(node) {
            const prefix = getPrefix(node);
            const lines = sourceCode.getText(node.property).split(astUtils.LINEBREAK_MATCHER);
            const suffix = node.computed && lines.length === 1 ? "]" : "";

            return prefix + lines[0] + suffix;
        }

        /**
         * Checks if the object and property of a given MemberExpression node are on the same line.
         * @param {ASTNode} node A CallExpression node to validate.
         * @returns {bool} The result of the object and property being on the same line.
         */
        function hasObjectAndPropertyOnSameLine({ object, property }) {
            return (
                astUtils.isTokenOnSameLine(
                    object,
                    property
                )
            );
        }

        /**
         * Checks if a given ASTNode spans multiple lines.
         * @param {ASTNode} node An ASTNode to validate.
         * @returns {bool} Is the ASTNode spanning multiple lines?
         */
        function isSpanningMultipleLines(node) {
            return !astUtils.isTokenOnSameLine(node, node);
        }

        /**
         * Gets the top-most CallExpression or MemberExpression of a given ASTNode.
         * @param {ASTNode} node A MemberExpression node to validate.
         * @returns {bool} The final MemberExpression node.
         */
        function getStatementChildNode(node) {
            let currentNode = node.parent;

            while (
                currentNode.type === "CallExpression" ||
                currentNode.type === "MemberExpression"
            ) {
                currentNode = currentNode.parent;
            }

            return currentNode;
        }

        /**
         * Checks if parent of a given MemberExpression is the final node in the statement.
         * @param {ASTNode} node A MemberExpression node to validate.
         * @returns {bool} The result of the parent's type not being a MemberExpression.
         */
        function isFinalMemberExpression(node) {
            let { parent } = node;

            if (parent.type === "CallExpression") {
                parent = parent.parent;
            }

            return parent.type !== "MemberExpression";
        }

        /**
         * Reports when CallExpression or MemberExpression count is greater than the max total when two nodes are on the same line.
         * @param {ASTNode} node A MemberExpression or CallExpression node to validate.
         * @returns {void} The result of the object and property being on the same line.
         */
        function validateChainDepth(node) {
            if (
                depthCalculationStyle === "all" &&
                !isFinalMemberExpression(node)
            ) {
                return;
            }

            const memberExpressions = [];

            let currentNode = node;

            while (currentNode) {
                if (currentNode.type === "CallExpression") {
                    currentNode = currentNode.callee;
                } else if (
                    (
                        includeMethodCalls &&
                        currentNode.parent.type === "CallExpression"
                    ) || (
                        includeProperties &&
                        currentNode.parent.type !== "CallExpression"
                    )
                ) {
                    if (currentNode.type === "MemberExpression") {
                        if (
                            includeBracketedProperties || (
                                currentNode.property.type === "Identifier" &&
                                !currentNode.computed
                            )
                        ) {
                            memberExpressions.push(currentNode);
                        }
                    } else {
                        memberExpressions.push({
                            object: currentNode.parent,
                            property: currentNode
                        });
                    }

                    currentNode = currentNode.object;
                } else if (depthCalculationStyle === "all") {
                    currentNode = currentNode.object;
                } else {
                    break;
                }
            }

            if (
                isFinalMemberExpression(node) && (
                    (
                        memberExpressions.length > 0 &&
                        memberExpressions.length <= ignoreChainWithDepth && (
                            (
                                multilineBreakStyle === "object" &&
                                isSpanningMultipleLines(
                                    (memberExpressions[memberExpressions.length - 1] || {}).property
                                )
                            ) || (
                                multilineBreakStyle === "statement" &&
                                isSpanningMultipleLines(getStatementChildNode(node))
                            )
                        )
                    ) || (
                        depthCalculationStyle === "all" &&
                        memberExpressions.length > ignoreChainWithDepth &&
                        memberExpressions.some(hasObjectAndPropertyOnSameLine)
                    )
                )
            ) {
                memberExpressions
                    .filter(({ type }) => type)
                    .filter(hasObjectAndPropertyOnSameLine)
                    .forEach(memberExpression => {
                        context.report({
                            node: memberExpression.property,
                            loc: memberExpression.property.loc.start,
                            messageId: "expectedLineBreak",
                            data: {
                                propertyName: getPropertyText(memberExpression)
                            },
                            fix(fixer) {
                                const firstTokenAfterObject = (
                                    sourceCode.getTokenAfter(
                                        memberExpression.object,
                                        astUtils.isNotClosingParenToken
                                    )
                                );

                                return fixer.insertTextBefore(firstTokenAfterObject, "\n");
                            }
                        });
                    });
            } else if (
                (
                    memberExpressions.length > 0 &&
                    memberExpressions.length <= ignoreChainWithDepth && (
                        (
                            multilineBreakStyle === "object" &&
                            isSpanningMultipleLines(
                                (memberExpressions[memberExpressions.length - 1] || {}).property
                            )
                        ) || (
                            multilineBreakStyle === "statement" &&
                            isSpanningMultipleLines(getStatementChildNode(node))
                        )
                    )
                ) || (
                    depthCalculationStyle === "trailingMembers" && (
                        memberExpressions.length > ignoreChainWithDepth &&
                        hasObjectAndPropertyOnSameLine(node)
                    )
                )
            ) {
                context.report({
                    node: node.property,
                    loc: node.property.loc.start,
                    messageId: "expectedLineBreak",
                    data: {
                        propertyName: getPropertyText(node)
                    },
                    fix(fixer) {
                        const firstTokenAfterObject = (
                            sourceCode.getTokenAfter(
                                node.object,
                                astUtils.isNotClosingParenToken
                            )
                        );

                        return fixer.insertTextBefore(firstTokenAfterObject, "\n");
                    }
                });
            }
        }

        return {
            "MemberExpression:exit": validateChainDepth
        };
    }
};
