/**
 * @fileoverview A rule to enforce using `meta.messages` property in core rules
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */

"use strict";

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
 * Verifies that the meta.messages property is present.
 * TODO: check it has the correct value
 * @param {RuleContext} context The ESLint rule context.
 * @param {ASTNode} exportsNode ObjectExpression node that the rule exports.
 * @returns {void}
 */
function checkMetaMessages(context, exportsNode) {
    if (exportsNode.type !== "ObjectExpression") {

        // if the exported node is not the correct format, "internal-no-invalid-meta" will already report this.
        return;
    }

    const metaProperty = getPropertyFromObject("meta", exportsNode);
    const messages = metaProperty && getPropertyFromObject("messages", metaProperty.value);

    if (!messages) {
        context.report({
            node: metaProperty,
            messageId: "expectedMessages"
        });
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce using `meta.messages` property in core rules",
            category: "Internal",
            recommended: false
        },
        schema: [],
        type: "suggestion",
        messages: {
            expectedMessages: "Expected `meta.messages` property."
        }
    },

    create(context) {
        return {
            "AssignmentExpression[left.object.name='module'][left.property.name='exports']"(node) {
                checkMetaMessages(context, node.right);
            }
        };
    }
};
