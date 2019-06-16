/**
 * @fileoverview Disallow misspelling the length property.
 * @author Eric Schaefer <omg@eric-schaefer.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow misspelling the length property.",
            category: "Fill me in",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-misspelled-length"
        },
        fixable: null, // or "code" or "whitespace"
        schema: []
    },

    create(context) {
        const IDENTIFIER_NAME = "length";
        const IDENTIFIER_NAME_TOKENS = IDENTIFIER_NAME.split("").sort();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Compares current value from array with matching index of IDENTIFIER_NAME_TOKENS array.
         * @param {string} val Value of array item being checked.
         * @param {number} i Index of array being checked.
         * @returns {boolean} true if value matches item at index, otherwise false.
         */
        function compareElements(val, i) {
            return val === IDENTIFIER_NAME_TOKENS[i];
        }

        /**
         * Checks for obvious matches between name and IDENTIFIER_NAME
         * @param {string} name Identifier name to check.
         * @returns {boolean} false if name and IDENTIFIER_NAME are obviously the same, or not the same length
         */
        function isLengthIdentifierMaybeMisspelled(name) {
            if (name === IDENTIFIER_NAME) {
                return false;
            }

            if (name.length !== IDENTIFIER_NAME.length) {
                return false;
            }

            return true;
        }

        /**
         * Compares sorted name characters
         * @param {string} name Identifier name to check.
         * @returns {boolean} true if every character in name is also in sorted IDENTIFIER_NAME
         */
        function isLengthMisspelled(name) {
            return name
                .split("")
                .sort()
                .every(compareElements);
        }

        /**
         * Checks the member expression for a misspelled 'length' identifier.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         */
        function checkPropertyIdentifier(node) {
            if (node.property && node.property.name) {
                const { name } = node.property;

                if (isLengthIdentifierMaybeMisspelled(name)) {
                    if (isLengthMisspelled(name)) {
                        context.report({
                            node,
                            message: "Property 'length' may be misspelled."
                        });
                    }
                }
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            MemberExpression: checkPropertyIdentifier
        };
    }
};
