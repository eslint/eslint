/**
 * @fileoverview disallow statement continuation characters at the start of statements
 * @author Fraction
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow statement continuation characters at the start of statements",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-unexpected-start"
        },
        fixable: null,
        schema: []
    },

    create(context) {
        const invalidTypes = {
            RegularExpression: "/",
            Template: "`"
        };

        const invalidValues = [
            "[",
            "(",
            "+",
            "/",
            "-"
        ];

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ":statement"(statementNode) {
                const node = context.getSourceCode().getFirstToken(statementNode);
                const { type, value } = node;
                const isInvalidType = Object.keys(invalidTypes).includes(type);
                const isInvalidValue = invalidValues.includes(value);

                if (isInvalidType || isInvalidValue) {
                    const char = isInvalidType ? invalidTypes[type] : value;
                    const message = `Unexpected continuation character at start of statement: ${char}`;

                    context.report({ node, message });
                }
            }
        };
    }
};
