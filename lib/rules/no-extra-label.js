/**
 * @fileoverview Rule to disallow unnecessary labels
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow unnecessary labels",
            category: "Best Practices",
            recommended: false
        },

        fixable: "code",

        schema: []
    },

    create: function(context) {
        var scopeInfo = null;
        var sourceCode = context.getSourceCode();

        /**
         * Creates a new scope with a breakable statement.
         *
         * @param {ASTNode} node - A node to create. This is a BreakableStatement.
         * @returns {void}
         */
        function enterBreakableStatement(node) {
            scopeInfo = {
                label: astUtils.getLabel(node),
                breakable: true,
                upper: scopeInfo
            };
        }

        /**
         * Removes the top scope of the stack.
         *
         * @returns {void}
         */
        function exitBreakableStatement() {
            scopeInfo = scopeInfo.upper;
        }

        /**
         * Creates a new scope with a labeled statement.
         *
         * This ignores it if the body is a breakable statement.
         * In this case it's handled in the `enterBreakableStatement` function.
         *
         * @param {ASTNode} node - A node to create. This is a LabeledStatement.
         * @returns {void}
         */
        function enterLabeledStatement(node) {
            if (!astUtils.isBreakableStatement(node.body)) {
                scopeInfo = {
                    label: node.label.name,
                    breakable: false,
                    upper: scopeInfo
                };
            }
        }

        /**
         * Removes the top scope of the stack.
         *
         * This ignores it if the body is a breakable statement.
         * In this case it's handled in the `exitBreakableStatement` function.
         *
         * @param {ASTNode} node - A node. This is a LabeledStatement.
         * @returns {void}
         */
        function exitLabeledStatement(node) {
            if (!astUtils.isBreakableStatement(node.body)) {
                scopeInfo = scopeInfo.upper;
            }
        }

        /**
         * Builds a fix function that removes text at the specified range in the source text.
         * @param {int[]} range The range to remove
         * @returns {function} Fixer function
         * @private
         */
        function createFix(range) {
            return function(fixer) {
                return fixer.removeRange(range);
            };
        }

        /**
         * Reports a given control node if it's unnecessary.
         *
         * @param {ASTNode} node - A node. This is a BreakStatement or a
         *      ContinueStatement.
         * @returns {void}
         */
        function reportIfUnnecessary(node) {
            if (!node.label) {
                return;
            }

            var labelNode = node.label;
            var label = labelNode.name;
            var info = scopeInfo;

            while (info) {
                if (info.breakable || info.label === label) {
                    if (info.breakable && info.label === label) {
                        var prevToken = sourceCode.getTokenOrCommentBefore(node.label);
                        var range = [prevToken.range[1], node.label.range[1]];

                        context.report({
                            node: node.label,
                            message: "This label '{{name}}' is unnecessary.",
                            data: labelNode,
                            fix: createFix(range)
                        });
                    }
                    return;
                }

                info = info.upper;
            }
        }

        return {
            WhileStatement: enterBreakableStatement,
            "WhileStatement:exit": exitBreakableStatement,
            DoWhileStatement: enterBreakableStatement,
            "DoWhileStatement:exit": exitBreakableStatement,
            ForStatement: enterBreakableStatement,
            "ForStatement:exit": exitBreakableStatement,
            ForInStatement: enterBreakableStatement,
            "ForInStatement:exit": exitBreakableStatement,
            ForOfStatement: enterBreakableStatement,
            "ForOfStatement:exit": exitBreakableStatement,
            SwitchStatement: enterBreakableStatement,
            "SwitchStatement:exit": exitBreakableStatement,
            LabeledStatement: enterLabeledStatement,
            "LabeledStatement:exit": exitLabeledStatement,
            BreakStatement: reportIfUnnecessary,
            ContinueStatement: reportIfUnnecessary
        };
    }
};
