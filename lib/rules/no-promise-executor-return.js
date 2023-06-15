/**
 * @fileoverview Rule to disallow returning values from Promise executor functions
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { findVariable } = require("@eslint-community/eslint-utils");
const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const functionTypesToCheck = new Set(["ArrowFunctionExpression", "FunctionExpression"]);

/**
 * Determines whether the given identifier node is a reference to a global variable.
 * @param {ASTNode} node `Identifier` node to check.
 * @param {Scope} scope Scope to which the node belongs.
 * @returns {boolean} True if the identifier is a reference to a global variable.
 */
function isGlobalReference(node, scope) {
    const variable = findVariable(scope, node);

    return variable !== null && variable.scope.type === "global" && variable.defs.length === 0;
}

/**
 * Finds function's outer scope.
 * @param {Scope} scope Function's own scope.
 * @returns {Scope} Function's outer scope.
 */
function getOuterScope(scope) {
    const upper = scope.upper;

    if (upper.type === "function-expression-name") {
        return upper.upper;
    }
    return upper;
}

/**
 * Determines whether the given function node is used as a Promise executor.
 * @param {ASTNode} node The node to check.
 * @param {Scope} scope Function's own scope.
 * @returns {boolean} `true` if the node is a Promise executor.
 */
function isPromiseExecutor(node, scope) {
    const parent = node.parent;

    return parent.type === "NewExpression" &&
        parent.arguments[0] === node &&
        parent.callee.type === "Identifier" &&
        parent.callee.name === "Promise" &&
        isGlobalReference(parent.callee, getOuterScope(scope));
}

/**
 * Checks if the given node is a void expression.
 * @param {ASTNode} node The node to check.
 * @returns {boolean} - `true` if the node is a void expression
 */
function expressionIsVoid(node) {
    return node.type === "UnaryExpression" && node.operator === "void";
}

/**
 * Fixes the linting error by prepending "void " to the given node's body.
 * @param {ASTNode} node The node to fix.
 * @param {Object} fixer The fixer object provided by ESLint.
 * @returns {Array<Object>|Object} - An array of fix objects or fix to apply to the node.
 */
function voidPrependFixer(node, fixer) {

    /*
     * prepending `void ` will fail if
     * the expression is () => void () => {}
     * therefore, check if the expression is a function
     */
    if (node.body.type === "ArrowFunctionExpression") {
        return [
            fixer.insertTextBefore(node.body, "void ("),
            fixer.insertTextAfter(node.body, ")")
        ];
    }
    return fixer.insertTextBefore(node.body, "void ");
}

/**
 * Fixes the linting error by `wrapping {}` around the given node's body.
 * @param {Object} sourceCode context given by context.sourceCode
 * @param {ASTNode} node The node to fix.
 * @param {Object} fixer The fixer object provided by ESLint.
 * @returns {Array<Object>} - An array of fix objects or fix to apply to the node.
 */
function curlyWrapFixer(sourceCode, node, fixer) {

    // @mdjermanovic https://github.com/eslint/eslint/pull/17282#issuecomment-1592795923
    const arrowToken = sourceCode.getTokenBefore(node.body, astUtils.isArrowToken);
    const firstToken = sourceCode.getTokenAfter(arrowToken);
    const lastToken = sourceCode.getLastToken(node);

    return [
        fixer.insertTextBefore(firstToken, "{"),
        fixer.insertTextAfter(lastToken, "}")
    ];
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "Disallow returning values from Promise executor functions",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/no-promise-executor-return"
        },

        hasSuggestions: true,

        schema: [{
            type: "object",
            properties: {
                allowVoid: {
                    type: "boolean",
                    default: false
                }
            }
        }],

        messages: {
            returnsValue: "Return values from promise executor functions cannot be read.",
            useVoid: "Return values from promise executor functions cannot be read. If you prefer to use arrow functions without `{...}`, prepend `void` to the expression.",
            prependVoid: "Prepend `void` to the expression.",
            wrapBraces: "Wrap the expression in `{}`."
        }
    },

    create(context) {

        let funcInfo = null;
        const sourceCode = context.sourceCode;
        const {
            allowVoid = false
        } = context.options[0] || {};

        return {

            onCodePathStart(_, node) {
                funcInfo = {
                    upper: funcInfo,
                    shouldCheck:
                        functionTypesToCheck.has(node.type) &&
                            isPromiseExecutor(node, sourceCode.getScope(node))
                };

                if (

                    // Is a Promise executor
                    funcInfo.shouldCheck &&
                        node.type === "ArrowFunctionExpression" &&
                        node.expression &&

                        // Except void
                        !(allowVoid && expressionIsVoid(node.body))
                ) {

                    context.report({
                        node: node.body,
                        messageId: "useVoid",
                        suggest: [
                            {
                                messageId: "prependVoid",
                                fix(fixer) {
                                    return voidPrependFixer(node, fixer);
                                }
                            },
                            {
                                messageId: "wrapBraces",
                                fix(fixer) {
                                    return curlyWrapFixer(sourceCode, node, fixer);
                                }
                            }
                        ]
                    });
                }
            },

            onCodePathEnd() {
                funcInfo = funcInfo.upper;
            },

            ReturnStatement(node) {
                if (funcInfo.shouldCheck && node.argument) {
                    context.report({ node, messageId: "returnsValue" });
                }
            }
        };
    }
};
