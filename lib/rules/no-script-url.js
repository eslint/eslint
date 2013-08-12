/*jshint scripturl: true */

/**
 * @fileoverview Rule to flag when using javascript: urls
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Literal": function(node) {
            if (node.value && typeof(node.value) === "string" && node.value.toLowerCase().indexOf("javascript:") >= 0) {
                context.report(node, "Script URL is a form of eval.");
            }
        }
    };

};
