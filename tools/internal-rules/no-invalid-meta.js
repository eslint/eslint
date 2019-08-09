/**
 * @fileoverview Internal rule to prevent missing or invalid meta property in core rules.
 * @author Vitor Balocco
 */

"use strict";

const { rule } = require("../../lib/rules/utils/rule");

/**
 * @template T
 * @typedef {import("../../lib/rules/utils/rule").AST<T>} AST
 */
/** @typedef {import("../../lib/rules/utils/rule").RuleContext} RuleContext */

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the property of the Object node passed in that has the name specified.
 *
 * @param {string} propertyName Name of the property to return.
 * @param {AST<"Node">} node The node. This may be ObjectExpression node.
 * @returns {AST<"Property"> | null} The Property node or null if not found.
 */
function getPropertyFromObject(propertyName, node) {
    if (node.type !== "ObjectExpression") {
        return null;
    }
    const properties = node.properties;

    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];

        if (
            property.type === "Property" &&
            !property.computed &&
            (property.key.type === "Identifier"
                ? property.key.name
                : String(property.key.value)) === propertyName
        ) {
            return property;
        }
    }

    return null;
}

/**
 * Extracts the `meta` property from the ObjectExpression that all rules export.
 *
 * @param {AST<"ObjectExpression">} exportsNode ObjectExpression node that the rule exports.
 * @returns {AST<"Property"> | null} The `meta` Property node or null if not found.
 */
function getMetaPropertyFromExportsNode(exportsNode) {
    return getPropertyFromObject("meta", exportsNode);
}

/**
 * Whether this `meta` ObjectExpression has a `docs` property defined or not.
 *
 * @param {AST<"Property">} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `docs` property exists.
 */
function hasMetaDocs(metaPropertyNode) {
    return Boolean(getPropertyFromObject("docs", metaPropertyNode.value));
}

/**
 * Whether this `meta` ObjectExpression has a `docs.description` property defined or not.
 *
 * @param {AST<"Property">} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `docs.description` property exists.
 */
function hasMetaDocsDescription(metaPropertyNode) {
    const metaDocs = getPropertyFromObject("docs", metaPropertyNode.value);

    return Boolean(metaDocs && getPropertyFromObject("description", metaDocs.value));
}

/**
 * Whether this `meta` ObjectExpression has a `docs.category` property defined or not.
 *
 * @param {AST<"Property">} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `docs.category` property exists.
 */
function hasMetaDocsCategory(metaPropertyNode) {
    const metaDocs = getPropertyFromObject("docs", metaPropertyNode.value);

    return Boolean(metaDocs && getPropertyFromObject("category", metaDocs.value));
}

/**
 * Whether this `meta` ObjectExpression has a `docs.recommended` property defined or not.
 *
 * @param {AST<"Property">} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `docs.recommended` property exists.
 */
function hasMetaDocsRecommended(metaPropertyNode) {
    const metaDocs = getPropertyFromObject("docs", metaPropertyNode.value);

    return Boolean(metaDocs && getPropertyFromObject("recommended", metaDocs.value));
}

/**
 * Whether this `meta` ObjectExpression has a `schema` property defined or not.
 *
 * @param {AST<"Property">} metaPropertyNode The `meta` ObjectExpression for this rule.
 * @returns {boolean} `true` if a `schema` property exists.
 */
function hasMetaSchema(metaPropertyNode) {
    return Boolean(getPropertyFromObject("schema", metaPropertyNode.value));
}

/**
 * Checks the validity of the meta definition of this rule and reports any errors found.
 *
 * @param {RuleContext} context The ESLint rule context.
 * @param {AST<"ObjectExpression">} exportsNode ObjectExpression node that the rule exports.
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

    if (!hasMetaDocsDescription(metaProperty)) {
        context.report({ node: metaProperty, messageId: "missingMetaDocsDescription" });
        return;
    }

    if (!hasMetaDocsCategory(metaProperty)) {
        context.report({ node: metaProperty, messageId: "missingMetaDocsCategory" });
        return;
    }

    if (!hasMetaDocsRecommended(metaProperty)) {
        context.report({ node: metaProperty, messageId: "missingMetaDocsRecommended" });
        return;
    }

    if (!hasMetaSchema(metaProperty)) {
        context.report({ node: metaProperty, messageId: "missingMetaSchema" });
    }
}

/**
 * Whether this node is the correct format for a rule definition or not.
 *
 * @param {AST<"Node">} node node that the rule exports.
 * @returns {node is AST<"ObjectExpression">} `true` if the exported node is the correct format for a rule definition
 */
function isCorrectExportsFormat(node) {
    return node.type === "ObjectExpression";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = rule({
    meta: {
        docs: {
            description: "enforce correct use of `meta` property in core rules",
            category: "Internal",
            recommended: false,
            url: ""
        },
        type: "problem",
        schema: [],
        messages: {
            missingMeta: "Rule is missing a meta property.",
            missingMetaDocs: "Rule is missing a meta.docs property.",
            missingMetaDocsDescription: "Rule is missing a meta.docs.description property.",
            missingMetaDocsCategory: "Rule is missing a meta.docs.category property.",
            missingMetaDocsRecommended: "Rule is missing a meta.docs.recommended property.",
            missingMetaSchema: "Rule is missing a meta.schema property.",
            noExport: "Rule does not export anything. Make sure rule exports an object according to new rule format.",
            incorrectExport: "Rule does not export an Object. Make sure the rule follows the new rule format."
        }
    },

    create(context) {

        /** @type {AST<"Node"> | null} */
        let exportsNode = null;

        return {
            AssignmentExpression(node) {
                if (
                    node.left.type === "MemberExpression" &&
                    node.left.object.type === "Identifier" &&
                    node.left.object.name === "module" &&
                    node.left.property.type === "Identifier" &&
                    node.left.property.name === "exports"
                ) {
                    if (
                        node.right.type === "CallExpression" &&
                        node.right.callee.type === "Identifier" &&
                        node.right.callee.name === "rule"
                    ) {
                        exportsNode = node.right.arguments[0] || node.right;
                    } else {
                        exportsNode = node.right;
                    }
                }
            },

            /**
             * @param {AST<"Program">} node The Program node.
             */
            "Program:exit"(node) {
                if (!exportsNode) {
                    context.report({
                        node,
                        messageId: "noExport"
                    });
                } else if (!isCorrectExportsFormat(exportsNode)) {
                    context.report({
                        node: exportsNode,
                        messageId: "incorrectExport"
                    });
                } else {
                    checkMetaValidity(context, exportsNode);
                }
            }
        };
    }
});
