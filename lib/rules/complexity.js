/**
 * @fileoverview Counts the cyclomatic complexity of each function of the script. See http://en.wikipedia.org/wiki/Cyclomatic_complexity.
 * Counts the number of if, conditional, for, while, try, switch/case,
 * @author Patrick Brosset
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("./utils/ast-utils");
const { upperCaseFirst } = require("../shared/string-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "enforce a maximum cyclomatic complexity allowed in a program",
            recommended: false,
            url: "https://eslint.org/docs/rules/complexity"
        },

        schema: [
            {
                oneOf: [
                    {
                        type: "integer",
                        minimum: 0
                    },
                    {
                        type: "object",
                        properties: {
                            maximum: {
                                type: "integer",
                                minimum: 0
                            },
                            max: {
                                type: "integer",
                                minimum: 0
                            }
                        },
                        additionalProperties: false
                    }
                ]
            }
        ],

        messages: {
            complex: "{{name}} has a complexity of {{complexity}}. Maximum allowed is {{max}}."
        }
    },

    create(context) {
        const option = context.options[0];
        let THRESHOLD = 20;

        if (
            typeof option === "object" &&
            (Object.prototype.hasOwnProperty.call(option, "maximum") || Object.prototype.hasOwnProperty.call(option, "max"))
        ) {
            THRESHOLD = option.maximum || option.max;
        } else if (typeof option === "number") {
            THRESHOLD = option;
        }

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        // Using a stack to store complexity per code path
        const complexities = [];

        /**
 camelcase-undefvars
       * When parsing a new function, store it in our function stack
         * @returns {void}
         * @private
         */
        function startFunction() {
            fns.push(1);
        }

        /**
         * Evaluate the node at the end of function
         * @param {ASTNode} node node to evaluate. If it is a `PropertyDefinition` node, its initializer is being evaluated.
         * @returns {void}
         * @private
         */
        function endFunction(node) {
            const complexity = fns.pop();

            if (complexity > THRESHOLD) {
                let evaluatedNode, name;

                if (node.type === "PropertyDefinition") {
                    evaluatedNode = node.value;
                    name = "class field initializer";
                } else {
                    evaluatedNode = node;
                    name = astUtils.getFunctionNameWithKind(node);
                }

                context.report({
                    node: evaluatedNode,
                    messageId: "complex",
                    data: {
                        name: upperCaseFirst(name),
                        complexity,
                        max: THRESHOLD
                    }
                });
            }
        }

        /**
         * Increase the complexity of the function in context

         * Increase the complexity of the code path in context
 master
         * @returns {void}
         * @private
         */
        function increaseComplexity() {
            complexities[complexities.length - 1]++;
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        retu camelcase-undefvars
            /*
             * Class field initializers are implicit functions. Therefore, they shouldn't contribute
             * to the enclosing function's complexity, but their own complexity should be evaluated.
             * We're using `*.key:exit` here in order to make sure that `startFunction()` is called
             * before entering the `.value` node, and thus certainly before other listeners
             * (e.g., if the initializer is `a || b`, due to a higher selector specificity
             * `PropertyDefinition > *.value` would be called after `LogicalExpression`).
             * We're passing the `PropertyDefinition` node instead of `PropertyDefinition.value` node
             * to `endFunction(node)` in order to disambiguate between evaluating implicit initializer
             * functions and "regular" functions, which may be the `.value` itself, e.g., `x = () => {};`.
             */
            "PropertyDefinition[value] > *.key:exit": startFunction,
            "PropertyDefinition[value]:exit": endFunct
            onCodePathStart() {

                // The initial complexity is 1, representing one execution path in the CodePath
                complexities.push(1);
            },

            // Each branching in the code adds 1 to the compexity
              master
            CatchClause: increaseComplexity,
            ConditionalExpression: increaseComplexity,
            LogicalExpression: increaseComplexity,
            ForStatement: increaseComplexity,
            ForInStatement: increaseComplexity,
            ForOfStatement: increaseComplexity,
            IfStatement: increaseComplexity,
            WhileStatement: increaseComplexity,
            DoWhileStatement: increaseComplexity,

            // Avoid `default`
            "SwitchCase[test]": increaseComplexity,

            // Logical assignment operators have short-circuiting behavior
            AssignmentExpression(node) {
                if (astUtils.isLogicalAssignmentOperator(node.operator)) {
                    increaseComplexity();
                }
            },

            onCodePathEnd(codePath, node) {
                const complexity = complexities.pop();

                /*
                 * This rule only evaluates complexity of functions, so "program" is excluded.
                 * Class field initializers are implicit functions. Therefore, they shouldn't contribute
                 * to the enclosing function's complexity, but their own complexity should be evaluated.
                 */
                if (
                    codePath.origin !== "function" &&
                    codePath.origin !== "class-field-initializer"
                ) {
                    return;
                }

                if (complexity > THRESHOLD) {
                    const name = codePath.origin === "class-field-initializer"
                        ? "class field initializer"
                        : astUtils.getFunctionNameWithKind(node);

                    context.report({
                        node,
                        messageId: "complex",
                        data: {
                            name: upperCaseFirst(name),
                            complexity,
                            max: THRESHOLD
                        }
                    });
                }
            }
        };

    }
};
