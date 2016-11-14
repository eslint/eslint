/**
 * @fileoverview Disallows unnecessary `return await`
 * @author Jordan Harband
 */
"use strict";

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const message = "Redundant use of `await` on a return value.";

module.exports = {
    meta: {
        docs: {
            description: "disallow unnecessary `return await`",
            category: "Best Practices",
            recommended: false // TODO: set to true
        },
        fixable: false,
        schema: [
        ]
    },

    create(context) {

        /**
         * Reports a found unnecessary `await` expression.
         * @param {ASTNode} node The node representing the `await` expression to report
         * @returns {void}
         */
        function reportUnnecessaryAwait(node) {
            context.report({
                node: context.getSourceCode().getFirstToken(node),
                loc: node.loc,
                message,
            });
        }

        /**
        * Finds recursively an `await` expression that is a possible resultant return and is considered unnecessary by the definition of this rule.
        * This recursion is necessary to cover the cases which `return` argument is formed by comma sequences and/or ternary conditions that could result in an `await` expression.
        * @param {ASTNode} node A node that is the `return` argument or decendent
        * @returns {void}
        */
        function findUnnecessaryAwait(node) {
            switch (node.type) {
                case "AwaitExpression":
                    reportUnnecessaryAwait(node);
                    break;

                case "SequenceExpression":
                    findUnnecessaryAwait(node.expressions[node.expressions.length - 1]);
                    break;

                case "ConditionalExpression":
                    findUnnecessaryAwait(node.consequent);
                    findUnnecessaryAwait(node.alternate);
                    break;

                default:

                    // Do nothing
            }
        }

        /**
        * Determines whether a thrown error from this node will be caught/handled within this function rather than immediately halting
        * this function. For example, a statement in a `try` block will always have an error handler. A statement in
        * a `catch` block will only have an error handler if there is also a `finally` block.
        * @param {ASTNode} node A node representing a location where an could be thrown
        * @returns {boolean} `true` if a thrown error will be caught/handled in this function
        */
        function hasErrorHandler(node) {
            let ancestor = node;

            while (!astUtils.isFunction(ancestor) && ancestor.type !== "Program") {
                if (ancestor.parent.type === "TryStatement" && (ancestor === ancestor.parent.block || ancestor === ancestor.parent.handler && ancestor.parent.finalizer)) {
                    return true;
                }
                ancestor = ancestor.parent;
            }
            return false;
        }

        return {
            ArrowFunctionExpression(node) {
                if (node.async) {
                    findUnnecessaryAwait(node.body);
                }
            },
            ReturnStatement(node) {
                if (node.argument && !hasErrorHandler(node)) {
                    findUnnecessaryAwait(node.argument);
                }
            },
        };
    }
};
