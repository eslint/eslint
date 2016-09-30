/**
 * @fileoverview Rule to flag when IIFE is not wrapped in parens
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require parentheses around immediate `function` invocations",
            category: "Best Practices",
            recommended: false
        },

        schema: [
            {
                enum: ["outside", "inside", "any"]
            }
        ],

        fixable: "code"
    },

    create(context) {

        const style = context.options[0] || "outside";

        const sourceCode = context.getSourceCode();

        /**
         * Check if the node is wrapped in ()
         * @param {ASTNode} node node to evaluate
         * @returns {boolean} True if it is wrapped
         * @private
         */
        function wrapped(node) {
            const previousToken = sourceCode.getTokenBefore(node),
                nextToken = sourceCode.getTokenAfter(node);

            return previousToken && previousToken.value === "(" &&
                nextToken && nextToken.value === ")";
        }

        return {

            CallExpression(node) {
                if (node.callee.type === "FunctionExpression") {
                    const callExpressionWrapped = wrapped(node),
                        functionExpressionWrapped = wrapped(node.callee);

                    if (!callExpressionWrapped && !functionExpressionWrapped) {
                        context.report({
                            node,
                            message: "Wrap an immediate function invocation in parentheses.",
                            fix(fixer) {
                                const nodeToSurround = style === "inside" ? node.callee : node;

                                return fixer.replaceText(nodeToSurround, `(${sourceCode.getText(nodeToSurround)})`);
                            }
                        });
                    } else if (style === "inside" && !functionExpressionWrapped) {
                        context.report({
                            node,
                            message: "Wrap only the function expression in parens.",
                            fix(fixer) {

                                /*
                                 * The outer call expression will always be wrapped at this point.
                                 * Replace the range between the end of the function expression and the end of the call expression.
                                 * for example, in `(function(foo) {}(bar))`, the range `(bar))` should get replaced with `)(bar)`.
                                 * Replace the parens from the outer expression, and parenthesize the function expression.
                                 */
                                const parenAfter = sourceCode.getTokenAfter(node);

                                return fixer.replaceTextRange(
                                    [node.callee.range[1], parenAfter.range[1]],
                                    `)${sourceCode.getText().slice(node.callee.range[1], parenAfter.range[0])}`
                                );
                            }
                        });
                    } else if (style === "outside" && !callExpressionWrapped) {
                        context.report({
                            node,
                            message: "Move the invocation into the parens that contain the function.",
                            fix(fixer) {

                                /*
                                 * The inner function expression will always be wrapped at this point.
                                 * It's only necessary to replace the range between the end of the function expression
                                 * and the call expression. For example, in `(function(foo) {})(bar)`, the range `)(bar)`
                                 * should get replaced with `(bar))`.
                                 */
                                const parenAfter = sourceCode.getTokenAfter(node.callee);

                                return fixer.replaceTextRange(
                                    [parenAfter.range[0], node.range[1]],
                                    `${sourceCode.getText().slice(parenAfter.range[1], node.range[1])})`
                                );
                            }
                        });
                    }
                }
            }
        };

    }
};
