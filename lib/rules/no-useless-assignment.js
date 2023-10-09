/**
 * @fileoverview A rule to disallow unnecessary assignments`.
 * @author Yosuke Ota
 */

"use strict";

const { findVariable } = require("@eslint-community/eslint-utils");

//------------------------------------------------------------------------------
// Types
//------------------------------------------------------------------------------

/** @typedef {import("estree").Node} ASTNode */
/** @typedef {import("estree").Pattern} Pattern */
/** @typedef {import("estree").Identifier} Identifier */
/** @typedef {import("eslint-scope").Scope} Scope */
/** @typedef {import("eslint-scope").Variable} Variable */
/** @typedef {import("../linter/code-path-analysis/code-path")} CodePath */
/** @typedef {import("../linter/code-path-analysis/code-path-segment")} CodePathSegment */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Extract identifier from the given pattern node used on the left-hand side of the assignment.
 * @param {Pattern|null} pattern The pattern node to extract identifier
 * @returns {Iterable<Identifier>} The extracted identifier
 */
function *extractIdentifiersFromPattern(pattern) {
    switch (pattern.type) {
        case "Identifier":
            yield pattern;
            return;
        case "ObjectPattern":
            for (const property of pattern.properties) {
                yield* extractIdentifiersFromPattern(property.type === "Property" ? property.value : property);
            }
            return;
        case "ArrayPattern":
            for (const element of pattern.elements) {
                if (!element) {
                    continue;
                }
                yield* extractIdentifiersFromPattern(element);
            }
            return;
        case "RestElement":
            yield* extractIdentifiersFromPattern(pattern.argument);
            return;
        case "AssignmentPattern":
            yield* extractIdentifiersFromPattern(pattern.left);

        // no default
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "Disallow variables that are not used after assignment",
            recommended: false,
            url: "https://eslint.org/docs/latest/rules/no-useless-assignment"
        },

        schema: [],

        messages: {
            unnecessaryAssignment: "This assigned value is not used in subsequent statements."
        }
    },

    create(context) {
        const sourceCode = context.sourceCode;

        /**
         * @typedef {Object} ScopeStack
         * @property {CodePath} codePath The code path of this scope stack.
         * @property {Scope} scope The scope of this scope stack.
         * @property {ScopeStack} upper The upper scope stack.
         * @property {Record<string, ScopeStackSegmentInfo>} segments Map of ScopeStackSegmentInfo.
         * @property {ScopeStackSegmentInfo[]} currentSegments The current ScopeStackSegmentInfo.
         */
        /**
         * @typedef {Object} ScopeStackSegmentInfo
         * @property {Map<Variable, Identifier>} writes Map of collection of wrote variables.
         * @property {Identifier|null} first The first identifier that appears within the segment.
         * @property {Identifier|null} last The last identifier that appears within the segment.
         *
         * `first` and `last` are used to determine whether an identifier exists within the segment position range.
         * Since it is used as a range of segments, we should originally hold all nodes, not just identifiers,
         * but since the only nodes to be judged are identifiers, it is sufficient to have a range of identifiers.
         */
        /** @type {ScopeStack} */
        let scopeStack = null;

        /** @type {Set<Scope>} */
        const codePathStartScopes = new Set();

        /**
         * Gets the scope of code path start from given scope
         * @param {Scope} scope The initial scope
         * @returns {Scope} The scope of code path start
         * @throws {Error} Unexpected error
         */
        function getCodePathStartScope(scope) {
            let target = scope;

            while (target) {
                if (codePathStartScopes.has(target)) {
                    return target;
                }
                target = target.upper;
            }
            throw new Error("Should be unreachable");
        }

        /**
         * Verify the given scope stack.
         * @param {ScopeStack} target The scope stack to verify.
         * @returns {void}
         */
        function verify(target) {

            /**
             * Checks whether the given identifier is used in the segment.
             * @param {CodePathSegment} segment The code path segment.
             * @param {Identifier} identifier The identifier to check.
             * @returns {boolean} `true` if the identifier is used in the segment.
             */
            function isInSegment(segment, identifier) {
                const segmentInfo = target.segments[segment.id];

                return (
                    segmentInfo.first &&
                    segmentInfo.last &&
                    segmentInfo.first.range[0] <= identifier.range[0] &&
                    identifier.range[1] <= segmentInfo.last.range[1]
                );
            }

            /**
             * Verify the given write variable.
             * @param {CodePathSegment} segment The current code path segment.
             * @param {Variable} variable The write variable to verify.
             * @param {Identifier} identifier The written identifier.
             * @returns {void}
             */
            function verifyWrittenVariable(segment, variable, identifier) {

                const subsequentSegmentData = {
                    subsequentSegments: new Set(),
                    queueSegments: [...segment.nextSegments]
                };


                /**
                 * Gets the subsequent segments from the current segment.
                 * @returns {Iterable<CodePathSegment>} the subsequent segments
                 */
                function *getSubsequentSegments() {
                    yield* subsequentSegmentData.subsequentSegments;

                    while (subsequentSegmentData.queueSegments.length > 0) {
                        const nextSegment = subsequentSegmentData.queueSegments.shift();

                        if (subsequentSegmentData.subsequentSegments.has(nextSegment)) {
                            continue;
                        }
                        subsequentSegmentData.subsequentSegments.add(nextSegment);
                        subsequentSegmentData.queueSegments.push(...nextSegment.nextSegments);
                        yield nextSegment;
                    }
                }

                /*
                 * If the scope of the variable is outside the current code path scope,
                 * we cannot track whether this assignment is not used.
                 */
                if (target.scope !== getCodePathStartScope(variable.scope)) {
                    return;
                }

                // Variables exported by "exported" block comments
                if (variable.eslintExported) {
                    return;
                }

                // Variables exported by ESM export syntax
                if (
                    variable.scope.type === "module" &&
                        variable.defs
                            .some(def => (
                                (def.type === "Variable" && def.parent.parent.type === "ExportNamedDeclaration") ||
                                (
                                    def.type === "FunctionName" &&
                                    (
                                        def.node.parent.type === "ExportNamedDeclaration" ||
                                        def.node.parent.type === "ExportDefaultDeclaration"
                                    )
                                ) ||
                                (
                                    def.type === "ClassName" &&
                                    (
                                        def.node.parent.type === "ExportNamedDeclaration" ||
                                        def.node.parent.type === "ExportDefaultDeclaration"
                                    )
                                )
                            ))
                ) {
                    return;
                }

                for (const reference of variable.references) {
                    if (!reference.isRead()) {
                        continue;
                    }

                    if (reference.identifier.parent.type === "ExportSpecifier") {

                        // `export { ... }` reference. All assignments are used externally.
                        return;
                    }

                    /*
                     * If the scope of the reference is outside the current code path scope,
                     * we cannot track whether this assignment is not used.
                     * For example, it can also be called asynchronously.
                     */
                    if (target.scope !== getCodePathStartScope(reference.from)) {
                        return;
                    }

                    if (identifier.range[0] < reference.identifier.range[0] && isInSegment(segment, reference.identifier)) {

                        // Uses in statements after the written identifier.
                        return;
                    }

                    // Check subsequent segments.
                    for (const subsequentSegment of getSubsequentSegments()) {
                        if (isInSegment(subsequentSegment, reference.identifier)) {

                            // It is used
                            return;
                        }
                    }
                }
                context.report({
                    node: identifier,
                    messageId: "unnecessaryAssignment"
                });
            }

            target.codePath.traverseSegments(segment => {
                const segmentInfo = target.segments[segment.id];

                for (const [variable, identifier] of segmentInfo.writes) {
                    verifyWrittenVariable(segment, variable, identifier);
                }
            });
        }

        return {
            onCodePathStart(codePath, node) {
                const scope = sourceCode.getScope(node);

                scopeStack = {
                    upper: scopeStack,
                    codePath,
                    scope,
                    segments: Object.create(null),
                    currentSegments: []
                };
                codePathStartScopes.add(scopeStack.scope);
            },
            onCodePathEnd() {
                verify(scopeStack);

                scopeStack = scopeStack.upper;
            },
            onCodePathSegmentStart(segment) {
                const segmentInfo = { writes: new Map(), first: null, last: null };

                scopeStack.segments[segment.id] = segmentInfo;
                scopeStack.currentSegments.unshift(segmentInfo);
            },
            onUnreachableCodePathSegmentStart(segment) {
                const segmentInfo = { writes: new Map(), first: null, last: null };

                scopeStack.segments[segment.id] = segmentInfo;
                scopeStack.currentSegments.unshift(segmentInfo);
            },
            onCodePathSegmentEnd() {
                scopeStack.currentSegments.shift();
            },
            onUnreachableCodePathSegmentEnd() {
                scopeStack.currentSegments.shift();
            },
            Identifier(node) {
                const segmentInfo = scopeStack.currentSegments[0];

                if (!segmentInfo.first) {
                    segmentInfo.first = node;
                }
                segmentInfo.last = node;
            },
            "AssignmentExpression, UpdateExpression"(node) {
                const segmentInfo = scopeStack.currentSegments[0];

                const pattern = node.type === "AssignmentExpression" ? node.left : node.argument;

                for (const identifier of extractIdentifiersFromPattern(pattern)) {
                    const scope = sourceCode.getScope(identifier);

                    /** @type {Variable} */
                    const variable = findVariable(scope, identifier);

                    if (!variable) {
                        return;
                    }
                    segmentInfo.writes.set(variable, identifier);
                }
            }
        };
    }
};
