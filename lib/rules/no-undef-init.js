/**
 * @fileoverview Rule to flag when initializing to undefined
 * @author Ilya Volodin
 */

"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow initializing variables to `undefined`",
            category: "Variables",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-undef-init"
        },

        schema: [],
        fixable: "code",

        messages: {
            unnecessaryUndefinedInit: "It's not necessary to initialize '{{name}}' to undefined."
        }
    },

    create(context) {

        const sourceCode = context.getSourceCode();

        /**
         * Get the node of init target.
         * @param {ASTNode} node The node to get.
         * @returns {ASTNode} The node of init target.
         */
        function getIdNode(node) {
            switch (node.type) {
                case "VariableDeclarator":
                    return node.id;
                case "PropertyDefinition":
                    return node.key;
                default:
                    throw new Error("unreachable");
            }
        }

        /**
         * Get the node of init value.
         * @param {ASTNode} node The node to get.
         * @returns {ASTNode} The node of init value.
         */
        function getInitNode(node) {
            switch (node.type) {
                case "VariableDeclarator":
                    return node.init;
                case "PropertyDefinition":
                    return node.value;
                default:
                    throw new Error("unreachable");
            }
        }

        /**
         * Get the parent kind of the node.
         * @param {ASTNode} node The node to get.
         * @returns {string} The parent kind.
         */
        function getParentKind(node) {
            switch (node.type) {
                case "VariableDeclarator":
                    return node.parent.kind;
                case "PropertyDefinition":
                    return "field";
                default:
                    throw new Error("unreachable");
            }
        }

        return {

            "VariableDeclarator, PropertyDefinition"(node) {
                const idNode = getIdNode(node),
                    name = sourceCode.getText(idNode),
                    initNode = getInitNode(node),
                    initIsUndefined = initNode && initNode.type === "Identifier" && initNode.name === "undefined",
                    parentKind = getParentKind(node),
                    scope = context.getScope(),
                    undefinedVar = astUtils.getVariableByName(scope, "undefined"),
                    shadowed = undefinedVar && undefinedVar.defs.length > 0,
                    lastToken = sourceCode.getLastToken(node, astUtils.isNotSemicolonToken);

                if (initIsUndefined && parentKind !== "const" && !shadowed) {
                    context.report({
                        node,
                        messageId: "unnecessaryUndefinedInit",
                        data: { name },
                        fix(fixer) {
                            if (parentKind === "var") {
                                return null;
                            }

                            if (idNode.type === "ArrayPattern" || idNode.type === "ObjectPattern") {

                                // Don't fix destructuring assignment to `undefined`.
                                return null;
                            }

                            if (sourceCode.commentsExistBetween(idNode, lastToken)) {
                                return null;
                            }

                            return fixer.removeRange([idNode.range[1], lastToken.range[1]]);
                        }
                    });
                }
            }
        };

    }
};
