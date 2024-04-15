/**
 * @fileoverview Rule to disallow async functions which have no `await` expression.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Capitalize the 1st letter of the given text.
 * @param {string} text The text to capitalize.
 * @returns {string} The text that the 1st letter was capitalized.
 */
function capitalizeFirstLetter(text) {
    return text[0].toUpperCase() + text.slice(1);
}

/**
 * Has AST suggesting a directive.
 * @param {ASTNode} node any node
 * @returns {boolean} whether the given node structurally represents a directive
 */
function looksLikeDirective(node) {
    return node.type === "ExpressionStatement" &&
        node.expression.type === "Literal" && typeof node.expression.value === "string";
}

/**
 * Gets the leading sequence of members in a list that pass the predicate.
 * @param {Function} predicate ([a] -> Boolean) the function used to make the determination
 * @param {a[]} list the input list
 * @returns {a[]} the leading sequence of members in the given list that pass the given predicate
 */
function takeWhile(predicate, list) {
    for (let i = 0; i < list.length; ++i) {
        if (!predicate(list[i])) {
            return list.slice(0, i);
        }
    }
    return list.slice();
}

/**
 * Gets leading directives nodes in a Node body.
 * @param {ASTNode} node a Program or BlockStatement node
 * @returns {ASTNode[]} the leading sequence of directive nodes in the given node's body
 */
function directiveNodes(node) {
    return takeWhile(looksLikeDirective, node.body);
}

/**
 * Gets directive strings from an array of directive nodes.
 * @param {ASTNode[]} nodes directive nodes
 * @returns {string[]} the string contents of the given nodes
 */
function directiveValues(nodes) {
    return nodes.map((node) => node.expression.value);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow async functions which have no `await` expression",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/require-await"
        },

        schema: [{
            type: "object",
            properties: {
                ignoreDirectives: {
                    type: "array",
                    items: { type: "string" },
                    uniqueItems: true
                }
            },
            additionalProperties: false
        }],

        messages: {
            missingAwait: "{{name}} has no 'await' expression."
        }
    },

    create(context) {
        const sourceCode = context.sourceCode;
        let scopeInfo = null;
        const ignoredDirectives = context.options[0] && context.options[0].ignoreDirectives || []

        /**
         * Push the scope info object to the stack.
         * @returns {void}
         */
        function enterFunction() {
            scopeInfo = {
                upper: scopeInfo,
                hasAwait: false
            };
        }

        /**
         * Pop the top scope info object from the stack.
         * Also, it reports the function if needed.
         * @param {ASTNode} node The node to report.
         * @returns {void}
         */
        function exitFunction(node) {
            if (node.body.type === "BlockStatement") {
                const directives = directiveValues(directiveNodes(node.body))
                if (directives.some((d) => ignoredDirectives.includes(d))) return
            }

            if (!node.generator && node.async && !scopeInfo.hasAwait && !astUtils.isEmptyFunction(node)) {
                context.report({
                    node,
                    loc: astUtils.getFunctionHeadLoc(node, sourceCode),
                    messageId: "missingAwait",
                    data: {
                        name: capitalizeFirstLetter(
                            astUtils.getFunctionNameWithKind(node)
                        )
                    }
                });
            }

            scopeInfo = scopeInfo.upper;
        }

        return {
            FunctionDeclaration: enterFunction,
            FunctionExpression: enterFunction,
            ArrowFunctionExpression: enterFunction,
            "FunctionDeclaration:exit": exitFunction,
            "FunctionExpression:exit": exitFunction,
            "ArrowFunctionExpression:exit": exitFunction,

            AwaitExpression() {
                if (!scopeInfo) {
                    return;
                }

                scopeInfo.hasAwait = true;
            },
            ForOfStatement(node) {
                if (!scopeInfo) {
                    return;
                }

                if (node.await) {
                    scopeInfo.hasAwait = true;
                }
            }
        };
    }
};
