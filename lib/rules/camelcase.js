/**
 * @fileoverview Rule to flag non-camelcased identifiers
 * @author Nicholas C. Zakas, Claude Petit
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce camelcase naming convention (edited by Claude Petit)",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/camelcase"
        },

        schema: [
            {
                type: "object",
                properties: {
                    properties: {
                        enum: ["always", "never"]
                    },
                    exceptions: {
                        type: "array",
                        items: {
                            anyOf: [
                                {
                                    type: "string"
                                },
                                {
                                    type: "object",
                                    properties: {
                                        type: {
                                            enum: ["string", "regexp"]
                                        },
                                        value: {
                                            type: "string"
                                        },
                                        flags: {
                                            type: "string"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        ]
    },

    create(context) {

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        // contains reported nodes to avoid reporting twice on destructuring with shorthand notation
        const reported = [];
        const ALLOWED_PARENT_TYPES = new Set(["CallExpression", "NewExpression"]);

        /**
         * Checks if a string contains an underscore and isn't all upper-case
         * @param {string} name The string to check.
         * @returns {boolean} if the string is underscored
         * @private
         */
        function isUnderscored(name) {

            // if there's an underscore, it might be A_CONSTANT, which is okay
            return name.indexOf("_") > -1 && name !== name.toUpperCase();
        }

        const options = context.options[0] || {};
        let properties = options.properties || "";

        if (properties !== "always" && properties !== "never") {
            properties = "always";
        }

        let exceptions = options.exceptions || [];

        if (properties !== "never") {
            exceptions = exceptions.map(function(exception) {
                let obj = exception;
                if (typeof obj === 'string') {
                    obj = {
                        value: `"${obj.replace(/"/g, '\\"')}"`,
                        flags: ''
                    };
                }
                return new RegExp(obj.value, obj.flags || '');
            });
        }

        /**
         * Reports an AST node as a rule violation.
         * @param {ASTNode} node The node to report.
         * @returns {void}
         * @private
         */
        function report(node) {
            if (reported.indexOf(node) < 0) {
                reported.push(node);
                if (!exceptions.some((exception) => exception.test(node.name))) {
                    context.report({ node, message: "Identifier '{{name}}' is not in camel case.", data: { name: node.name } });
                }
            }
        }

        return {

            Identifier(node) {

                /*
                 * Leading and trailing underscores are commonly used to flag
                 * private/protected identifiers, strip them
                 */
                const name = node.name.replace(/^_+|_+$/g, ""),
                    effectiveParent = (node.parent.type === "MemberExpression") ? node.parent.parent : node.parent;

                // MemberExpressions get special rules
                if (node.parent.type === "MemberExpression") {

                    // "never" check properties
                    if (properties === "never") {
                        return;
                    }

                    // Always report underscored object names
                    if (node.parent.object.type === "Identifier" && node.parent.object.name === node.name && isUnderscored(name)) {
                        report(node);

                    // Report AssignmentExpressions only if they are the left side of the assignment
                    } else if (effectiveParent.type === "AssignmentExpression" && isUnderscored(name) && (effectiveParent.right.type !== "MemberExpression" || effectiveParent.left.type === "MemberExpression" && effectiveParent.left.property.name === node.name)) {
                        report(node);
                    }

                /*
                 * Properties have their own rules, and
                 * AssignmentPattern nodes can be treated like Properties:
                 * e.g.: const { no_camelcased = false } = bar;
                 */
                } else if (node.parent.type === "Property" || node.parent.type === "AssignmentPattern") {

                    if (node.parent.parent && node.parent.parent.type === "ObjectPattern") {

                        if (node.parent.shorthand && node.parent.value.left && isUnderscored(name)) {

                            report(node);
                        }

                        // prevent checking righthand side of destructured object
                        if (node.parent.key === node && node.parent.value !== node) {
                            return;
                        }

                        if (node.parent.value.name && isUnderscored(name)) {
                            report(node);
                        }
                    }

                    // "never" check properties
                    if (properties === "never") {
                        return;
                    }

                    // don't check right hand side of AssignmentExpression to prevent duplicate warnings
                    if (isUnderscored(name) && !ALLOWED_PARENT_TYPES.has(effectiveParent.type) && !(node.parent.right === node)) {
                        report(node);
                    }

                // Check if it's an import specifier
                } else if (["ImportSpecifier", "ImportNamespaceSpecifier", "ImportDefaultSpecifier"].indexOf(node.parent.type) >= 0) {

                    // Report only if the local imported identifier is underscored
                    if (node.parent.local && node.parent.local.name === node.name && isUnderscored(name)) {
                        report(node);
                    }

                // Report anything that is underscored that isn't a CallExpression
                } else if (isUnderscored(name) && !ALLOWED_PARENT_TYPES.has(effectiveParent.type)) {
                    report(node);
                }
            }

        };

    }
};
