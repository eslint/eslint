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
        function checkNodeNameForViolation(id) {
            if (RESTRICTED.includes(id.name)) {
                context.report({
                    node: id,
                    message: "Shadowing of global property '{{idName}}'.",
                    data: {
                        idName: id.name
                    }
                });
            }
        }

        /**
         * Check if the node contains violations
         * @param {ASTNode} id id to evaluate
         * @returns {void}
         * @private
         */
        function checkForViolation(id) {
            if (id.type === "Identifier") {
                checkNodeNameForViolation(id);
            } else if (id.type === "ArrayPattern") {
                id.elements.forEach(checkNodeNameForViolation);
            } else if (id.type === "ObjectPattern") {
                context.getDeclaredVariables(id.parent).forEach(
                    variable => checkNodeNameForViolation(variable.defs[0].name)
                );
            }
        }

        return {
            VariableDeclarator(node) {
                checkForViolation(node.id);
            },
            ArrowFunctionExpression(node) {
                [].map.call(node.params, checkForViolation);
            },
            FunctionExpression(node) {
                if (node.id) {
                    checkForViolation(node.id);
                }
                [].map.call(node.params, checkForViolation);
            },
            FunctionDeclaration(node) {
                if (node.id) {
                    checkForViolation(node.id);
                    [].map.call(node.params, checkForViolation);
                }
            },
            CatchClause(node) {
                checkForViolation(node.param);
            }
        };

    }
};
