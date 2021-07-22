/**
 * @fileoverview Rule to disallow property references in destructuring patterns
 * @author Brett Zamir <http://brett-zamir.me>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow property references in destructuring patterns",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-property-references-in-destructuring"
        },

        schema: [],

        messages: {
            propertyReferencesDestructuring: "Property references in destructuring patterns."
        }
    },

    create(context) {

        /**
         * Reports a useless pattern.
         * @param {ASTNode} node The node
         * @returns {void}
         */
        function report(node) {
            context.report({
                node,
                messageId: "propertyReferencesDestructuring",
                data: { name: node.type }
            });
        }

        /**
         * Check for non-destructuring object structures.
         * @param {ASTNode} node The node
         * @returns {void}
         */
        function checkForNonDestructuring(node) {
            const isArrayPattern = node.type === "ArrayPattern";
            const items = isArrayPattern ? "elements" : "properties";

            node[items].forEach(item => {
                const value = isArrayPattern ? item : item.value;
                const { type } = value;

                // Destructuring patterns
                if (type === "ObjectPattern" || type === "ArrayPattern") {
                    checkForNonDestructuring(value);
                    return;
                }

                // Destructuring variable
                if (type === "Identifier") {
                    return;
                }

                // Destructuring default
                if (type === "AssignmentPattern") {
                    if (value.left.type === "Identifier") {
                        return;
                    }

                    // Destructuring default for whole object/array pattern
                    if (value.left.type === "ObjectPattern" || value.left.type === "ArrayPattern") {
                        checkForNonDestructuring(value.left);
                        return;
                    }
                }

                report(value);
            });
        }

        return {
            "ExpressionStatement > AssignmentExpression > .left[type='ObjectPattern']": checkForNonDestructuring,
            "ExpressionStatement > AssignmentExpression > .left[type='ArrayPattern']": checkForNonDestructuring
        };

    }
};
