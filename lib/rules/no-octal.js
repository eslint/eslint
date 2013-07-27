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
            if (typeof node.value === "number" && node.raw[0] === "0" && node.raw.length > 1 && node.raw.indexOf("x") < 0) {
                context.report(node, "Octal literals should not be used.");
            }
        }
    };

};
