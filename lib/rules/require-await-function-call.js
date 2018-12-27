"use strict";

//------------------------------------------------------------------------------
// Helper functions.
//------------------------------------------------------------------------------

/**
 * Checks if the given node is of the given type.
 *
 * @param {ASTNode} node - the node to check.
 * @param {string} type - the type to look for.
 * @returns {boolean} `true` if the node is of the given type.
 */
function isType(node, type) {
    return node.type === type;
}

/**
 * Checks if the given node is an Identifier.
 *
 * @param {ASTNode} node - the node to check.
 * @returns {boolean} `true` if the node is an Identifier.
 */
function isIdentifier(node) {
    return isType(node, "Identifier");
}

/**
 * Checks if the given node is an AwaitExpression.
 *
 * @param {ASTNode} node - the node to check.
 * @returns {boolean} `true` if the node is an AwaitExpression.
 */
function isAwaitExpression(node) {
    return isType(node, "AwaitExpression");
}

/**
 * Checks if the given node is a CallExpression.
 *
 * @param {ASTNode} node - the node to check.
 * @returns {boolean} `true` if the node is a CallExpression.
 */
function isCallExpression(node) {
    return isType(node, "CallExpression");
}

/**
 * Checks if the given node is a MemberExpression.
 *
 * @param {ASTNode} node - the node to check.
 * @returns {boolean} `true` if the node is a MemberExpression.
 */
function isMemberExpression(node) {
    return isType(node, "MemberExpression");
}

/**
 * Checks if the given node is part of a call with the `async` keyword.
 *
 * @param {ASTNode} node - the node to check.
 * @returns {boolean} `true` if the node is part of a call with the `async` keyword.
 */
function isAsyncCall(node) {
    if (!node.parent) {

        // Can't be part of an AwaitExpression if it has no parent.
        return false;
    }

    const parent = node.parent;

    if (isAwaitExpression(parent)) {
        return true;
    }

    if (isCallExpression(parent) || isMemberExpression(parent)) {

        // Check to see if the AwaitExpression is still another level above.
        return isAsyncCall(parent);
    }

    return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require using `await` with calls to specified functions.",
            category: "Possible Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/require-await-function-call"
        },
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    functions: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        minItems: 1
                    }
                },
                additionalProperties: false
            }
        ]
    },
    create(context) {
        return {
            CallExpression(node) {
                const callee = node.callee;

                if (
                    !isIdentifier(callee) || !context.options[0].functions.includes(callee.name)
                ) {

                    // Not one of the specified async functions.
                    return;
                }

                if (!isAsyncCall(node)) {

                    // Missing `await`.
                    context.report({
                        node,
                        message: "Use `await` with `{{ calleeName }}` function call.",
                        data: {
                            calleeName: callee.name
                        }
                    });
                }
            }
        };
    }
};
