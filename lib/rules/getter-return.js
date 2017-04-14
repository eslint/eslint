/**
 * @fileoverview Enforces that a return statement is present in property getters.
 * @author Aladdin-ADD(hh_2013@foxmail.com)
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require("../ast-utils");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const TARGET_NODE_TYPE = /^(?:Arrow)?FunctionExpression$/;

/**
 * Checks a given code path segment is reachable.
 *
 * @param {CodePathSegment} segment - A segment to check.
 * @returns {boolean} `true` if the segment is reachable.
 */
function isReachable(segment) {
    return segment.reachable;
}

/**
 * Gets a readable location.
 *
 * - FunctionExpression -> the function name or `function` keyword.
 * - ArrowFunctionExpression -> `=>` token.
 *
 * @param {ASTNode} node - A function node to get.
 * @param {SourceCode} sourceCode - A source code to get tokens.
 * @returns {ASTNode|Token} The node or the token of a location.
 */
function getLocation(node, sourceCode) {
    if (node.type === "ArrowFunctionExpression") {
        return sourceCode.getTokenBefore(node.body);
    }
    return node.id || node;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce `return` statements in getters",
            category: "Best Practices",
            recommended: false
        },

        schema: []
    },

    create(context) {
        let funcInfo = {
            upper: null,
            codePath: null,
            hasReturn: false,
            shouldCheck: false,
            node: null
        };

        /**
         * Checks whether or not the last code path segment is reachable.
         * Then reports this function if the segment is reachable.
         *
         * If the last code path segment is reachable, there are paths which are not
         * returned or thrown.
         *
         * @param {ASTNode} node - A node to check.
         * @returns {void}
         */
        function checkLastSegment(node) {
            if (funcInfo.shouldCheck &&
                funcInfo.codePath.currentSegments.some(isReachable)
            ) {
                context.report({
                    node,
                    loc: getLocation(node, context.getSourceCode()).loc.start,
                    message: funcInfo.hasReturn
                        ? "Expected to return a value at the end of {{name}}."
                        : "Expected to return a value in {{name}}.",
                    data: {
                        name: astUtils.getFunctionNameWithKind(funcInfo.node)
                    }
                });
            }
        }

        return {

            // Stacks this function's information.
            onCodePathStart(codePath, node) {
                funcInfo = {
                    upper: funcInfo,
                    codePath,
                    hasReturn: false,
                    shouldCheck:
                        TARGET_NODE_TYPE.test(node.type) &&
                        node.body.type === "BlockStatement" &&
                        node.parent.kind === "get" &&
                        !node.async &&
                        !node.generator,
                    node
                };
            },

            // Pops this function's information.
            onCodePathEnd() {
                funcInfo = funcInfo.upper;
            },

            // Checks the return statement is valid.
            ReturnStatement(node) {
                if (funcInfo.shouldCheck) {
                    funcInfo.hasReturn = true;

                    if (!node.argument) {
                        context.report({
                            node,
                            message: "Expected to return a value in {{name}}.",
                            data: {
                                name: astUtils.getFunctionNameWithKind(funcInfo.node)
                            }
                        });
                    }
                }
            },

            // Reports a given function if the last path is reachable.
            "FunctionExpression:exit": checkLastSegment,
            "ArrowFunctionExpression:exit": checkLastSegment
        };
    }
};
