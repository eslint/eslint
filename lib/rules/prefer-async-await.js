/**
 * @fileoverview Rule to require using `async`/`await` syntax instead of Promise methods
 * @author Milos Djermanovic
 */
"use strict";

const astUtils = require("./utils/ast-utils");

const PROMISE_METHOD_NAMES = new Set(["then", "catch", "finally"]);
const ACCESSOR_KINDS = new Set(["get", "set"]);
const ACCESSOR_TYPES = new Set(["Property", "MethodDefinition"]);
const EXPRESSION_STOP_NODES = /(?:Statement|Declaration|Function(?:Expression)?|Program)$/u;

/**
 * Checks whether the given name matches with any of the standard Promise.prototype method names.
 * @param {string} name Name to check.
 * @returns {boolean} True if the given name is a Promise method name.
 */
function isPromiseMethodName(name) {
    return PROMISE_METHOD_NAMES.has(name);
}

/**
 * Checks whether the given node is used as an accesssor value.
 * @param {Node} node Node to check.
 * @returns {boolean} True if the node is used as an accessor value.
 */
function isAccessorValue(node) {
    const parent = node.parent;

    return parent && ACCESSOR_TYPES.has(parent.type) && parent.value === node &&
        ACCESSOR_KINDS.has(parent.kind);
}

/**
 * Checks whether the given node is in any of the given expression types.
 * @param {Node} node Node to check.
 * @param {Set} types Set containing expression types.
 * @returns {boolean} True if the node is in one of the given expression types.
 */
function isInExpressionType(node, types) {

    if (!types.size) {
        return false;
    }

    let ancestor = node.parent;

    while (ancestor && !EXPRESSION_STOP_NODES.test(ancestor.type)) {
        if (types.has(ancestor.type)) {
            return true;
        }
        ancestor = ancestor.parent;
    }

    return false;
}

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "require using `async`/`await` syntax instead of Promise prototype methods",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-async-await"
        },

        fixable: null,
        schema: [{
            type: "object",
            properties: {
                atTopLevel: {
                    type: "boolean",
                    default: true
                },
                inGetOrSet: {
                    type: "boolean",
                    default: true
                },
                inAwaitExpressions: {
                    type: "boolean",
                    default: true
                },
                inYieldExpressions: {
                    type: "boolean",
                    default: true
                }
            },
            additionalProperties: false
        }],

        messages: {
            promiseMethodCall: "Use async/await syntax instead of .{{name}}() method."
        }
    },

    create(context) {

        const shouldReportTopLevel = !(context.options[0] && context.options[0].atTopLevel === false);
        const shouldReportGetOrSet = !(context.options[0] && context.options[0].inGetOrSet === false);
        const allowedExpressionTypes = new Set();

        if (context.options[0] && context.options[0].inAwaitExpressions === false) {
            allowedExpressionTypes.add("AwaitExpression");
        }

        if (context.options[0] && context.options[0].inYieldExpressions === false) {
            allowedExpressionTypes.add("YieldExpression");
        }

        /**
         * Checks whether the given node is in a context where promise method calls are forbidden,
         * depending on the configuration.
         * @param {Node} node Node to check.
         * @returns {boolean} True if the given node is in a forbidden context.
         */
        function isInForbiddenContext(node) {

            if (isInExpressionType(node, allowedExpressionTypes)) {
                return false;
            }

            if (shouldReportTopLevel && shouldReportGetOrSet) {

                // forbidden everywhere
                return true;
            }

            const upperFunction = astUtils.getUpperFunction(node);

            if (upperFunction) {
                if (shouldReportGetOrSet) {
                    return true;
                }

                return !isAccessorValue(upperFunction);
            }

            // top level
            return shouldReportTopLevel;
        }

        /**
         * Reports the given node.
         *
         * @param {Node} node CallExpression node
         * @returns {void}
         */
        function report(node) {
            context.report({
                node,
                data: node.callee.property,
                messageId: "promiseMethodCall"
            });
        }

        return {
            CallExpression(node) {
                const { callee } = node;

                if (callee && callee.type === "MemberExpression" && !callee.computed &&
                    callee.property.type === "Identifier") {
                    const methodName = callee.property.name;

                    if (isPromiseMethodName(methodName) && isInForbiddenContext(node)) {
                        report(node);
                    }
                }
            }
        };
    }
};
