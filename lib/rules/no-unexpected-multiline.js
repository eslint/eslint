/**
 * @fileoverview Rule to spot scenarios where a newline looks like it is ending a statement, but is not.
 * @author Glen Mailer
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("../util/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow confusing multiline expressions",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-unexpected-multiline"
        },

        schema: []
    },

    create(context) {

        const FUNCTION_MESSAGE = "Unexpected newline between function and ( of function call.";
        const PROPERTY_MESSAGE = "Unexpected newline between object and [ of property access.";
        const TAGGED_TEMPLATE_MESSAGE = "Unexpected newline between template tag and template literal.";
        const DIVISION_MESSAGE = "Unexpected newline between numerator and division operator.";

        const REGEX_FLAG_MATCHER = /^[gimsuy]+$/;

        const sourceCode = context.getSourceCode();

        /**
         * Check to see if there is a newline between the node and the following open bracket
         * line's expression
         * @param {ASTNode} node The node to check.
         * @param {string} msg The error message to use.
         * @returns {void}
         * @private
         */
        function checkForBreakAfter(node, msg) {
            const openParen = sourceCode.getTokenAfter(node, astUtils.isNotClosingParenToken);
            const nodeExpressionEnd = sourceCode.getTokenBefore(openParen);

            if (openParen.loc.start.line !== nodeExpressionEnd.loc.end.line) {
                context.report({ node, loc: openParen.loc.start, message: msg, data: { char: openParen.value } });
            }
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        return {

            MemberExpression(node) {
                if (!node.computed) {
                    return;
                }
                checkForBreakAfter(node.object, PROPERTY_MESSAGE);
            },

            TaggedTemplateExpression(node) {
                if (node.tag.loc.end.line === node.quasi.loc.start.line) {
                    return;
                }
                context.report({ node, loc: node.loc.start, message: TAGGED_TEMPLATE_MESSAGE });
            },

            CallExpression(node) {
                if (node.arguments.length === 0) {
                    return;
                }
                checkForBreakAfter(node.callee, FUNCTION_MESSAGE);
            },

            "BinaryExpression[operator='/'] > BinaryExpression[operator='/'].left"(node) {
                const secondSlash = sourceCode.getTokenAfter(node, token => token.value === "/");
                const tokenAfterOperator = sourceCode.getTokenAfter(secondSlash);

                if (
                    tokenAfterOperator.type === "Identifier" &&
                    REGEX_FLAG_MATCHER.test(tokenAfterOperator.value) &&
                    secondSlash.range[1] === tokenAfterOperator.range[0]
                ) {
                    checkForBreakAfter(node.left, DIVISION_MESSAGE);
                }
            }
        };

    }
};
