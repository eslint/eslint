/**
 * @fileoverview A rule to suggest using of const declaration for variables that are never reassigned after declared.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const PATTERN_TYPE = /^(?:.+?Pattern|RestElement|SpreadProperty|ExperimentalRestProperty|Property)$/;
const DECLARATION_HOST_TYPE = /^(?:Program|BlockStatement|SwitchCase)$/;
const DESTRUCTURING_HOST_TYPE = /^(?:VariableDeclarator|AssignmentExpression)$/;

/**
 * Adds multiple items to the tail of an array.
 *
 * @param {any[]} array - A destination to add.
 * @param {any[]} values - Items to be added.
 * @returns {void}
 */
const pushAll = Function.apply.bind(Array.prototype.push);

/**
 * Checks whether a given node is located at `ForStatement.init` or not.
 *
 * @param {ASTNode} node - A node to check.
 * @returns {boolean} `true` if the node is located at `ForStatement.init`.
 */
function isInitOfForStatement(node) {
    return node.parent.type === "ForStatement" && node.parent.init === node;
}

/**
 * Checks whether a given Identifier node becomes a VariableDeclaration or not.
 *
 * @param {ASTNode} identifier - An Identifier node to check.
 * @returns {boolean} `true` if the node can become a VariableDeclaration.
 */
function canBecomeVariableDeclaration(identifier) {
    let node = identifier.parent;

    while (PATTERN_TYPE.test(node.type)) {
        node = node.parent;
    }

    return (
        node.type === "VariableDeclarator" ||
        (
            node.type === "AssignmentExpression" &&
            node.parent.type === "ExpressionStatement" &&
            DECLARATION_HOST_TYPE.test(node.parent.parent.type)
        )
    );
}

/**
 * Gets an identifier node of a given variable.
 *
 * If the initialization exists or one or more reading references exist before
 * the first assignment, the identifier node is the node of the declaration.
 * Otherwise, the identifier node is the node of the first assignment.
 *
 * If the variable should not change to const, this function returns null.
 * - If the variable is reassigned.
 * - If the variable is never initialized nor assigned.
 * - If the variable is initialized in a different scope from the declaration.
 * - If the unique assignment of the variable cannot change to a declaration.
 *   e.g. `if (a) b = 1` / `return (b = 1)`
 * - If the variable is declared in the global scope and `eslintUsed` is `true`.
 *   `/*exported foo` directive comment makes such variables. This rule does not
 *   warn such variables because this rule cannot distinguish whether the
 *   exported variables are reassigned or not.
 *
 * @param {eslint-scope.Variable} variable - A variable to get.
 * @param {boolean} ignoreReadBeforeAssign -
 *      The value of `ignoreReadBeforeAssign` option.
 * @returns {ASTNode|null}
 *      An Identifier node if the variable should change to const.
 *      Otherwise, null.
 */
function getIdentifierIfShouldBeConst(variable, ignoreReadBeforeAssign) {
    if (variable.eslintUsed && variable.scope.type === "global") {
        return null;
    }

    // Finds the unique WriteReference.
    let writer = null;
    let isReadBeforeInit = false;
    const references = variable.references;

    for (let i = 0; i < references.length; ++i) {
        const reference = references[i];

        if (reference.isWrite()) {
            const isReassigned = (
                writer !== null &&
                writer.identifier !== reference.identifier
            );

            if (isReassigned) {
                return null;
            }
            writer = reference;

        } else if (reference.isRead() && writer === null) {
            if (ignoreReadBeforeAssign) {
                return null;
            }
            isReadBeforeInit = true;
        }
    }

    /*
     * If the assignment is from a different scope, ignore it.
     * If the assignment cannot change to a declaration, ignore it.
     */
    const shouldBeConst = (
        writer !== null &&
        writer.from === variable.scope &&
        canBecomeVariableDeclaration(writer.identifier)
    );

    if (!shouldBeConst) {
        return null;
    }
    if (isReadBeforeInit) {
        return variable.defs[0].name;
    }

    return writer.identifier;
}

/**
 * Gets the VariableDeclarator/AssignmentExpression node that a given reference
 * belongs to.
 * This is used to detect a mix of reassigned and never reassigned in a
 * destructuring.
 *
 * @param {eslint-scope.Reference} reference - A reference to get.
 * @returns {ASTNode|null} A VariableDeclarator/AssignmentExpression node or
 *      null.
 */
function getDestructuringHost(reference) {
    if (!reference.isWrite()) {
        return null;
    }
    let node = reference.identifier.parent;

    while (PATTERN_TYPE.test(node.type)) {
        node = node.parent;
    }

    if (!DESTRUCTURING_HOST_TYPE.test(node.type)) {
        return null;
    }
    return node;
}

/**
 * Groups by the VariableDeclarator/AssignmentExpression node that each
 * reference of given variables belongs to.
 * This is used to detect a mix of reassigned and never reassigned in a
 * destructuring.
 *
 * @param {eslint-scope.Variable[]} variables - Variables to group by destructuring.
 * @param {boolean} ignoreReadBeforeAssign -
 *      The value of `ignoreReadBeforeAssign` option.
 * @returns {Map<ASTNode, ASTNode[]>} Grouped identifier nodes.
 */
function groupByDestructuring(variables, ignoreReadBeforeAssign) {
    const identifierMap = new Map();

    for (let i = 0; i < variables.length; ++i) {
        const variable = variables[i];
        const references = variable.references;
        const identifier = getIdentifierIfShouldBeConst(variable, ignoreReadBeforeAssign);

        let prevId = null;

        for (let j = 0; j < references.length; ++j) {
            const reference = references[j];
            const id = reference.identifier;

            /*
             * Avoid counting a reference twice or more for default values of
             * destructuring.
             */
            if (id === prevId) {
                continue;
            }
            prevId = id;

            // Add the identifier node into the destructuring group.
            const group = getDestructuringHost(reference);

            if (group) {
                if (identifierMap.has(group)) {
                    identifierMap.get(group).push(identifier);
                } else {
                    identifierMap.set(group, [identifier]);
                }
            }
        }
    }

    return identifierMap;
}

/**
 * Returns a list of nodes
 * that have have the type Identifier.
 * This will search for nested Identifiers.
 *
 * @param {ASTNode} node - node to search for children and nested identifiers.
 * @returns {ASTNode[]} list Identifier nodes.
 */
function getIdentifiersInArrayDestructureGroup(node) {
    const identifiers = [];

    if (node.elements) {
        const numberOfElements = node.elements.length;

        for (let i = 0; i < numberOfElements; i++) {
            if (!node.elements[i].elements && node.elements[i].type === "Identifier") {
                identifiers.push(node.elements[i]);
            } else {
                const innerIdentifiers = getIdentifiersInArrayDestructureGroup(node.elements[i]);

                innerIdentifiers.forEach(identifierNode => identifiers.push(identifierNode));
            }
        }
    }
    return identifiers;
}

/**
 * Returns a count of nodes
 * This will count nested nodes in nodes elements attribute.
 *
 * @param {ASTNode} node - node to count elements.
 * @returns {integer} count nodes.
 */
function countElementsInArrayDestructureGroup(node) {
    let count = 0;

    if (node.elements) {
        const numberOfElements = node.elements.length;

        for (let i = 0; i < numberOfElements; i++) {
            if (!node.elements[i].elements) {
                count += 1;
            } else {
                count += countElementsInArrayDestructureGroup(node.elements[i]);
            }
        }
    }
    return count;
}

/**
 * Returns a list of nodes
 * that have have the value type Identifier.
 * This will search for nested Identifiers.
 *
 * @param {ASTNode} node - node to search properties that have value Identifier.
 * @returns {ASTNode[]} list Identifier nodes.
 */
function getIdentifiersInObjectDestructureGroup(node) {
    const identifier = [];
    const propertiesLength = node.properties.length;

    for (let i = 0; i < propertiesLength; i++) {
        if (node.properties[i].value.type === "Identifier") {
            identifier.push(node.properties[i].value);
        }
    }
    return identifier;
}

/**
 * Returns a count of nodes
 * This will count the node properties length
 *
 * @param {ASTNode} node - node to count properties.
 * @returns {integer} count properties length.
 */
function countElementsInObjectDestructureGroup(node) {
    return node.properties.length;
}

/**
 * Checks to see if there are less identifier nodes in a destructure group
 * than the number of terms in the group. It might mean that there
 * is a term in the group that cannot be converted to const.
 * We want to make sure all terms can be reported
 * If not, we should remove the terms that would be reported in "any" case
 *
 * @param {Map<ASTNode, ASTNode[]>} identifierMap - Variables to group by destructuring.
 * @param {boolean} checkingMixedDestructuring - boolean to check if any value in destructuring
 *      should use const
 * @param {integer|null} destructureCount count of destructure terms.
 * @param {ASTNode[]|null} destructureIdentifier list of Identifier nodes to check 
 *      in IdentifierMap
 * @returns {Map<ASTNode, ASTNode[]>} Grouped identifier nodes.
 */
function verifyAllDestructuring(identifierMap, checkingMixedDestructuring, destructureCount, destructureIdentifier) {
    if (checkingMixedDestructuring) {
        return identifierMap;
    }
    if (destructureCount === null && destructureIdentifier === null) {
        return identifierMap;
    }
    if (destructureIdentifier.length < destructureCount) {
        for (const key of identifierMap.keys()) {
            const destructureGroup = identifierMap.get(key);
            const destructureElement = destructureGroup[0];

            if (destructureIdentifier !== null) {
                for (let i = 0; i < destructureIdentifier.length; i++) {
                    if (destructureIdentifier[i] === destructureElement) {
                        identifierMap.delete(key);
                    }
                }
            }
        }
    }

    return identifierMap;
}

/**
 * Finds the nearest parent of node with a given type.
 *
 * @param {ASTNode} node – The node to search from.
 * @param {string} type – The type field of the parent node.
 * @param {Function} shouldStop – a predicate that returns true if the traversal should stop, and false otherwise.
 * @returns {ASTNode} The closest ancestor with the specified type; null if no such ancestor exists.
 */
function findUp(node, type, shouldStop) {
    if (!node || shouldStop(node)) {
        return null;
    }
    if (node.type === type) {
        return node;
    }
    return findUp(node.parent, type, shouldStop);
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require `const` declarations for variables that are never reassigned after declared",
            category: "ECMAScript 6",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-const"
        },

        fixable: "code",

        schema: [
            {
                type: "object",
                properties: {
                    destructuring: { enum: ["any", "all"] },
                    ignoreReadBeforeAssign: { type: "boolean" }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {
        const options = context.options[0] || {};
        const sourceCode = context.getSourceCode();
        const checkingMixedDestructuring = options.destructuring !== "all";
        const ignoreReadBeforeAssign = options.ignoreReadBeforeAssign === true;
        const variables = [];
        let destructureCount = null;
        let destructureIdentifier = null;

        /**
         * Reports given identifier nodes if all of the nodes should be declared
         * as const.
         *
         * The argument 'nodes' is an array of Identifier nodes.
         * This node is the result of 'getIdentifierIfShouldBeConst()', so it's
         * nullable. In simple declaration or assignment cases, the length of
         * the array is 1. In destructuring cases, the length of the array can
         * be 2 or more.
         *
         * @param {(eslint-scope.Reference|null)[]} nodes -
         *      References which are grouped by destructuring to report.
         * @returns {void}
         */
        function checkGroup(nodes) {
            const nodesToReport = nodes.filter(Boolean);

            if (nodes.length && (checkingMixedDestructuring || nodesToReport.length === nodes.length)) {
                const varDeclParent = findUp(nodes[0], "VariableDeclaration", parentNode => parentNode.type.endsWith("Statement"));
                const shouldFix = varDeclParent &&

                    /*
                     * If there are multiple variable declarations, like {let a = 1, b = 2}, then
                     * do not attempt to fix if one of the declarations should be `const`. It's
                     * too hard to know how the developer would want to automatically resolve the issue.
                     */
                    varDeclParent.declarations.length === 1 &&

                    // Don't do a fix unless the variable is initialized (or it's in a for-in or for-of loop)
                    (varDeclParent.parent.type === "ForInStatement" || varDeclParent.parent.type === "ForOfStatement" || varDeclParent.declarations[0].init) &&

                    /*
                     * If options.destucturing is "all", then this warning will not occur unless
                     * every assignment in the destructuring should be const. In that case, it's safe
                     * to apply the fix.
                     */
                    nodesToReport.length === nodes.length;

                nodesToReport.forEach(node => {
                    context.report({
                        node,
                        message: "'{{name}}' is never reassigned. Use 'const' instead.",
                        data: node,
                        fix: shouldFix ? fixer => fixer.replaceText(sourceCode.getFirstToken(varDeclParent), "const") : null
                    });
                });
            }
        }

        return {
            "Program:exit"() {
                const identifierMap = groupByDestructuring(variables, ignoreReadBeforeAssign);

                verifyAllDestructuring(identifierMap, checkingMixedDestructuring, destructureCount, destructureIdentifier).forEach(checkGroup);
            },
            "ExpressionStatement[expression.left.type = /ArrayPattern|ObjectPattern/]"(node) {
                if (node.expression.left.type === "ArrayPattern") {
                    destructureIdentifier = getIdentifiersInArrayDestructureGroup(node.expression.left);
                    destructureCount = countElementsInArrayDestructureGroup(node.expression.left);
                } else {
                    destructureIdentifier = getIdentifiersInObjectDestructureGroup(node.expression.left);
                    destructureCount = countElementsInObjectDestructureGroup(node.expression.left);
                }
            },

            VariableDeclaration(node) {
                if (node.kind === "let" && !isInitOfForStatement(node)) {
                    pushAll(variables, context.getDeclaredVariables(node));
                }
            }
        };
    }
};
