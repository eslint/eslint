/**
 * @fileoverview Disallow hardcoded values via RegExp
 * @author Grigory Gorshkov
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow hardcoded values via RegExp",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-hardcoded-values"
        },

        schema: []
    },

    create(context) {
        const sourceCode = context.getSourceCode();

        return {
            sourceCode
        };
    }
};
