/**
 * @fileoverview Rule to disallow if as the only statmenet in an else block
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow `if` statements as the only statement in `else` blocks",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [],

        fixable: "code"
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            IfStatement(node) {
                const ancestors = context.getAncestors(),
                    parent = ancestors.pop(),
                    grandparent = ancestors.pop();

                if (parent && parent.type === "BlockStatement" &&
                        parent.body.length === 1 && grandparent &&
                        grandparent.type === "IfStatement" &&
                        parent === grandparent.alternate) {
                    context.report({
                        node,
                        message: "Unexpected if as the only statement in an else block.",
                        fix(fixer) {
                            const openingElseCurly = sourceCode.getFirstToken(parent);
                            const closingElseCurly = sourceCode.getLastToken(parent);
                            const elseKeyword = sourceCode.getTokenBefore(openingElseCurly);
                            const closingIfParen = sourceCode.getTokenAfter(node.test);
                            const ifKeyword = sourceCode.getTokenBefore(node.test, 1);
                            const ifConsequentText = node.consequent.type === "BlockStatement" ? sourceCode.getText(node.consequent).slice(1, -1) : sourceCode.getText(node.consequent);
                            const sourceText = sourceCode.getText();

                            if (sourceText.slice(openingElseCurly.range[1], node.range[0]).trim() || sourceText.slice(node.range[1], closingElseCurly.range[0]).trim()) {

                                // Don't fix if there are any non-whitespace characters interfering (e.g. comments)
                                return null;
                            }

                            return fixer.replaceTextRange(
                                [elseKeyword.range[1], closingElseCurly.range[0]],
                                " " + sourceText.slice(ifKeyword.range[0], closingIfParen.range[1]) + sourceText.slice(elseKeyword.range[1], openingElseCurly.range[1]) + ifConsequentText
                            );
                        }
                    });
                }
            }
        };

    }
};
