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
            recommended: true
        },

        // TODO(mbolin): Find out what is supposed to go here.
        schema: {
        },

        fixable: "code"
    },

    create(context) {
        return {
            MethodDefinition(node) {
                const methodName = node.key.name;
                const className = node.parent.parent.id.name;

                if (methodName === className) {
                    context.report({
                        node,
                        // eslint-disable-next-line eslint-plugin/report-message-format
                        message: "Method name should not match class name. Did you mean to use `constructor`?",
                        fix(fixer) {
                            return fixer.replaceText(node.key, "constructor");
                        }
                    });
                }
            }
        };
    }
};
