/**
 * @fileoverview Rule to flag use of implied eval via setTimeout and setInterval
 * @author James Allardice
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
            description: "disallow the use of `eval()`-like methods",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-implied-eval"
        },

        schema: [],

        messages: {
            impliedEval: "Implied eval. Consider passing a function instead of a string."
        }
    },

    create(context) {
        const EVAL_LIKE_FUNCS = Object.freeze(["setTimeout", "execScript", "setInterval"]);
        const GLOBAL_CANDIDATES = Object.freeze(["global", "window"]);

        /**
         * Checks whether a node is evaluated as a string or not.
         * @param {ASTNode} node A node to check.
         * @returns {boolean} True if the node is evaluated as a string.
         */
        function isEvaluatedSting(node) {
            if (
                (node.type === "Literal" && typeof node.value === "string") ||
                node.type === "TemplateLiteral"
            ) {
                return true;
            }
            if (node.type === "BinaryExpression" && node.operator === "+") {
                return isEvaluatedSting(node.left) || isEvaluatedSting(node.right);
            }
            return false;
        }

        /**
         * Checks whether a node is an Identifier node named one of the specified names.
         * @param {ASTNode} node A node to check.
         * @param {string[]} specifiers Array of specified name.
         * @returns {boolean} True if the node is a Identifier node which has specified name.
         */
        function isSpecifiedIdentifier(node, specifiers) {
            return node.type === "Identifier" && specifiers.includes(node.name);
        }

        /**
         * Checks whether a node is a Literal node which has one of the specified values.
         * @param {ASTNode} node A node to check.
         * @param {string[]} specifiers Array of specified value.
         * @returns {boolean} True if the node is a Literal node which has one of the specified values.
         */
        function isSpecifiedConstant(node, specifiers) {
            switch (node.type) {
                case "Literal":
                    return specifiers.includes(node.value);

                case "TemplateLiteral":
                    return (
                        node.expressions.length === 0 &&
                        specifiers.includes(node.quasis[0].value.cooked)
                    );

                default:
                    return false;
            }
        }

        /**
         * Checks a given node is a MemberExpression node which has the specified name's
         * property.
         * @param {ASTNode} node A node to check.
         * @param {string[]} specifiers Array of specified name.
         * @returns {boolean} `true` if the node is a MemberExpression node which has
         *      the specified name's property
         */
        function isSpecifiedMember(node, specifiers) {
            return (
                node.type === "MemberExpression" &&
                (node.computed ? isSpecifiedConstant : isSpecifiedIdentifier)(node.property, specifiers)
            );
        }

        /**
         * Reports if the `CallExpression` node has evaluated argument.
         * @param {ASTNode} node A CallExpression to check.
         * @returns {void}
         */
        function reportImpliedEvalCallExpression(node) {
            const [firstArgument] = node.arguments;

            if (firstArgument && isEvaluatedSting(firstArgument)) {
                context.report({
                    node,
                    messageId: "impliedEval"
                });
            }
        }

        /**
         * Reports calls of `implied eval` via the global references.
         * @param {Variable} globalVar A global variable to check.
         * @returns {void}
         */
        function reportImpliedEvalViaGlobal(globalVar) {
            const { references, name } = globalVar;

            references.forEach(ref => {
                const identifier = ref.identifier;
                let node = identifier.parent;

                while (isSpecifiedMember(node, [name])) {
                    node = node.parent;
                }

                if (isSpecifiedMember(node, EVAL_LIKE_FUNCS)) {
                    node = node.parent;
                    reportImpliedEvalCallExpression(node);
                }
            });
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            CallExpression(node) {
                if (isSpecifiedIdentifier(node.callee, EVAL_LIKE_FUNCS)) {
                    reportImpliedEvalCallExpression(node);
                }
            },
            "Program:exit"() {
                const globalScope = context.getScope();

                const globalVariables = GLOBAL_CANDIDATES
                    .map(candidate => astUtils.getVariableByName(globalScope, candidate))
                    .filter(globalVar => !!globalVar);

                globalVariables.forEach(reportImpliedEvalViaGlobal);
            }
        };

    }
};
