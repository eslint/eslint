/**
 * @fileoverview Rule to disallow use of the new operator with global no constructor functions
 * @author Sosuke Suzuki
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const noConstructorGlobalFunctionNames = ["Symbol", "BigInt"];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../shared/types').Rule} */
module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "Disallow `new` operators with global no constructor functions",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-new-noconstructor"
        },

        schema: [],

        messages: {
            noNewNoconstructor: "`{{name}}` cannot be called as a constructor."
        }
    },

    create(context) {

        return {
            "Program:exit"() {
                const globalScope = context.getScope();

                for (const noConstructorName of noConstructorGlobalFunctionNames) {
                    const variable = globalScope.set.get(noConstructorName);

                    if (variable && variable.defs.length === 0) {
                        variable.references.forEach(ref => {
                            const node = ref.identifier;
                            const parent = node.parent;

                            if (parent && parent.type === "NewExpression" && parent.callee === node) {
                                context.report({
                                    node,
                                    messageId: "noNewNoconstructor"
                                });
                            }
                        });
                    }
                }
            }
        };

    }
};
