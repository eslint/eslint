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
        const invalidTypes = [
            "RegularExpression",
            "Template"
        ];

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
         * Check whether the node's type and value are invalid.
         * @param {string} type The node type.
         * @param {string} value The node value.
         * @returns {boolean} Whether type and value are valid.
         * @private
         */
        function isInvalid(type, value) {
            const isInvalidType = invalidTypes.includes(type);
            const isInvalidValue = invalidValues.includes(value);

            return isInvalidType || isInvalidValue;
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ":statement"(statementNode) {
                const firstToken = context.getSourceCode().getFirstToken(statementNode);
                const { type, value } = firstToken;

                if (isInvalid(type, value)) {
                    context.report({
                        node: firstToken,
                        message: "Unexpected start of statement."
                    });
                }
            }
        };
    }
};
