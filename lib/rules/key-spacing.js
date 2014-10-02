/**
 * @fileoverview Rule to specify spacing of object literal keys and values
 * @author Brandon Mills
 * @copyright 2014 Brandon Mills. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets an object literal property's key as the identifier name or string value.
 * @param {ASTNode} property Property node whose key to retrieve.
 * @returns {string} The property's key.
 */
function getKey(property) {
    return property.key.name || property.key.value;
}

/**
 * Gets the number of characters in a key, including quotes around string keys.
 * @param {ASTNode} property Property of on object literal.
 * @returns {int} Width of the key, including string quotes where present.
 */
function getKeyWidth(property) {
    var key = property.key;
    return (key.type === "Identifier" ? key.name : key.raw).length;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var messages = {
    key: "{{error}} space after key \"{{key}}\".",
    value: "{{error}} space before value for key \"{{key}}\"."
};

module.exports = function(context) {

    /**
     * OPTIONS
     * "key-spacing": [2, {
     *     beforeColon: false,
     *     afterColon: true,
     *     align: "colon" // Optional, or "value"
     * }
     */

    var options = context.options[0] || {},
        align = options.align,
        beforeColon = +!!options.beforeColon, // Defaults to false
        afterColon = +!(options.afterColon === false); // Defaults to true

    /**
     * Gets the spacing around the colon in an object literal property
     * @param {ASTNode} property Property node from an object literal
     * @returns {Object} Spacing before and after the property's colon
     */
    function getPropertySpacing(property) {
        var whitespace = /^(\s*):(\s*)/.exec(context.getSource().slice(
            property.key.range[1], property.value.range[0]
        ));

        if (whitespace) {
            return {
                beforeColon: whitespace[1].length,
                afterColon: whitespace[2].length
            };
        }
    }

    /**
     * Reports an appropriately-formatted error if spacing is incorrect on one
     * side of the colon.
     * @param {ASTNode} property Key-value pair in an object literal.
     * @param {string} side Side being verified - either "key" or "value".
     * @param {int} diff Difference between actual and expected spacing.
     * @returns {void}
     */
    function report(property, side, diff) {
        if (diff) {
            context.report(property[side], messages[side], {
                error: diff > 0 ? "Extra" : "Missing",
                key: getKey(property)
            });
        }
    }

    if (align) { // Verify vertical alignment

        return {
            "ObjectExpression": function(node) {
                var properties = node.properties,
                    length = properties.length,
                    widths = properties.map(getKeyWidth), // Width of keys, including quotes
                    targetWidth = Math.max.apply(null, widths),
                    i, property, spacing, width;

                // Conditionally include one space before or after colon
                targetWidth += (align === "colon" ? beforeColon : afterColon);

                for (i = 0; i < length; i++) {
                    property = properties[i];
                    spacing = getPropertySpacing(property);

                    if (!spacing) {
                        continue; // Object literal getters/setters lack a colon
                    }

                    width = widths[i];

                    if (align === "value") {
                        report(property, "key", spacing.beforeColon - beforeColon);
                        report(property, "value", (width + spacing.afterColon) - targetWidth);
                    } else { // align = "colon"
                        report(property, "key", (width + spacing.beforeColon) - targetWidth);
                        report(property, "value", spacing.afterColon - afterColon);
                    }
                }
            }
        };

    } else { // Strictly obey beforeColon and afterColon in each property

        return {
            "Property": function (node) {
                var spacing = getPropertySpacing(node);
                if (spacing) { // Object literal getters/setters lack colon spacing
                    report(node, "key", spacing.beforeColon - beforeColon);
                    report(node, "value", spacing.afterColon - afterColon);
                }
            }
        };

    }

};
