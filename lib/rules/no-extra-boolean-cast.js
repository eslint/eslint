/**
 * @fileoverview Rule to flag unnecessary double negation in Boolean contexts
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow unnecessary boolean casts",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-extra-boolean-cast"
        },

        schema: [{
            type: "object",
            properties: {
                enforceForLogicalOperands: {
                    type: "boolean"
                }
            },
            additionalProperties: false
        }],
        fixable: "code",

        messages: {
            unexpectedCall: "Redundant Boolean call.",
            unexpectedNegation: "Redundant double negation."
        }
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        // Node types which have a test which will coerce values to booleans.
        const BOOLEAN_NODE_TYPES = [
            "IfStatement",
            "DoWhileStatement",
            "WhileStatement",
            "ConditionalExpression",
            "ForStatement"
        ];

        /**
         * Check if a node is inside a Boolean function or constructor.
         * @param {ASTNode} node the node
         * @returns {boolean} If the node is in the context
         */
        function isInFunctionOrConstructorContext(node) {
            return (node.type === "CallExpression" || node.type === "NewExpression") &&
                    node.callee.type === "Identifier" &&
                        node.callee.name === "Boolean";


        }

        /**
         * Checks whether the node is a logical expression and that the option is enabled
         * @param {ASTNode} node the node
         * @returns {boolean} if the node is a logical expression and option is enabled
         */
        function isInLogicalContext(node) {
            return node.type === "LogicalExpression" &&
            (context.options.length && context.options[0].enforceForLogicalOperands === true);

        }


        /**
         * Check if a node is in a context where its value would be coerced to a boolean at runtime.
         * @param {ASTNode} node The node
         * @param {ASTNode} parent Its parent
         * @returns {boolean} If it is in a boolean context
         */
        function isInBooleanContext(node, parent) {

            // Boolean(<bool>) and new Boolean(<bool>)
            return (
                (BOOLEAN_NODE_TYPES.indexOf(parent.type) !== -1 &&
                    node === parent.test) ||

                // !<bool>
                (parent.type === "UnaryExpression" &&
                    parent.operator === "!")
            );
        }

        /**
         * Checks whether the node is in a context that should report an error
         * Acts recursively if it is in a logical context
         * @param {ASTNode} node the node
         * @param {ASTNode} parent the parent
         * @returns {boolean} If the node is in one of the flagged contexts
         */
        function isInFlaggedContext(node, parent) {
            return isInBooleanContext(node, parent) ||
            isInFunctionOrConstructorContext(parent) ||
            (isInLogicalContext(parent) &&

            // For nested logical statements
            isInFlaggedContext(parent, parent.parent)
            );
        }


        /**
         * Check if a node has comments inside.
         * @param {ASTNode} node The node to check.
         * @returns {boolean} `true` if it has comments inside.
         */
        function hasCommentsInside(node) {
            return Boolean(sourceCode.getCommentsInside(node).length);
        }

        return {
            UnaryExpression(node) {
                const ancestors = context.getAncestors(),
                    parent = ancestors.pop(),
                    grandparent = ancestors.pop();


                // Exit early if it's guaranteed not to match
                if (node.operator !== "!" ||
                          parent.type !== "UnaryExpression" ||
                          parent.operator !== "!") {
                    return;
                }


                if (isInFlaggedContext(parent, grandparent)) {
                    context.report({
                        node: parent,
                        messageId: "unexpectedNegation",
                        fix: fixer => {
                            if (hasCommentsInside(parent)) {
                                return null;
                            }

                            let prefix = "";
                            const tokenBefore = sourceCode.getTokenBefore(parent);
                            const firstReplacementToken = sourceCode.getFirstToken(node.argument);

                            if (tokenBefore && tokenBefore.range[1] === parent.range[0] &&
                                    !astUtils.canTokensBeAdjacent(tokenBefore, firstReplacementToken)) {
                                prefix = " ";
                            }

                            return fixer.replaceText(parent, prefix + sourceCode.getText(node.argument));
                        }
                    });
                }
            },
            CallExpression(node) {
                const parent = node.parent;

                if (node.callee.type !== "Identifier" || node.callee.name !== "Boolean") {
                    return;
                }

                if (isInFlaggedContext(node, parent)) {
                    context.report({
                        node,
                        messageId: "unexpectedCall",
                        fix: fixer => {
                            if (!node.arguments.length) {
                                if (parent.type === "UnaryExpression" && parent.operator === "!") {

                                    // !Boolean() -> true

                                    if (hasCommentsInside(parent)) {
                                        return null;
                                    }

                                    const replacement = "true";
                                    let prefix = "";
                                    const tokenBefore = sourceCode.getTokenBefore(parent);

                                    if (tokenBefore && tokenBefore.range[1] === parent.range[0] &&
                                            !astUtils.canTokensBeAdjacent(tokenBefore, replacement)) {
                                        prefix = " ";
                                    }

                                    return fixer.replaceText(parent, prefix + replacement);
                                }

                                // Boolean() -> false
                                if (hasCommentsInside(node)) {
                                    return null;
                                }
                                return fixer.replaceText(node, "false");
                            }

                            if (node.arguments.length > 1 || node.arguments[0].type === "SpreadElement" ||
                                    hasCommentsInside(node)) {
                                return null;
                            }

                            const argument = node.arguments[0];

                            if (astUtils.getPrecedence(argument) < astUtils.getPrecedence(node.parent)) {
                                return fixer.replaceText(node, `(${sourceCode.getText(argument)})`);
                            }
                            return fixer.replaceText(node, sourceCode.getText(argument));
                        }
                    });
                }
            }
        };

    }
};
