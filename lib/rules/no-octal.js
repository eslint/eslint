/**
 * @fileoverview Rule to flag when initializing octal literal
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";
    var nostrict = context.options[0] === "nostrict";

    function report(node) {
        if (nostrict) {
            context.report(node, "Don't use octal: '" + node.raw + "'. Use '\\u...' instead");
        } else {
            context.report(node, "Octal literals should not be used.");
        }
    }


    return {

        "Literal": function(node) {
            if (typeof node.value === "number" && /^0[0-7]/.test(node.raw)) {
                report(node);
            }
        }
    };

};
