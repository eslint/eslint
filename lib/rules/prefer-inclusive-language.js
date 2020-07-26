/**
 * @fileoverview Rule to encourage the use of inclusive language that avoids discrimination against groups of people.
 * @author Drew Wyatt
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require the use of inclusive language that avoids discrimination against groups of people",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/prefer-inclusive-language"
        },
        type: "suggestion",
        fixable: null,
        messages: {
            exclusive: "Identifier '{{name}}' may be considered harmful or exclusive. Use inclusive language that avoids discrimination against groups of people based on race, gender, or socioeconomic status."
        },
        schema: [
            {
                type: "object",
                properties: {
                    denyList: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        default: [
                            "whitelist",
                            "blacklist",
                            "master",
                            "slave"
                        ]
                    }
                }
            }
        ]
    },

    create(context) {
        const options = context.options[0] || {};
        const denyList = options.denyList || [
            "whitelist",
            "blacklist",
            "master",
            "slave"
        ];

        const reported = [];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Checks if a string constains denied language
         * @param {string} name The string to check.
         * @returns {boolean} if the string contains a term on the denyList
         * @private
         */
        function isDisallowed(name) {
            return denyList.findIndex(term => name.toLowerCase().includes(term)) > -1;
        }

        /**
         * Reports an AST node as a rule violation.
         * @param {ASTNode} node The node to report.
         * @returns {void}
         * @private
         */
        function report(node) {
            if (!reported.includes(node)) {
                reported.push(node);
                context.report({ node, messageId: "exclusive", data: { name: node.name } });
            }
        }


        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            Identifier(node) {
                const disallowed = isDisallowed(node.name);

                if (disallowed) {
                    report(node);
                }
            }
        };
    }
};
