/**
 * @fileoverview Rule to enforce var declarations are only at the top of a function.
 * @author Danny Fritz
 * @author Gyandeep Singh
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "require `var` declarations be placed at the top of their containing scope",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/vars-on-top"
        },

        schema: [],
        messages: {
            top: "All 'var' declarations must be at the top of the function scope."
        }
    },

    create(context) {

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * @param {ASTNode} node - any node
         * @returns {boolean} whether the given node structurally represents a directive
         */
        function looksLikeDirective(node) {
            return node.type === "ExpressionStatement" &&
                node.expression.type === "Literal" && typeof node.expression.value === "string";
        }

        /**
         * Check to see if its a ES6 import declaration
         * @param {ASTNode} node - any node
         * @returns {boolean} whether the given node represents a import declaration
         */
        function looksLikeImport(node) {
            return node.type === "ImportDeclaration" || node.type === "ImportSpecifier" ||
                node.type === "ImportDefaultSpecifier" || node.type === "ImportNamespaceSpecifier";
        }

        /**
         * Checks whether a given node is a variable declaration or not.
         *
         * @param {ASTNode} node - any node
         * @returns {boolean} `true` if the node is a variable declaration.
         */
        function isVariableDeclaration(node) {
            return (
                node.type === "VariableDeclaration" ||
                (
                    node.type === "ExportNamedDeclaration" &&
                    node.declaration &&
                    node.declaration.type === "VariableDeclaration"
                )
            );
        }

        /**
         * Checks whether this variable is on top of the block body
         * @param {ASTNode} node - The node to check
         * @param {ASTNode[]} statements - collection of ASTNodes for the parent node block
         * @returns {boolean} True if var is on top otherwise false
         */
        function isVarOnTop(node, statements) {
            const l = statements.length;
            let i = 0;

            // skip over directives
            for (; i < l; ++i) {
                if (!looksLikeDirective(statements[i]) && !looksLikeImport(statements[i])) {
                    break;
                }
            }

            for (; i < l; ++i) {
                if (!isVariableDeclaration(statements[i])) {
                    return false;
                }
                if (statements[i] === node) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Checks whether variable is on top at the global level
         * @param {ASTNode} node - The node to check
         * @param {ASTNode} parent - Parent of the node
         * @returns {void}
         */
        function globalVarCheck(node, parent) {
            if (!isVarOnTop(node, parent.body)) {
                context.report({ node, messageId: "top" });
            }
        }

        /**
         * Checks whether variable is on top at functional block scope level
         * @param {ASTNode} node - The node to check
         * @param {ASTNode} parent - Parent of the node
         * @param {ASTNode} grandParent - Parent of the node's parent
         * @returns {void}
         */
        function blockScopeVarCheck(node, parent, grandParent) {
            if (!(/Function/.test(grandParent.type) &&
                    parent.type === "BlockStatement" &&
                    isVarOnTop(node, parent.body))) {
                context.report({ node, messageId: "top" });
            }
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        return {
            "VariableDeclaration[kind='var']"(node) {
                if (node.parent.type === "ExportNamedDeclaration") {
                    globalVarCheck(node.parent, node.parent.parent);
                } else if (node.parent.type === "Program") {
                    globalVarCheck(node, node.parent);
                } else {
                    blockScopeVarCheck(node, node.parent, node.parent.parent);
                }
            }
        };

    }
};
