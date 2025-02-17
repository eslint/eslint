/**
 * @fileoverview enforce default parameters to be last
 * @author Chiawen Chen
 */

"use strict";

/**
 * checks if node is optional parameter
 * @param {ASTNode} node the node to be evaluated
 * @returns {boolean} whether the node is optional
 */
function isOptionalParam(node) {
    return (
        (node.type === "ArrayPattern" ||
            node.type === "AssignmentPattern" ||
            node.type === "Identifier" ||
            node.type === "ObjectPattern" ||
            node.type === "RestElement") &&
        node.optional
    );
}

/**
 * checks if node is plain parameter
 * @param {ASTNode} node the node to be evaluated
 * @returns {boolean} whether the node is plain
 */
function isPlainParam(node) {
    return !(
        node.type === "AssignmentPattern" ||
        node.type === "RestElement" ||
        isOptionalParam(node)
    );
}

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Enforce default parameters to be last",
            recommended: false,
            frozen: true,
            url: "https://eslint.org/docs/latest/rules/default-param-last"
        },

        schema: [],

        messages: {
            shouldBeLast: "Default parameters should be last."
        }
    },

    create(context) {

        /**
         * Handler for function contexts.
         * @param {ASTNode} node function node
         * @returns {void}
         */
        function handleFunction(node) {
            let hasSeenPlainParam = false;

            for (let i = node.params.length - 1; i >= 0; i -= 1) {
                const current = node.params[i];
                const param =
                    current.type === "TSParameterProperty"
                        ? current.parameter
                        : current;

                if (isPlainParam(param)) {
                    hasSeenPlainParam = true;
                    continue;
                }

                if (
                    hasSeenPlainParam &&
                    (isOptionalParam(param) ||
                    param.type === "AssignmentPattern")
                ) {
                    context.report({
                        node: current,
                        messageId: "shouldBeLast"
                    });
                }
            }
        }

        return {
            FunctionDeclaration: handleFunction,
            FunctionExpression: handleFunction,
            ArrowFunctionExpression: handleFunction
        };
    }
};
