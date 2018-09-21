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

        schema: {
            type: "array",
            items: [
                {
                    type: "string"
                }
            ]
        }
    },

    create(context) {
        const patterns = context.options;

        /**
         * Runs RegExp.prototype.match for each pattern on a single node
         * @param {ASTNode} node The node
         * @returns {boolean} `true` if the node matches any of the specified patterns
         */
        function checkNode(node) {
            const { value } = node;

            patterns.forEach(pattern => {
                const regex = pattern && new RegExp(pattern);

                if (regex && value && typeof value === "string" && regex.test(value)) {
                    context.report({
                        node,
                        message: "Value of a string '{{value}}' matches pattern '{{pattern}}' and is considered a hardcode.",
                        data: { value, pattern }
                    });
                }
            });
        }

        return {

            Literal(node) {
                return checkNode(node);
            }
        };

    }
};
