/**
 * @fileoverview disallow an unnecessary `break` at the final clause of a switch statement.
 * @author Eran Shabi <https://github.com/eranshabi>
 */

"use strict";

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
        const requireBreak = context.options[0] ? context.options[0] : "never";

        /**
         * Returns the last statement of a given switch clause
         * @param {ASTNode} node switch clause node
         * @returns {ASTNode} - the final statement of the switch clause
         */
        function getLastStatement(node) {
            if (
                node.consequent.length === 1 &&
                node.consequent[0].type === "BlockStatement"
            ) {

                // block statement
                const block = node.consequent[0];

                return block.body[block.body.length - 1];
            }
            return node.consequent[node.consequent.length - 1];
        }

        return {
            SwitchStatement(node) {
                if (node.cases.length !== 0) {
                    const lastCase = node.cases[node.cases.length - 1];
                    const lastStatement = getLastStatement(lastCase);

                    if (requireBreak === "always") {
                        if (
                            !lastStatement ||
                            lastStatement.type !== "BreakStatement"
                        ) {
                            context.report({
                                node: lastCase,
                                messageId: "switchFinalBreakAlways",
                                fix: fixer => {
                                    if (!lastStatement) {
                                        return fixer.insertTextAfter(lastCase, " break;");
                                    }
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

                            // break jumps somewhere else, don't complain
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
