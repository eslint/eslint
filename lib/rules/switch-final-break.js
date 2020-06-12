/**
 * @fileoverview disallow an unnecessary `break` at the final clause of a switch statement.
 * @author Eran Shabi <https://github.com/eranshabi>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const lodash = require("lodash");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description:
                "disallow an unnecessary `break` at the final clause of a switch statement.",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/switch-final-break"
        },
        fixable: "code",
        messages: {
            switchFinalBreakNever:
                "Final clause in 'switch' statement should not end with 'break;'.",
            switchFinalBreakAlways:
                "Final clause in 'switch' statement should end with 'break;'."
        },
        schema: [
            {
                enum: ["never", "always"]
            }
        ],
        type: "suggestion"
    },
    create(context) {
        let currentCodePath = null;
        const requireBreak = context.options[0] ? context.options[0] : "never";

        /**
         * Returns the statements list of a given `SwitchCase` node
         * @param {ASTNode} node `SwitchCase` node
         * @returns {ASTNode[]} - the statements list of the `SwitchCase` node
         */
        function getStatements(node) {
            if (
                node.consequent.length === 1 &&
                node.consequent[0].type === "BlockStatement"
            ) {
                return node.consequent[0].body;
            }
            return node.consequent;
        }

        /**
         * Returns the last statement of a given switch clause
         * @param {ASTNode} node switch clause node
         * @returns {ASTNode} - the final statement of the switch clause
         */
        function getLastStatement(node) {
            return lodash.last(getStatements(node));
        }

        /**
         * Checks whether or not a given code path segment is reachable.
         * @param {CodePathSegment} segment A CodePathSegment to check.
         * @returns {boolean} `true` if the segment is reachable.
         */
        function isReachable(segment) {
            return segment.reachable;
        }


        return {
            onCodePathStart(codePath) {
                currentCodePath = codePath;
            },
            onCodePathEnd() {
                currentCodePath = currentCodePath.upper;
            },

            "SwitchCase:exit"(node) {
                if (requireBreak !== "always") {
                    return;
                }
                if (node.consequent.length === 0) {
                    context.report({
                        node,
                        messageId: "switchFinalBreakAlways",
                        fix: fixer => fixer.insertTextAfter(
                            node,
                            " break;"
                        )
                    });
                }
                if (currentCodePath.currentSegments.some(isReachable) &&
                    node.consequent.length > 0 &&
                    lodash.last(node.parent.cases) === node
                ) {
                    const lastStatement = getLastStatement(node);

                    context.report({
                        node,
                        messageId: "switchFinalBreakAlways",
                        fix: fixer => {
                            const lastStatementText = context.getSourceCode().getLines()[
                                lastStatement.loc.start.line - 1
                            ];
                            const indentation = lastStatementText.slice(
                                0,
                                lastStatementText.search(/\S+/u)
                            );

                            return fixer.insertTextAfter(
                                lastStatement,
                                `\n${indentation}break;`
                            );
                        }
                    });
                }
            },

            SwitchStatement(node) {
                if (node.cases.length !== 0) {
                    const lastCase = lodash.last(node.cases);
                    const lastStatement = getLastStatement(lastCase);

                    if (requireBreak === "always") {
                        return;
                    }

                    if (
                        !lastStatement ||
                        lastStatement.type !== "BreakStatement"
                    ) {
                        return;
                    }

                    if (lastStatement.label !== null) {
                        const parent = node.parent;

                        if (
                            parent &&
                            (!(parent.type === "LabeledStatement") ||
                                parent.label === lastStatement.label)) {

                            // break is used to jump to somewhere else, don't complain. This happens when the code has a break statement with a labeled block ("break labelName;").
                            return;
                        }
                    }

                    context.report({
                        node: lastStatement,
                        messageId: "switchFinalBreakNever",
                        fix: fixer => {
                            const sourceText = context.getSourceCode().getText();
                            const reversedSourceText = sourceText
                                .split("")
                                .reverse()
                                .join("");
                            const lastStatementReversedIndex =
                                reversedSourceText.length - lastStatement.range[0];
                            const substringToTrimMatch = reversedSourceText
                                .slice(lastStatementReversedIndex)
                                .match(/\s*\n?/gu);
                            const trimLength = substringToTrimMatch
                                ? substringToTrimMatch[0].length
                                : 0;

                            return fixer.removeRange([
                                lastStatement.range[0] - trimLength,
                                lastStatement.range[1]
                            ]);
                        }
                    });
                }
            }
        };
    }
};
