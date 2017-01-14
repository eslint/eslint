/**
 * @fileoverview Rule to check spacing between template tags and their literals
 * @author Jonathan Wilsson
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require or disallow spacing between template tags and their literals",
            category: "ECMAScript 6",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            { enum: ["always", "never"] }
        ]
    },

    create(context) {
        const never = context.options[0] !== "always";
        const sourceCode = context.getSourceCode();

        /**
         * Check if a space is present between a template tag and its literal
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
        function checkSpacing(node) {
            const tagToken = sourceCode.getTokenBefore(node.quasi);
            const literalToken = sourceCode.getFirstToken(node.quasi);
            const hasWhitespace = sourceCode.isSpaceBetweenTokens(tagToken, literalToken);

            if (never && hasWhitespace) {
                context.report({
                    node,
                    loc: tagToken.loc.start,
                    message: "Unexpected space between template tag and template literal.",
                    fix(fixer) {
                        return fixer.removeRange([tagToken.range[1], literalToken.range[0]]);
                    }
                });
            } else if (!never && !hasWhitespace) {
                context.report({
                    node,
                    loc: tagToken.loc.start,
                    message: "Missing space between template tag and template literal.",
                    fix(fixer) {
                        return fixer.insertTextBefore(literalToken, " ");
                    }
                });
            }
        }

        return {
            TaggedTemplateExpression: checkSpacing
        };
    }
};
