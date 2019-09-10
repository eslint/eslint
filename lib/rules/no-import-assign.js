/**
 * @fileoverview Rule to flag updates of imported bindings.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Check if the identifier node is placed at to update members.
 * @param {ASTNode} id The Identifier node to check.
 * @returns {boolean} `true` if the member of `id` was updated.
 */
function isMemberWrite(id) {
    const parent = id.parent;
    const grandparent = parent.parent;

    return (
        parent.type === "MemberExpression" &&
        parent.object === id &&
        (
            (
                grandparent.type === "AssignmentExpression" &&
                grandparent.left === parent
            ) ||
            (
                grandparent.type === "UpdateExpression" &&
                grandparent.argument === parent
            ) ||
            (
                grandparent.type === "UnaryExpression" &&
                grandparent.operator === "delete" &&
                grandparent.argument === parent
            ) ||
            grandparent.type === "ArrayPattern" ||
            (
                grandparent.type === "Property" &&
                grandparent.value === parent &&
                grandparent.parent.type === "ObjectPattern"
            ) ||
            grandparent.type === "RestElement" ||
            (
                grandparent.type === "AssignmentPattern" &&
                grandparent.left === parent
            ) ||
            (
                grandparent.type === "ForInStatement" &&
                grandparent.left === parent
            ) ||
            (
                grandparent.type === "ForOfStatement" &&
                grandparent.left === parent
            )
        )
    );
}

/**
 * Get the mutation node.
 * @param {ASTNode} id The Identifier node to get.
 * @returns {ASTNode} The mutation node.
 */
function getWriteNode(id) {
    let node = id.parent;

    while (
        node &&
        node.type !== "AssignmentExpression" &&
        node.type !== "UpdateExpression" &&
        !(node.type === "UnaryExpression" && node.operator === "delete") &&
        node.type !== "ForInStatement" &&
        node.type !== "ForOfStatement"
    ) {
        node = node.parent;
    }

    return node || id;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow assigning to imported bindings",
            category: "Possible Errors",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-import-assign"
        },

        schema: [],

        messages: {
            readonly: "'{{name}}' is read-only.",
            readonlyMember: "The members of '{{name}}' are read-only."
        }
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                for (const variable of context.getDeclaredVariables(node)) {
                    const shouldCheckMembers = variable.defs.some(
                        d => d.node.type === "ImportNamespaceSpecifier"
                    );
                    let prevIdNode = null;

                    for (const reference of variable.references) {
                        const idNode = reference.identifier;

                        /*
                         * AssignmentPattern (e.g. `[a = 0] = b`) makes two write
                         * references for the same identifier. This should skip
                         * the one of the two in order to prevent redundant reports.
                         */
                        if (idNode === prevIdNode) {
                            continue;
                        }
                        prevIdNode = idNode;

                        if (reference.isWrite()) {
                            context.report({
                                node: getWriteNode(idNode),
                                messageId: "readonly",
                                data: { name: idNode.name }
                            });
                        } else if (shouldCheckMembers && isMemberWrite(idNode)) {
                            context.report({
                                node: getWriteNode(idNode),
                                messageId: "readonlyMember",
                                data: { name: idNode.name }
                            });
                        }
                    }
                }
            }
        };

    }
};
