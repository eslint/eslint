/**
 * @fileoverview Internal rule to prevent missing or invalid meta property in core rules.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the property of the Object node passed in that has the name specified.
 * @param {string} property Name of the property to return.
 * @param {ASTNode} node The ObjectExpression node.
 * @returns {ASTNode} The Property node or null if not found.
 */
function getPropertyFromObject(property, node) {
    const properties = node.properties;

    if (!Array.isArray(properties)) {

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
 * Extracts the `meta` property from the ObjectExpression that all rules export.
 * @param {ASTNode} exportsNode ObjectExpression node that the rule exports.
 * @returns {ASTNode} The `meta` Property node or null if not found.
 */
function getMetaPropertyFromExportsNode(exportsNode) {
    return getPropertyFromObject("meta", exportsNode);
}

/**
 * Whether this `meta` ObjectExpression has a `docs` property defined or not.
 * @param {ASTNode} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `docs` property exists.
 */
function hasMetaDocs(metaPropertyNode) {
    return Boolean(getPropertyFromObject("docs", metaPropertyNode.value));
}

/**
 * Whether this `meta` ObjectExpression has a `docs.recommended` property defined or not.
 * @param {ASTNode} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `docs.recommended` property exists.
 */
function hasMetaDocsRecommended(metaPropertyNode) {
    const metaDocs = getPropertyFromObject("docs", metaPropertyNode.value);

    return metaDocs && getPropertyFromObject("recommended", metaDocs.value);
}

/**
 * Checks the validity of the meta definition of this rule and reports any errors found.
 * @param {RuleContext} context The ESLint rule context.
 * @param {ASTNode} exportsNode ObjectExpression node that the rule exports.
 * @returns {void}
 */
function checkMetaValidity(context, exportsNode) {
    const metaProperty = getMetaPropertyFromExportsNode(exportsNode);

    if (!metaProperty) {
        context.report({ node: exportsNode, messageId: "missingMeta" });
        return;
    }

    if (!hasMetaDocs(metaProperty)) {
        context.report({ node: metaProperty, messageId: "missingMetaDocs" });
        return;
    }

    if (!hasMetaDocsRecommended(metaProperty)) {
        context.report({ node: metaProperty, messageId: "missingMetaDocsRecommended" });
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce correct use of `meta` property in core rules",
            recommended: false
        },
        type: "problem",
        schema: [],
        messages: {
            missingMeta: "Rule is missing a meta property.",
            missingMetaDocs: "Rule is missing a meta.docs property.",
            missingMetaDocsRecommended: "Rule is missing a meta.docs.recommended property.",
            noExport: "Rule does not export anything. Make sure rule exports an object according to new rule format."
        }
    },

    create(context) {
        let exportsNode;

        return {
            AssignmentExpression(node) {
                if (node.left &&
                    node.right &&
                    node.left.type === "MemberExpression" &&
                    node.left.object.name === "module" &&
                    node.left.property.name === "exports") {

                    exportsNode = node.right;
                }
            },

            "Program:exit"(node) {
                if (!exportsNode) {
                    context.report({
                        node,
                        messageId: "noExport"
                    });
                } else {
                    checkMetaValidity(context, exportsNode);
                }
            }
        };
    }
};
