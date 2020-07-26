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
                    allow: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        default: []
                    },
                    deny: {
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
                    },
                    ignoreDestructuring: {
                        type: "boolean",
                        default: false
                    }
                }
            }
        ]
    },

    create(context) {
        const options = context.options[0] || {};
        const allowList = options.allow || [];
        const denyList = options.deny || [
            "whitelist",
            "blacklist",
            "master",
            "slave"
        ];
        const ignoreDestructuring = options.ignoreDestructuring || false;

        const reported = [];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Checks if a string contains denied language
         * @param {string} name The string to check.
         * @returns {boolean} if the string contains a term on the denyList
         * @private
         */
        function containsExclusiveLanguage(name) {
            return denyList.findIndex(term => name.toLowerCase().includes(term)) > -1;
        }

        /**
         * Checks if a string is on the "allow" list
         * @param {string} name The string to check.
         * @returns {boolean} if the string is an exact match with a term on the allowList
         * @private
         */
        function isExplicitlyAllowed(name) {
            return allowList.indexOf(name) > -1;
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
                const name = node.name;
                const nameContainsEclusiveLanguage = containsExclusiveLanguage(name);

                // First, we ignore the node if it match the ignore list
                if (isExplicitlyAllowed(name)) {
                    return;
                }

                /*
                 * Borrows heavily from camelcase:
                 *
                 * Properties have their own rules, and
                 * AssignmentPattern nodes can be treated like Properties:
                 * e.g.: const { no_camelcased = false } = bar;
                 */
                if (node.parent.type === "Property" || node.parent.type === "AssignmentPattern") {

                    if (node.parent.parent && node.parent.parent.type === "ObjectPattern") {
                        if (node.parent.shorthand && node.parent.value.left && nameContainsEclusiveLanguage) {
                            report(node);
                        }

                        const assignmentKeyEqualsValue = node.parent.key.name === node.parent.value.name;

                        if (nameContainsEclusiveLanguage && node.parent.computed) {
                            report(node);
                        }

                        // prevent checking righthand side of destructured object
                        if (node.parent.key === node && node.parent.value !== node) {
                            return;
                        }

                        const valueContainsExclusiveLanguage = node.parent.value.name && nameContainsEclusiveLanguage;

                        // ignore destructuring if the option is set, unless a new identifier is created
                        if (valueContainsExclusiveLanguage && !(assignmentKeyEqualsValue && ignoreDestructuring)) {
                            report(node);
                        }
                    }

                    if (ignoreDestructuring) {
                        return;
                    }
                }

                if (containsExclusiveLanguage(name)) {
                    report(node);
                }
            }
        };
    }
};
