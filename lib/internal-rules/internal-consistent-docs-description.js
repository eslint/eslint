/**
 * @fileoverview Internal rule to enforce meta.docs.description conventions.
 * @author Vitor Balocco
 */

"use strict";

const ALLOWED_FIRST_WORDS = [
    "enforce",
    "require",
    "disallow"
];

const FIRST_WORD_REGEX = /^([\s]*[\S]+).*$/;

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

    for (let i = 0; i < properties.length; i++) {
        if (properties[i].key.name === property) {
            return properties[i];
        }
    }

    return null;
}

/**
 * Whether this node is the correct format for a rule definition or not.
 *
 * @param {ASTNode} node node that the rule exports.
 * @returns {boolean} `true` if the exported node is the correct format for a rule definition
 */
function isCorrectExportsFormat(node) {
    return node.type === "ObjectExpression";
}

/**
 * Verifies that the meta.docs.description property follows our internal conventions.
 *
 * @param {RuleContext} context The ESLint rule context.
 * @param {ASTNode} exportsNode ObjectExpression node that the rule exports.
 * @returns {void}
 */
function checkMetaDocsDescription(context, exportsNode) {
    if (!isCorrectExportsFormat(exportsNode)) {

        // if the exported node is not the correct format, "internal-no-invalid-meta" will already report this.
        return;
    }

    const metaProperty = getPropertyFromObject("meta", exportsNode);
    const metaDocs = metaProperty && getPropertyFromObject("docs", metaProperty.value);
    const metaDocsDescription = metaDocs && getPropertyFromObject("description", metaDocs.value);

    if (!metaDocsDescription) {

        // if there is no `meta.docs.description` property, "internal-no-invalid-meta" will already report this.
        return;
    }

    const description = metaDocsDescription.value.value;
    const matchFirstWord = FIRST_WORD_REGEX.exec(description);
    const firstWord = (matchFirstWord && matchFirstWord[1]) ? matchFirstWord[1] : description;

    if (ALLOWED_FIRST_WORDS.indexOf(firstWord) === -1) {
        context.report({
            node: metaDocsDescription.value,
            message: "`meta.docs.description` should start with one of the following words: {{ allowedWords }}. Started with \"{{ firstWord }}\" instead.",
            data: {
                allowedWords: ALLOWED_FIRST_WORDS.join(", "),
                firstWord
            }
        });
        return;
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce correct conventions of `meta.docs.description` property in core rules",
            category: "Internal",
            recommended: false
        },

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

                    checkMetaDocsDescription(context, node.right);
                }
            }
        };
    }
};
