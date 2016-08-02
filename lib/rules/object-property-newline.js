/**
 * @fileoverview Rule to enforce placing object properties on separate lines.
 * @author Vitor Balocco
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce placing object properties on separate lines",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [
            {
                type: "object",
                properties: {
                    allowMultiplePropertiesPerLine: {
                        type: "boolean"
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create: function(context) {
        const allowSameLine = context.options[0] && Boolean(context.options[0].allowMultiplePropertiesPerLine);
        const errorMessage = allowSameLine ?
            "Object properties must go on a new line if they aren't all on the same line." :
            "Object properties must go on a new line.";

        const sourceCode = context.getSourceCode();

        return {
            ObjectExpression: function(node) {
                if (allowSameLine) {
                    if (node.properties.length > 1) {
                        const firstTokenOfFirstProperty = sourceCode.getFirstToken(node.properties[0]);
                        const lastTokenOfLastProperty = sourceCode.getLastToken(node.properties[node.properties.length - 1]);

                        if (firstTokenOfFirstProperty.loc.end.line === lastTokenOfLastProperty.loc.start.line) {

                            // All keys and values are on the same line
                            return;
                        }
                    }
                }

                for (let i = 1; i < node.properties.length; i++) {
                    const lastTokenOfPreviousProperty = sourceCode.getLastToken(node.properties[i - 1]);
                    const firstTokenOfCurrentProperty = sourceCode.getFirstToken(node.properties[i]);

                    if (lastTokenOfPreviousProperty.loc.end.line === firstTokenOfCurrentProperty.loc.start.line) {
                        context.report({
                            node: node,
                            loc: firstTokenOfCurrentProperty.loc.start,
                            message: errorMessage
                        });
                    }
                }
            }
        };
    }
};
