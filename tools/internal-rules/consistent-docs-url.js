/**
 * @fileoverview Internal rule to enforce meta.docs.url conventions.
 * @author Patrick McElhaney
 */

"use strict";

const path = require("path");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the property of the Object node passed in that has the name specified.
 *
 * @param {string} property Name of the property to return.
 * @param {ASTNode} node The ObjectExpression node.
 * @returns {ASTNode} The Property node or null if not found.
 */
function getPropertyFromObject(property, node) {
    const properties = node.properties;

    if (!Array.isArray(properties)) {

        // if properties is not an array, "internal-no-invalid-meta" will already report this.
        return null;
    }

    for (let i = 0; i < properties.length; i++) {
        if (properties[i].key.name === property) {
            return properties[i];
        }
    }

    return null;
}

/**
 * Verifies that the meta.docs.url property is present and has the correct value.
 *
 * @param {RuleContext} context The ESLint rule context.
 * @param {ASTNode} exportsNode ObjectExpression node that the rule exports.
 * @returns {void}
 */
function checkMetaDocsUrl(context, exportsNode) {
    if (exportsNode.type !== "ObjectExpression") {

        // if the exported node is not the correct format, "internal-no-invalid-meta" will already report this.
        return;
    }

    const metaProperty = getPropertyFromObject("meta", exportsNode);
    const metaDocs = metaProperty && getPropertyFromObject("docs", metaProperty.value);
    const metaDocsUrl = metaDocs && getPropertyFromObject("url", metaDocs.value);

    if (!metaDocs) {
        context.report({
            node: metaProperty,
            message: "Rule is missing a meta.docs property"
        });
        return;
    }

    if (!metaDocsUrl) {
        context.report({
            node: metaDocs,
            message: "Rule is missing a meta.docs.url property"
        });
        return;
    }

    const ruleId = path.basename(context.getFilename().replace(/.js$/u, ""));
    const expected = `https://eslint.org/docs/rules/${ruleId}`;
    const url = metaDocsUrl.value.value;

    if (url !== expected) {
        context.report({
            node: metaDocsUrl.value,
            message: `Incorrect url. Expected "${expected}" but got "${url}"`
        });
    }

}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce correct conventions of `meta.docs.url` property in core rules",
            category: "Internal",
            recommended: false
        },
        type: "suggestion",
        schema: []
    },

    create(context) {
        return {
            AssignmentExpression(node) {
                if (node.left &&
                    node.right &&
                    node.left.type === "MemberExpression" &&
                    node.left.object.name === "module" &&
                    node.left.property.name === "exports") {

                    checkMetaDocsUrl(context, node.right);
                }
            }
        };
    }
};
