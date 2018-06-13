/**
 * @fileoverview Disallow shadowing of NaN, undefined, and Infinity (ES5 section 15.1.1)
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow identifiers from shadowing restricted names",
            category: "Variables",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-shadow-restricted-names"
        },

        schema: []
    },

    create(context) {

        const RESTRICTED = ["undefined", "NaN", "Infinity", "arguments", "eval"];

        /**
         * Check if the node name is present inside the restricted list
         * @param {ASTNode} id id to evaluate
         * @returns {void}
         * @private
         */
        function checkForViolation(id) {
            if (RESTRICTED.indexOf(id.name) > -1) {
                context.report({
                    node: id,
                    message: "Shadowing of global property '{{idName}}'.",
                    data: {
                        idName: id.name
                    }
                });
            }
        }

        return {
            VariableDeclarator(node) {
                checkForViolation(node.id);
            },
            ":function"(node) {
                if (node.id) {
                    checkForViolation(node.id);
                }
                node.params.forEach(checkForViolation);
            },
            "CatchClause[param!=null]"(node) {
                checkForViolation(node.param);
            }
        };

    }
};
