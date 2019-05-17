/**
 * @fileoverview Fixable rule
 * @author Alberto Rodríguez
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

"use strict";

module.exports = {
    meta: {
        schema: [],
        fixable: "code"
    },

    create(context) {
        var sourceCode = context.getSourceCode();

        return {
            "Program"(node) {
                context.report({
                    node,
                    message: "No programs allowed.",
                    fix: fixer => fixer.remove(node)
                });
            }
        };
    }
};
