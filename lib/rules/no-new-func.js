/**
 * @fileoverview Rule to flag when using new Function
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow `new` operators with the `Function` object",
            category: "Best Practices",
            recommended: false,
            url: "https://eslint.org/docs/rules/no-new-func"
        },

        schema: [],

        messages: {
            noFunctionConstructor: "The Function constructor is eval."
        }
    },

    create(context) {

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Reports a node.
         * @param {ASTNode} node The node to report
         * @returns {void}
         * @private
         */
        function report(node) {
            context.report({
                node,
                messageId: "noFunctionConstructor"
            });
        }

        return {
            "NewExpression[callee.name = 'Function']": report,
            "CallExpression[callee.name = 'Function']": report
        };

    }
};
