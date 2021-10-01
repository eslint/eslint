/**
 * @fileoverview Rule to flag declared but unused private class members
 * @author Tim van der Lippe
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow unused private class members",
            category: "Variables",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-unused-private-class-members"
        },

        schema: [],

        messages: {
            unusedPrivateClassMember: "'{{classMemberName}}' is defined but never used."
        }
    },

    create(context) {
        const stackOfCurrentlyProcessingClassNodes = [];

        /**
         * Check whether the current node is in a write only assignment.
         * @param {ASTNode} privateIdentifierNode Node referring to a private identifier
         * @param {boolean} isSetter Whether the property is declared as setter
         * @returns {boolean} Whether the node is in a write only assignment
         * @private
         */
        function isWriteOnlyAssignmentStatementWithoutPerformingAnyReads(privateIdentifierNode, isSetter) {
            const parentStatement = privateIdentifierNode.parent.parent;
            const isAssignmentExpression = parentStatement.type === "AssignmentExpression";

            if (!isAssignmentExpression &&
                parentStatement.type !== "ForInStatement" &&
                parentStatement.type !== "ForOfStatement" &&
                parentStatement.type !== "AssignmentPattern") {
                return false;
            }

            /*
             * Any assignment that writes to a setter is considered a read, as the setter can have
             * side-effects in its definition.
             */
            if (isSetter) {
                return false;
            }

            // It is a write-only usage, since we still allow usages on the right for reads
            if (parentStatement.left !== privateIdentifierNode.parent) {
                return false;
            }

            // For any other operator (such as '+=') we still consider it a read operation
            if (isAssignmentExpression && parentStatement.operator !== "=") {

                /*
                 * However, if the read operation is "discarded" in an empty statement, then
                 * we consider it write only.
                 */
                return parentStatement.parent.type === "ExpressionStatement";
            }

            return true;
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {

            // Collect all declared members up front and assume they are all unused
            ClassBody(classBodyNode) {
                const currentPrivateMembersPerClass = new Map();

                stackOfCurrentlyProcessingClassNodes.unshift(currentPrivateMembersPerClass);
                for (const bodyMember of classBodyNode.body) {
                    if (bodyMember.type === "PropertyDefinition" || bodyMember.type === "MethodDefinition") {
                        if (bodyMember.key.type === "PrivateIdentifier") {
                            currentPrivateMembersPerClass.set(bodyMember.key.name, {
                                declaredNode: bodyMember,
                                isSetter: bodyMember.type === "MethodDefinition" && bodyMember.kind === "set"
                            });
                        }
                    }
                }
            },

            /*
             * Process all usages of the private identifier and remove a member from
             * `declaredAndUnusedPrivateMembers` if we deem it used.
             */
            PrivateIdentifier(privateIdentifierNode) {

                // The definition of the class member itself
                if (privateIdentifierNode.parent.type === "PropertyDefinition" ||
                    privateIdentifierNode.parent.type === "MethodDefinition") {
                    return;
                }

                const isSetter = stackOfCurrentlyProcessingClassNodes[0].get(privateIdentifierNode.name)?.isSetter;

                // Any assignments to this member, except for assignments that also read
                if (isWriteOnlyAssignmentStatementWithoutPerformingAnyReads(privateIdentifierNode, isSetter)) {
                    return;
                }

                // A statement which only increments (`this.#x++;`)
                if (privateIdentifierNode.parent.parent.type === "UpdateExpression" &&
                    privateIdentifierNode.parent.parent.parent.type === "ExpressionStatement") {
                    return;
                }

                // ({ x: this.#usedInDestructuring } = bar);
                if (privateIdentifierNode.parent.parent.type === "Property" &&
                    privateIdentifierNode.parent.parent.parent.type === "ObjectPattern") {
                    return;
                }

                // [...this.#unusedInRestPattern] = bar;
                if (privateIdentifierNode.parent.parent.type === "RestElement") {
                    return;
                }

                // [this.#unusedInAssignmentPattern] = bar;
                if (privateIdentifierNode.parent.parent.type === "ArrayPattern" &&
                    privateIdentifierNode.parent.parent.parent.type === "AssignmentExpression") {
                    return;
                }

                stackOfCurrentlyProcessingClassNodes[0].delete(privateIdentifierNode.name);
            },

            /*
             * Post-process the class members and report any remaining members.
             * Since private members can only be accessed in the current class context,
             * we can safely assume that all usages are within the current class body.
             */
            "ClassBody:exit"() {
                const declaredAndUnusedPrivateMembers = stackOfCurrentlyProcessingClassNodes.shift();

                for (const [classMemberName, { declaredNode }] of declaredAndUnusedPrivateMembers.entries()) {
                    context.report({
                        node: declaredNode,
                        messageId: "unusedPrivateClassMember",
                        data: {
                            classMemberName
                        }
                    });
                }
            }
        };
    }
};
