/**
 * @fileoverview Rule to enforce that all class methods use 'this'.
 * @author Patrick Williams
 */
"use strict";

const { rule } = require("./utils/rule");

/**
 * @template T
 * @typedef {import("./utils/rule").AST<T>} AST
 */
/** @typedef {import("./utils/rule").AST<"MethodDefinition", { computed: false }>} MethodDefinitionNotComputed */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = rule({
    meta: {
        type: "suggestion",

        docs: {
            description: "enforce that class methods utilize `this`",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/class-methods-use-this"
        },

        schema: [{
            type: "object",
            properties: {
                exceptMethods: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        }],

        messages: {
            missingThis: "Expected 'this' to be used by class method '{{name}}'."
        }
    },
    create(context) {
        const config = Object.assign({}, context.options[0]);
        const exceptMethods = new Set(config.exceptMethods || []);

        /** @type {boolean[]} */
        const stack = [];

        /**
         * Initializes the current context to false and pushes it onto the stack.
         * These booleans represent whether 'this' has been used in the context.
         * @returns {void}
         * @private
         */
        function enterFunction() {
            stack.push(false);
        }

        /**
         * Check if the node is an instance method
         * @param {AST<"Node">} node - node to check
         * @returns {node is AST<"MethodDefinition">} True if its an instance method
         * @private
         */
        function isInstanceMethod(node) {
            return node.type === "MethodDefinition" && !node.static && node.kind !== "constructor";
        }

        /**
         * Check if the node is an instance method not excluded by config
         * @param {AST<"Node">} node - node to check
         * @returns {node is MethodDefinitionNotComputed} True if it is an instance method, and not excluded by config
         * @private
         */
        function isIncludedInstanceMethod(node) {
            return isInstanceMethod(node) &&
                !node.computed &&
                !exceptMethods.has(
                    node.key.type === "Identifier"
                        ? node.key.name
                        : String(node.key.value)
                );
        }

        /**
         * Checks if we are leaving a function that is a method, and reports if 'this' has not been used.
         * Static methods and the constructor are exempt.
         * Then pops the context off the stack.
         * @param {AST<"FunctionExpression"> | AST<"FunctionDeclaration">} node - A function node that was entered.
         * @returns {void}
         * @private
         */
        function exitFunction(node) {
            const methodUsesThis = stack.pop();

            if (isIncludedInstanceMethod(node.parent) && !methodUsesThis) {
                context.report({
                    node,
                    messageId: "missingThis",
                    data: {
                        name: node.parent.key.type === "Identifier"
                            ? node.parent.key.name
                            : String(node.parent.key.value)
                    }
                });
            }
        }

        /**
         * Mark the current context as having used 'this'.
         * @returns {void}
         * @private
         */
        function markThisUsed() {
            if (stack.length) {
                stack[stack.length - 1] = true;
            }
        }

        return {
            FunctionDeclaration: enterFunction,
            "FunctionDeclaration:exit": exitFunction,
            FunctionExpression: enterFunction,
            "FunctionExpression:exit": exitFunction,
            ThisExpression: markThisUsed,
            Super: markThisUsed
        };
    }
});
