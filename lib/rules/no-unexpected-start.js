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
        fixable: null, // or "code" or "whitespace"
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
        // Helpers
        //----------------------------------------------------------------------
        /**
         * Report invalid nodes at the start of a statement
         * @param {ASTNode} node The node being investigated
         * @returns {void}
         * @private
         */
        function reportInvalid(node) {
            const { type, value } = node;
            const isInvalidType = Object.keys(invalidTypes).includes(type);
            const isInvalidValue = invalidValues.includes(value);


            if (isInvalidType || isInvalidValue) {
                const char = isInvalidType ? invalidTypes[type] : value;

                const message = `Unexpected continuation character at start of statement: ${char}`;

                context.report({
                    node,
                    message
                });
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ":statement"(statementNode) {
                const firstToken = context.getSourceCode().getFirstToken(statementNode);

                reportInvalid(firstToken);
            }
        };
    }
};
