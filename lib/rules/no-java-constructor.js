/**
 * @fileoverview Rule to warn about declaring a method with the same name of the class. The
 * developer was likely writing Java recently and meant to write `constructor`.
 * @author Michael Bolin
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow method names that match the class name",
            category: "Possible Errors",
            recommended: false
        },

        schema: []
    },

    create(context) {
        return {
            MethodDefinition(node) {
                const methodName = node.key.name;
                const classDeclaration = node.parent.parent;

                if (classDeclaration.id === null) {
                    return;
                }
                const className = classDeclaration.id.name;

                if (methodName === className) {
                    context.report({
                        node,
                        // eslint-disable-next-line eslint-plugin/report-message-format
                        message: "Method name should not match class name. Did you mean to use `constructor`?"
                    });
                }
            }
        };
    }
};
