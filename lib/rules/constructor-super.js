/**
 * @fileoverview A rule to verify `super()` callings in constructor.
 * @author Toru Nagashima
 */
"use strict";

const { rule } = require("./utils/rule");

/**
 * @template T
 * @typedef {import("./utils/rule").AST<T>} AST
 */

/** @typedef {import("./utils/rule").AST<"MethodDefinition", { kind: "constructor" }>} MethodDefinitionConstructor */
/** @typedef {import("./utils/rule").CodePath} CodePath */
/** @typedef {import("./utils/rule").CodePathSegment} CodePathSegment */

/**
 * @typedef {Object} FunctionInfo
 * @property {FunctionInfo | null} upper Information of the upper function.
 * @property {boolean} isConstructor `true` if the function was a constructor.
 * @property {boolean} hasExtends `true` if the class has `extends` part.
 * @property {boolean} superIsConstructor `true` if the `extends` part was a constructor.
 * @property {CodePath} codePath The code path object of the constructor.
 */

/**
 * @typedef {Object} SegmentInfo
 * @property {boolean} calledInSomePaths `true` if `super()` was called in one or more paths.
 * @property {boolean} calledInEveryPaths `true` if `super()` was called in all paths.
 * @property {AST<"CallExpression">[]} validNodes The valid `super()` nodes, but can be invalid if the code path was looped.
 */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks whether a given code path segment is reachable or not.
 *
 * @param {CodePathSegment} segment - A code path segment to check.
 * @returns {boolean} `true` if the segment is reachable.
 */
function isReachable(segment) {
    return segment.reachable;
}

/**
 * Checks whether or not a given node is a constructor.
 * @param {AST<"Node"> | null} node - A node to check.
 * @returns {node is MethodDefinitionConstructor} `true` if the node is a constructor.
 */
function isConstructor(node) {
    return (
        node !== null &&
        node.type === "MethodDefinition" &&
        node.kind === "constructor"
    );
}

/**
 * Checks whether a given node can be a constructor or not.
 * @param {AST<"Node"> | null} node - A node to check.
 * @returns {boolean} `true` if the node can be a constructor.
 */
function isPossibleConstructor(node) {
    if (!node) {
        return false;
    }

    switch (node.type) {
        case "ClassExpression":
        case "FunctionExpression":
        case "ThisExpression":
        case "MemberExpression":
        case "CallExpression":
        case "NewExpression":
        case "YieldExpression":
        case "TaggedTemplateExpression":
        case "MetaProperty":
            return true;

        case "Identifier":
            return node.name !== "undefined";

        case "AssignmentExpression":
            return isPossibleConstructor(node.right);

        case "LogicalExpression":
            return (
                isPossibleConstructor(node.left) ||
                isPossibleConstructor(node.right)
            );

        case "ConditionalExpression":
            return (
                isPossibleConstructor(node.alternate) ||
                isPossibleConstructor(node.consequent)
            );

        case "SequenceExpression": {
            const lastExpression = node.expressions[node.expressions.length - 1];

            return isPossibleConstructor(lastExpression);
        }

        default:
            return false;
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = rule({
    meta: {
        type: "problem",

        docs: {
            description: "require `super()` calls in constructors",
            category: "ECMAScript 6",
            recommended: true,
            url: "https://eslint.org/docs/rules/constructor-super"
        },

        schema: [],

        messages: {
            missingSome: "Lacked a call of 'super()' in some code paths.",
            missingAll: "Expected to call 'super()'.",

            duplicate: "Unexpected duplicate 'super()'.",
            badSuper: "Unexpected 'super()' because 'super' is not a constructor.",
            unexpected: "Unexpected 'super()'."
        }
    },

    create(context) {

        /** @type {FunctionInfo | null} */
        let funcInfo = null;

        /** @type {Record<string, SegmentInfo>} */
        let segInfoMap = Object.create(null);

        /**
         * Gets the flag which shows `super()` is called in some paths.
         * @param {CodePathSegment} segment - A code path segment to get.
         * @returns {boolean} The flag which shows `super()` is called in some paths
         */
        function isCalledInSomePath(segment) {
            return segment.reachable && segInfoMap[segment.id].calledInSomePaths;
        }

        /**
         * Gets the flag which shows `super()` is called in all paths.
         * @param {CodePathSegment} segment - A code path segment to get.
         * @returns {boolean} The flag which shows `super()` is called in all paths.
         */
        function isCalledInEveryPath(segment) {

            /*
             * If specific segment is the looped segment of the current segment,
             * skip the segment.
             * If not skipped, this never becomes true after a loop.
             */
            if (segment.nextSegments.length === 1 &&
                segment.nextSegments[0].isLoopedPrevSegment(segment)
            ) {
                return true;
            }
            return segment.reachable && segInfoMap[segment.id].calledInEveryPaths;
        }

        return {

            /**
             * Stacks a constructor information.
             * @param {CodePath} codePath - A code path which was started.
             * @param {AST<"Node">} node - The current node.
             * @returns {void}
             */
            onCodePathStart(codePath, node) {
                if (isConstructor(node.parent)) {

                    // Class > ClassBody > MethodDefinition > FunctionExpression
                    const classNode = node.parent.parent.parent;
                    const superClass = classNode.superClass;

                    funcInfo = {
                        upper: funcInfo,
                        isConstructor: true,
                        hasExtends: Boolean(superClass),
                        superIsConstructor: isPossibleConstructor(superClass),
                        codePath
                    };
                } else {
                    funcInfo = {
                        upper: funcInfo,
                        isConstructor: false,
                        hasExtends: false,
                        superIsConstructor: false,
                        codePath
                    };
                }
            },

            /**
             * Pops a constructor information.
             * And reports if `super()` lacked.
             * @param {CodePath} codePath - A code path which was ended.
             * @param {AST<"Node">} node - The current node.
             * @returns {void}
             */
            onCodePathEnd(codePath, node) {
                if (!funcInfo) {
                    return;
                }

                const hasExtends = funcInfo.hasExtends;

                // Pop.
                funcInfo = funcInfo.upper;

                if (!hasExtends) {
                    return;
                }

                // Reports if `super()` lacked.
                const segments = codePath.returnedSegments;
                const calledInEveryPaths = segments.every(isCalledInEveryPath);
                const calledInSomePaths = segments.some(isCalledInSomePath);

                if (!calledInEveryPaths) {
                    context.report({
                        messageId: calledInSomePaths
                            ? "missingSome"
                            : "missingAll",
                        node: node.parent || node
                    });
                }
            },

            /**
             * Initialize information of a given code path segment.
             * @param {CodePathSegment} segment - A code path segment to initialize.
             * @returns {void}
             */
            onCodePathSegmentStart(segment) {
                if (!(funcInfo && funcInfo.isConstructor && funcInfo.hasExtends)) {
                    return;
                }

                // Initialize info.
                /** @type {SegmentInfo} */
                const info = segInfoMap[segment.id] = {
                    calledInSomePaths: false,
                    calledInEveryPaths: false,
                    validNodes: []
                };

                // When there are previous segments, aggregates these.
                const prevSegments = segment.prevSegments;

                if (prevSegments.length > 0) {
                    info.calledInSomePaths = prevSegments.some(isCalledInSomePath);
                    info.calledInEveryPaths = prevSegments.every(isCalledInEveryPath);
                }
            },

            /**
             * Update information of the code path segment when a code path was
             * looped.
             * @param {CodePathSegment} fromSegment - The code path segment of the
             *      end of a loop.
             * @param {CodePathSegment} toSegment - A code path segment of the head
             *      of a loop.
             * @returns {void}
             */
            onCodePathSegmentLoop(fromSegment, toSegment) {
                if (!(funcInfo && funcInfo.isConstructor && funcInfo.hasExtends)) {
                    return;
                }

                // Update information inside of the loop.
                const isRealLoop = toSegment.prevSegments.length >= 2;

                funcInfo.codePath.traverseSegments(
                    { first: toSegment, last: fromSegment },
                    segment => {
                        const info = segInfoMap[segment.id];
                        const prevSegments = segment.prevSegments;

                        // Updates flags.
                        info.calledInSomePaths = prevSegments.some(isCalledInSomePath);
                        info.calledInEveryPaths = prevSegments.every(isCalledInEveryPath);

                        // If flags become true anew, reports the valid nodes.
                        if (info.calledInSomePaths || isRealLoop) {
                            const nodes = info.validNodes;

                            info.validNodes = [];

                            for (let i = 0; i < nodes.length; ++i) {
                                const node = nodes[i];

                                context.report({
                                    messageId: "duplicate",
                                    node
                                });
                            }
                        }
                    }
                );
            },

            /**
             * Checks for a call of `super()`.
             * @param {AST<"CallExpression">} node - A CallExpression node to check.
             * @returns {void}
             */
            "CallExpression:exit"(node) {
                if (!(funcInfo && funcInfo.isConstructor)) {
                    return;
                }

                // Skips except `super()`.
                if (node.callee.type !== "Super") {
                    return;
                }

                // Reports if needed.
                if (funcInfo.hasExtends) {
                    const segments = funcInfo.codePath.currentSegments;
                    let duplicate = false;
                    let info = null;

                    for (let i = 0; i < segments.length; ++i) {
                        const segment = segments[i];

                        if (segment.reachable) {
                            info = segInfoMap[segment.id];

                            duplicate = duplicate || info.calledInSomePaths;
                            info.calledInSomePaths = info.calledInEveryPaths = true;
                        }
                    }

                    if (info) {
                        if (duplicate) {
                            context.report({
                                messageId: "duplicate",
                                node
                            });
                        } else if (!funcInfo.superIsConstructor) {
                            context.report({
                                messageId: "badSuper",
                                node
                            });
                        } else {
                            info.validNodes.push(node);
                        }
                    }
                } else if (funcInfo.codePath.currentSegments.some(isReachable)) {
                    context.report({
                        messageId: "unexpected",
                        node
                    });
                }
            },

            /**
             * Set the mark to the returned path as `super()` was called.
             * @param {AST<"ReturnStatement">} node - A ReturnStatement node to check.
             * @returns {void}
             */
            ReturnStatement(node) {
                if (!(funcInfo && funcInfo.isConstructor && funcInfo.hasExtends)) {
                    return;
                }

                // Skips if no argument.
                if (!node.argument) {
                    return;
                }

                // Returning argument is a substitute of 'super()'.
                const segments = funcInfo.codePath.currentSegments;

                for (let i = 0; i < segments.length; ++i) {
                    const segment = segments[i];

                    if (segment.reachable) {
                        const info = segInfoMap[segment.id];

                        info.calledInSomePaths = info.calledInEveryPaths = true;
                    }
                }
            },

            /**
             * Resets state.
             * @returns {void}
             */
            "Program:exit"() {
                segInfoMap = Object.create(null);
            }
        };
    }
});
