/**
 * @fileoverview Rule to flag no-useless-arrow-block
 * @author Leon Heess
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow arrow functions with block parentheses where they are not needed",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/no-useless-arrow-block"
        },

        schema: [],

        fixable: "code",

        messages: {
            uselessArrowBlock: "This arrow function could drop its block parentheses."
        }
    },
    create(context) {
        const sourceCode = context.sourceCode;

        return {
            ArrowFunctionExpression(node) {

                // Check if the arrow function has a block body with a single statement
                if (node.body.type !== "BlockStatement" || node.body.body.length !== 1) {
                    return;
                }

                // Check if the arrow function has comments
                if (sourceCode.getCommentsInside(node.body).length > 0) {
                    return;
                }

                // Check if the arrow function has a newline in its body
                if (sourceCode.getText(node.body).includes("\n")) {
                    return;
                }

                // Check if the arrow function is a class method or static class property
                if (node.parent.type === "MethodDefinition" || node.parent.static && (node.parent.type === "ClassProperty" || node.parent.type === "PropertyDefinition")) {
                    return;
                }

                const statement = node.body.body[0];
                let fixed;

                if (statement.type === "ReturnStatement") {
                    if (!statement.argument) {
                        return;
                    }
                    fixed = sourceCode.getText(statement.argument);

                    // Wrap objects in parentheses to avoid it being interpreted as a block
                    if (statement.argument.type === "ObjectExpression") {
                        fixed = `(${fixed})`;
                    }
                } else if (statement.type === "ExpressionStatement" && statement.expression.type !== "AssignmentExpression" && statement.expression.type !== "SequenceExpression") {
                    fixed = sourceCode.getText(statement.expression);
                } else {
                    return;
                }

                context.report({
                    node,
                    messageId: "uselessArrowBlock",
                    fix(fixer) {
                        const arrowToken = sourceCode.getTokenBefore(node.body);
                        const bodyClosingBrace = sourceCode.getLastToken(node.body);

                        return fixer.replaceTextRange([arrowToken.range[1], bodyClosingBrace.range[1]], ` ${fixed}`);
                    }
                });
            }
        };
    }
};
