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
function isMemberUpdate(id) {
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
            )
        )
    );
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

                    for (const reference of variable.references) {
                        const idNode = reference.identifier;

                        if (reference.isWrite()) {
                            context.report({
                                node: idNode.parent,
                                messageId: "readonly",
                                data: { name: idNode.name }
                            });
                        } else if (shouldCheckMembers && isMemberUpdate(idNode)) {
                            context.report({
                                node: idNode.parent.parent,
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
