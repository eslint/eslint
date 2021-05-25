/**
 * @fileoverview Rule to flag trailing underscores in variable declarations.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow dangling underscores in identifiers",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-underscore-dangle"
        },

        schema: [
            {
                type: "object",
                properties: {
                    allow: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    },
                    allowAfterThis: {
                        type: "boolean",
                        default: false
                    },
                    allowAfterSuper: {
                        type: "boolean",
                        default: false
                    },
                    allowAfterThisConstructor: {
                        type: "boolean",
                        default: false
                    },
                    enforceInMethodNames: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        const options = context.options[0] || {};
        const ALLOWED_VARIABLES = options.allow ? options.allow : [];
        const allowAfterThis = typeof options.allowAfterThis !== "undefined" ? options.allowAfterThis : false;
        const allowAfterSuper = typeof options.allowAfterSuper !== "undefined" ? options.allowAfterSuper : false;
        const allowAfterThisConstructor = typeof options.allowAfterThisConstructor !== "undefined" ? options.allowAfterThisConstructor : false;
        const enforceInMethodNames = typeof options.enforceInMethodNames !== "undefined" ? options.enforceInMethodNames : false;

        //-------------------------------------------------------------------------
        // Helpers
        //-------------------------------------------------------------------------

        /**
         * Check if identifier is present inside the allowed option
         * @param {string} identifier name of the node
         * @returns {boolean} true if its is present
         * @private
         */
        function isAllowed(identifier) {
            return ALLOWED_VARIABLES.some(ident => ident === identifier);
        }

        /**
         * Check if identifier has a underscore at the end
         * @param {string} identifier name of the node
         * @returns {boolean} true if its is present
         * @private
         */
        function hasTrailingUnderscore(identifier) {
            const len = identifier.length;

            return identifier !== "_" && (identifier[0] === "_" || identifier[len - 1] === "_");
        }

        /**
         * Check if identifier is a special case member expression
         * @param {string} identifier name of the node
         * @returns {boolean} true if its is a special case
         * @private
         */
        function isSpecialCaseIdentifierForMemberExpression(identifier) {
            return identifier === "__proto__";
        }

        /**
         * Check if identifier is a special case variable expression
         * @param {string} identifier name of the node
         * @returns {boolean} true if its is a special case
         * @private
         */
        function isSpecialCaseIdentifierInVariableExpression(identifier) {

            // Checks for the underscore library usage here
            return identifier === "_";
        }

        /**
         * Check if a node is a member reference of this.constructor
         * @param {ASTNode} node node to evaluate
         * @returns {boolean} true if it is a reference on this.constructor
         * @private
         */
        function isThisConstructorReference(node) {
            return node.object.type === "MemberExpression" &&
                node.object.property.name === "constructor" &&
                node.object.object.type === "ThisExpression";
        }

        /**
         * Check if function has a underscore at the end
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkForTrailingUnderscoreInFunctionDeclaration(node) {
            if (node.id) {
                const identifier = node.id.name;

                if (typeof identifier !== "undefined" && hasTrailingUnderscore(identifier) && !isAllowed(identifier)) {
                    context.report({
                        node,
                        message: "Unexpected dangling '_' in '{{identifier}}'.",
                        data: {
                            identifier
                        }
                    });
                }
            }
        }

        /**
         * Check if variable expression has a underscore at the end
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkForTrailingUnderscoreInVariableExpression(node) {
            const identifier = node.id.name;

            if (typeof identifier !== "undefined" && hasTrailingUnderscore(identifier) &&
                !isSpecialCaseIdentifierInVariableExpression(identifier) && !isAllowed(identifier)) {
                context.report({
                    node,
                    message: "Unexpected dangling '_' in '{{identifier}}'.",
                    data: {
                        identifier
                    }
                });
            }
        }

        /**
         * Check if member expression has a underscore at the end
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkForTrailingUnderscoreInMemberExpression(node) {
            const identifier = node.property.name,
                isMemberOfThis = node.object.type === "ThisExpression",
                isMemberOfSuper = node.object.type === "Super",
                isMemberOfThisConstructor = isThisConstructorReference(node);

            if (typeof identifier !== "undefined" && hasTrailingUnderscore(identifier) &&
                !(isMemberOfThis && allowAfterThis) &&
                !(isMemberOfSuper && allowAfterSuper) &&
                !(isMemberOfThisConstructor && allowAfterThisConstructor) &&
                !isSpecialCaseIdentifierForMemberExpression(identifier) && !isAllowed(identifier)) {
                context.report({
                    node,
                    message: "Unexpected dangling '_' in '{{identifier}}'.",
                    data: {
                        identifier
                    }
                });
            }
        }

        /**
         * Check if method declaration or method property has a underscore at the end
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkForTrailingUnderscoreInMethod(node) {
            const identifier = node.key.name;
            const isMethod = node.type === "MethodDefinition" || node.type === "Property" && node.method;

            if (typeof identifier !== "undefined" && enforceInMethodNames && isMethod && hasTrailingUnderscore(identifier)) {
                context.report({
                    node,
                    message: "Unexpected dangling '_' in '{{identifier}}'.",
                    data: {
                        identifier
                    }
                });
            }
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        return {
            FunctionDeclaration: checkForTrailingUnderscoreInFunctionDeclaration,
            VariableDeclarator: checkForTrailingUnderscoreInVariableExpression,
            MemberExpression: checkForTrailingUnderscoreInMemberExpression,
            MethodDefinition: checkForTrailingUnderscoreInMethod,
            Property: checkForTrailingUnderscoreInMethod
        };

    }
};
