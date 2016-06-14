/**
 * @fileoverview Rule to ensure newline per method call when chaining calls
 * @author Rajendra Patil
 * @author Burak Yigit Kaya
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require a newline after each call in a method chain",
            category: "Stylistic Issues",
            recommended: false
        },

        schema: [{
            type: "object",
            properties: {
                ignoreChainWithDepth: {
                    type: "integer",
                    minimum: 1,
                    maximum: 10
                }
            },
            additionalProperties: false
        }]
    },

    create: function(context) {

        var options = context.options[0] || {},
            ignoreChainWithDepth = options.ignoreChainWithDepth || 2;

        var sourceCode = context.getSourceCode();

        /**
         * Gets the property text of a given MemberExpression node.
         * If the text is multiline, this returns only the first line.
         *
         * @param {ASTNode} node - A MemberExpression node to get.
         * @returns {string} The property text of the node.
         */
        function getPropertyText(node) {
            var prefix = node.computed ? "[" : ".";
            var lines = sourceCode.getText(node.property).split(/\r\n|\r|\n/g);
            var suffix = node.computed && lines.length === 1 ? "]" : "";

            return prefix + lines[0] + suffix;
        }

        return {
            "CallExpression:exit": function(node) {
                if (!node.callee || node.callee.type !== "MemberExpression") {
                    return;
                }

                var callee = node.callee;
                var parent = callee.object;
                var depth = 1;

                while (parent && parent.callee) {
                    depth += 1;
                    parent = parent.callee.object;
                }

                if (depth > ignoreChainWithDepth && callee.property.loc.start.line === callee.object.loc.end.line) {
                    context.report(
                        callee.property,
                        callee.property.loc.start,
                        "Expected line break before `" + getPropertyText(callee) + "`."
                    );
                }
            }
        };
    }
};
