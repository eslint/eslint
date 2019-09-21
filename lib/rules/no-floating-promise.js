/**
 * @fileoverview Rule to avoid "floating" promises
 * @author Sebastien Guillemot
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * recursively go up levels in scope until we find our variable declaration
 * @param {Scope} scope - starting scope for search
 * @param {string} name - name of literal to look for
 * @returns {Variable|null|void}  variable corresponding to literal
 */
function findInScope(scope, name) {
    if (name === null || typeof name === "undefined" || scope === null || typeof scope === "undefined") {
        return null;
    }
    const definition = scope.set.get(name);

    if (definition === null || typeof definition === "undefined") {
        return findInScope(scope.upper, name);
    }

    return definition;
}

/**
 * Gets a string representation of a type if one exists
 * @param {*} type - object representing a type
 * @returns {string|null|void} type if one exists
 */
function getTypeAnnotation(type) {
    if (type === null || typeof type === "undefined") {
        return null;
    }

    // note: id is missing on types like "any"
    if (type.typeAnnotation && type.typeAnnotation.id) {
        return type.typeAnnotation.id.name;
    }

    return null;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow floating promises",
            category: "Possible Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-floating-promise"
        },

        schema: [],

        fixable: "code",

        messages: {
            foundFloating: "Floating promises can lead to unexpected scheduling."
        }
    },

    create(context) {
        return {

            /*
             * Note: CallExpression does not match on "await foo()" as this is an AwaitExpression
             * so this condition already filters out non-floating promises
             */
            "ExpressionStatement > CallExpression"(node) {

                // handle anonymously function calls
                if (
                    node.callee.type === "ArrowFunctionExpression" ||
                    node.callee.type === "FunctionExpression") {
                    if (node.callee.async || getTypeAnnotation(node.callee.returnType) === "Promise") {
                        context.report({
                            fix(fixer) {
                                return fixer.replaceText(node, `await ${context.getSourceCode().getText(node)}`);
                            },
                            loc: node.loc,
                            messageId: "foundFloating",
                            node
                        });
                    }
                }

                // handle named function calls
                if (node.callee.type === "Identifier") {
                    const variable = findInScope(context.getScope(), node.callee.name);

                    if (variable === null || typeof variable === "undefined") {
                        return;
                    }
                    const definition = variable.defs[0];

                    if (definition === null || typeof definition === "undefined") {
                        return;
                    }

                    const defNode = definition.node;

                    if (defNode.async || getTypeAnnotation(defNode.returnType) === "Promise") {
                        context.report({
                            fix(fixer) {
                                return fixer.replaceText(node, `await ${context.getSourceCode().getText(node)}`);
                            },
                            loc: node.loc,
                            messageId: "foundFloating",
                            node
                        });
                    }
                }
            }
        };
    }
};
