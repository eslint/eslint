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
    if (!pattern) {
        return;
    }
    if (pattern.type === "Identifier") {
        yield pattern;
    }
    switch (pattern.type) {
        case "ObjectPattern":
            for (const property of pattern.properties) {
                yield* extractIdentifiersFromPattern(property.type === "Property" ? property.value : property.argument);
            }
            return;
        case "ArrayPattern":
            for (const element of pattern.elements) {
                yield* extractIdentifiersFromPattern(element);
            }
            return;
        case "RestElement":
            yield* extractIdentifiersFromPattern(pattern.argument);
            return;
        case "AssignmentPattern":
            yield* extractIdentifiersFromPattern(pattern.right);

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
         * @property {CodePathSegment[]} currentSegments The current code path segments.
         * @property {Record<string, Map<Variable, Identifier>>} writes Map of collection of wrote variables within segment ID.
         * @property {Record<string, Set<Identifier>>} segmentIdentifiers Map of collection of identifiers within segment ID.
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
                return target.segmentIdentifiers[segment.id].has(identifier);
            }

            /**
             * Verify the given write variable.
             * @param {CodePathSegment} segment The current code path segment.
             * @param {Variable} variable The write variable to verify.
             * @param {Identifier} identifier The written identifier.
             * @returns {void}
             */
            function verifyWrittenVariable(segment, variable, identifier) {

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
                                (def.type === "FunctionName" && def.node.parent.type === "ExportNamedDeclaration") ||
                                (def.type === "ClassName" && def.node.parent.type === "ExportNamedDeclaration")
                            ))
                ) {
                    return;
                }

                for (const reference of variable.references) {
                    if (!reference.isRead()) {
                        continue;
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
                    const alreadyChecked = new Set();
                    const queueSegments = [...segment.nextSegments];

                    while (queueSegments.length > 0) {
                        const nextSegment = queueSegments.shift();

                        if (alreadyChecked.has(nextSegment.id)) {
                            continue;
                        }
                        alreadyChecked.add(nextSegment.id);

                        if (isInSegment(nextSegment, reference.identifier)) {

                            // It is used
                            return;
                        }

                        queueSegments.push(...nextSegment.nextSegments);
                    }
                }
                context.report({
                    node: identifier,
                    messageId: "unnecessaryAssignment"
                });
            }

            target.codePath.traverseSegments(segment => {
                if (!target.writes[segment.id]) {
                    return;
                }
                for (const [variable, identifier] of target.writes[segment.id]) {
                    verifyWrittenVariable(segment, variable, identifier);
                }
            });
        }

        return {

            /**
             * Adds information of a constructor into the stack.
             * @param {CodePath} codePath A code path which was started.
             * @param {ASTNode} node The current node.
             * @returns {void}
             */
            onCodePathStart(codePath, node) {
                const scope = sourceCode.getScope(node);

                scopeStack = {
                    upper: scopeStack,
                    codePath,
                    scope,
                    currentSegments: [],
                    segmentIdentifiers: Object.create(null),
                    writes: Object.create(null)
                };
                codePathStartScopes.add(scopeStack.scope);
            },
            onCodePathEnd() {
                verify(scopeStack);

                scopeStack = scopeStack.upper;
            },
            onCodePathSegmentStart(segment) {
                scopeStack.currentSegments.unshift(segment);
                scopeStack.segmentIdentifiers[segment.id] = new Set();
            },
            onUnreachableCodePathSegmentStart(segment) {
                scopeStack.currentSegments.unshift(segment);
                scopeStack.segmentIdentifiers[segment.id] = new Set();
            },
            onCodePathSegmentEnd() {
                scopeStack.currentSegments.shift();
            },
            onUnreachableCodePathSegmentEnd() {
                scopeStack.currentSegments.shift();
            },
            Identifier(node) {
                const segmentId = scopeStack.currentSegments[0].id;

                scopeStack.segmentIdentifiers[segmentId].add(node);
            },
            "AssignmentExpression, UpdateExpression"(node) {
                const segmentId = scopeStack.currentSegments[0].id;
                const writes = scopeStack.writes[segmentId] || (scopeStack.writes[segmentId] = new Map());

                for (const identifier of extractIdentifiersFromPattern(node.left)) {
                    const scope = sourceCode.getScope(identifier);

                    /** @type {Variable} */
                    const variable = findVariable(scope, identifier);

                    if (!variable) {
                        return;
                    }
                    writes.set(variable, identifier);
                }
            }
        };
    }
};
