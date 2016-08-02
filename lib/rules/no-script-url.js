/**
 * @fileoverview Rule to flag when using javascript: urls
 * @author Ilya Volodin
 */
/* jshint scripturl: true */
/* eslint no-script-url: 0 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "disallow `javascript:` urls",
            category: "Best Practices",
            recommended: false
        },

        schema: []
    },

    create: function(context) {

        return {

            Literal: function(node) {
                if (node.value && typeof node.value === "string") {
                    const value = node.value.toLowerCase();

                    if (value.indexOf("javascript:") === 0) {
                        context.report(node, "Script URL is a form of eval.");
                    }
                }
            }
        };

    }
};
