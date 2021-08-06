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
            recommended: true,
            url: "https://eslint.org/docs/rules/no-unused-private-class-members"
        },

        schema: [],

        messages: {
            unusedPrivateClassMember: "'{{classMemberName}}' is defined but never used."
        }
    },

    create(context) {

        const declaredAndUnusedPrivateMembers = new Map();

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {

            // Collect all declared members up front and assume they are all unused
            ClassBody(classBodyNode) {
                for (const bodyMember of classBodyNode.body) {
                    if (bodyMember.type === "PropertyDefinition" || bodyMember.type === "MethodDefinition") {
                        if (bodyMember.key.type === "PrivateIdentifier") {
                            declaredAndUnusedPrivateMembers.set(bodyMember.key.name, bodyMember);
                        }
                    }
                }
            },

            /*
             * Process all usages of the private identifier and remove a member from
             * `declaredAndUnusedPrivateMembers` if we deem it used.
             */
            PrivateIdentifier(privateIdentifierNode) {
                if (

                    // The definition of the class member itself
                    privateIdentifierNode.parent.type !== "PropertyDefinition" &&
                    privateIdentifierNode.parent.type !== "MethodDefinition" &&

                    // Any usage of this member, except for writes (if it is a property)
                    privateIdentifierNode.parent.parent.type !== "AssignmentExpression") {

                    declaredAndUnusedPrivateMembers.delete(privateIdentifierNode.name);
                }
            },

            /*
             * Post-process the class members and report any remaining members.
             * Since private members can only be accessed in the current class context,
             * we can safely assume that all usages are within the current class body.
             */
            "ClassBody:exit"() {
                for (const [classMemberName, remainingDeclaredMember] of declaredAndUnusedPrivateMembers.entries()) {
                    context.report({
                        node: remainingDeclaredMember,
                        messageId: "unusedPrivateClassMember",
                        data: {
                            classMemberName
                        }
                    });
                }
                declaredAndUnusedPrivateMembers.clear();
            }
        };
    }
};
