/**
 * @fileoverview Allow or disallow Unicode BOM
 * @author ehjay <https://github.com/ehjay>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "allow or disallow Unicode BOM",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [
            {
                enum: ["always", "never"]
            }
        ]
    },

    create: function(context) {

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {

            Program: function checkUnicodeBOM(node) {

                var sourceCode = context.getSourceCode(),
                    location = {column: 1, line: 1},
                    allowBOM = context.options[0] || "never";

                if (sourceCode.hasBOM && (allowBOM === "never")) {
                    context.report({
                        node: node,
                        loc: location,
                        message: "Found unicode BOM (Byte Order Mark)."
                    });
                }
            }

        };

    }
};
