/**
 * @fileoverview Rule to flag non-matching identifiers
 * @author Matthieu Larcher
 * @copyright 2015 Matthieu Larcher. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    var pattern = context.options[0] || "^.+$",
        regexp = new RegExp(pattern);

    var options = context.options[1] || {},
        properties = options.properties;

    // cast to boolean and default to false
    properties = !!properties;


    /**
     * Checks if a string matches the provided pattern
     * @param {String} name The string to check.
     * @returns {boolean} if the string is a match
     * @private
     */
    function isInvalid(name) {
        return !regexp.test(name);
    }

    /**
     * Reports an AST node as a rule violation.
     * @param {ASTNode} node The node to report.
     * @returns {void}
     * @private
     */
    function report(node) {
        context.report(node, "Identifier '{{name}}' does not match the pattern '{{pattern}}'.", {
            name: node.name,
            pattern: pattern
        });
    }

    return {

        "Identifier": function(node) {
            var name = node.name,
                effectiveParent = (node.parent.type === "MemberExpression") ? node.parent.parent : node.parent;

            // MemberExpressions get special rules
            if (node.parent.type === "MemberExpression") {
                // return early if properties is false
                if (!properties) {
                    return;
                }

                // Always check object names
                if (node.parent.object.type === "Identifier" &&
                    node.parent.object.name === node.name) {
                    if (isInvalid(name)) {
                        report(node);
                    }

                    // Report AssignmentExpressions only if they are the left side of the assignment
                } else if (effectiveParent.type === "AssignmentExpression" &&
                    (effectiveParent.right.type !== "MemberExpression" ||
                    effectiveParent.left.type === "MemberExpression" &&
                    effectiveParent.left.property.name === node.name)) {
                    if (isInvalid(name)) {
                        report(node);
                    }
                }

            // Properties have their own rules
            } else if (node.parent.type === "Property") {
                // return early if properties is false
                if (!properties) {
                    return;
                }

                if (effectiveParent.type !== "CallExpression" && isInvalid(name)) {
                    report(node);
                }

            // Report anything that is a match and not a CallExpression
            } else if (effectiveParent.type !== "CallExpression" && isInvalid(name)) {
                report(node);
            }
        }

    };

};

module.exports.schema = [
    {
        "type": "string"
    },
    {
        "type": "object",
        "properties": {
            "properties": {
                "enum": [true, false]
            }
        }
    }
];
