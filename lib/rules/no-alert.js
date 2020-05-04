/**
 * @fileoverview Rule to flag use of alert, confirm, prompt
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const getPropertyName = require("../util/ast-utils").getStaticPropertyName;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks if the given name is a prohibited identifier.
 * @param {string} name The name to check
 * @returns {boolean} Whether or not the name is prohibited.
 */
function isProhibitedIdentifier(name) {
    return /^(alert|confirm|prompt)$/.test(name);
}

/**
 * Finds the eslint-scope reference in the given scope.
 * @param {Object} scope The scope to search.
 * @param {ASTNode} node The identifier node.
 * @returns {Reference|null} Returns the found reference or null if none were found.
 */
function findReference(scope, node) {
    const references = scope.references.filter(reference => reference.identifier.range[0] === node.range[0] &&
            reference.identifier.range[1] === node.range[1]);

    if (references.length === 1) {
        return references[0];
    }
    return null;
}

/**
 * Checks if the given identifier node is shadowed in the given scope.
 * @param {Object} scope The current scope.
 * @param {string} node The identifier node to check
 * @returns {boolean} Whether or not the name is shadowed.
 */
function isShadowed(scope, node) {
    const reference = findReference(scope, node);

    return reference && reference.resolved && reference.resolved.defs.length > 0;
}

/**
 * Checks if the given identifier node is a ThisExpression in the global scope or the global window property.
 * @param {Object} scope The current scope.
 * @param {string} node The identifier node to check
 * @returns {boolean} Whether or not the node is a reference to the global object.
 */
function isGlobalThisReferenceOrGlobalWindow(scope, node) {
    if (scope.type === "global" && node.type === "ThisExpression") {
        return true;
    }
    if (node.name === "window") {
        return !isShadowed(scope, node);
    }

    return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow the use of `alert`, `confirm`, and `prompt`",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-alert"
        },

        schema: [],

        messages: {
            unexpected: "Unexpected {{name}}."
        }
    },

    create(context) {
        return {
            CallExpression(node) {
                const callee = node.callee,
                    currentScope = context.getScope();

                // without window.
                if (callee.type === "Identifier") {
                    const name = callee.name;

                    if (!isShadowed(currentScope, callee) && isProhibitedIdentifier(callee.name)) {
                        context.report({
                            node,
                            messageId: "unexpected",
                            data: { name }
                        });
                    }

                } else if (callee.type === "MemberExpression" && isGlobalThisReferenceOrGlobalWindow(currentScope, callee.object)) {
                    const name = getPropertyName(callee);

                    if (isProhibitedIdentifier(name)) {
                        context.report({
                            node,
                            messageId: "unexpected",
                            data: { name }
                        });
                    }
                }

            }
        };

    }
};
