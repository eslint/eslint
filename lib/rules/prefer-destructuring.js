/**
 * @fileoverview Prefer destructuring from arrays and objects
 * @author Alex LaFroscia
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require destructuring from arrays and/or objects",
            category: "ECMAScript 6",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    array: {
                        type: "boolean"
                    },
                    object: {
                        type: "boolean"
                    }
                }
            }
        ]
    },
    create(context) {

        let checkArrays = true;
        let checkObjects = true;
        const options = context.options[0];

        if (options) {
            if (options.hasOwnProperty("array")) {
                checkArrays = options.array;
            }

            if (options.hasOwnProperty("object")) {
                checkObjects = options.object;
            }
        }

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Determines if the given node node is accessing an array index
         *
         * This is used to differentiate array index access from object property
         * access.
         *
         * @param {ASTNode} node the node to evaluate
         * @returns {boolean} whether or not the node is an integer
         */
        function isArrayIndexAccess(node) {
            return Number.isInteger(node.property.value);
        }

        /**
         * Check if a given variable declarator is coming from an property access
         * that should be using destructuring instead
         *
         * @param {ASTNode} node the variable declarator to check
         * @returns {void}
         */
        function checkVariableDeclarator(node) {

            // Skip if variable is declared without assignment
            if (!node.init) {
                return;
            }

            if (node.init.type === "Identifier") {
                const objectExpression = node.id.type === "ObjectPattern" && node.id;

                if (objectExpression) {
                    const prop = objectExpression.properties[0];
                    const key = prop.key;
                    const value = prop.value;

                    if ((key.name === value.name) && (key.start !== value.start)) {
                        context.report({ node: prop, message: "Unnecessary duplicate variable name" });
                    }
                }
            }

            // We only care about member expressions past this point
            if (node.init.type !== "MemberExpression") {
                return;
            }

            const memberExpression = node.init;

            if (checkArrays && isArrayIndexAccess(memberExpression)) {
                context.report({ node, message: "Use array destructuring" });
                return;
            }

            if (checkObjects && !isArrayIndexAccess(memberExpression)) {
                const variableIdentifier = node.id;
                const property = node.init.property;

                if (property.type === "Literal" && variableIdentifier.name === property.value) {
                    context.report({ node, message: "Use object destructuring" });
                }

                if (property.type === "Identifier" && variableIdentifier.name === property.name) {
                    context.report({ node, message: "Use object destructuring" });
                }
            }
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            VariableDeclarator: checkVariableDeclarator
        };
    }
};
