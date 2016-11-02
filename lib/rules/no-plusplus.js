/**
 * @fileoverview Rule to flag use of unary increment and decrement operators.
 * @author Ian Christian Myers
 * @author Brody McKee (github.com/mrmckeb)
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow the unary operators `++` and `--`",
            category: "Stylistic Issues",
            recommended: false
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    allowForLoopAfterthoughts: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        const config = context.options[0];
        let allowInForAfterthought = false;

        if (typeof config === "object") {
            allowInForAfterthought = config.allowForLoopAfterthoughts === true;
        }

        const sourceCode = context.getSourceCode();

        return {

            UpdateExpression(node) {
                if (allowInForAfterthought && node.parent.type === "ForStatement") {
                    return;
                }

                let fixerFunc;

                if (
                    node.parent.type === "ExpressionStatement" ||
                    node.prefix ||
                    (node.parent.type === "ForStatement" && node === node.parent.update)
                ) {
                    let operator = " -= 1";

                    if (node.operator === "++") {
                        operator = " += 1";
                    }

                    const fixedCode = sourceCode.getText(node.argument) + operator;

                    fixerFunc = fixer => fixer.replaceTextRange(node.range, fixedCode);
                }

                context.report({
                    node,
                    message: "Unary operator '{{operator}}' used.",
                    data: {
                        operator: node.operator
                    },
                    fix: fixerFunc || function() {}
                });
            }

        };

    }
};
