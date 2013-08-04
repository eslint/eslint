/**
 * @fileoverview Rule to flag when initializing octal literal
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Literal": function(node) {
            if (typeof node.value === "number" && /^0[0-7]/.test(node.raw)) {
                context.report(node, "Octal literals should not be used.");
            }
        }
    };

};
