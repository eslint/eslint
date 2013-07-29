/**
 * @fileoverview Rule to flag when using multiline strings
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    return {

        "Literal": function(node) {
            var lineBreak = /\n/;
            if (lineBreak.test(node.raw)) {
                context.report(node, "Multiline support is limited to browsers supporting ES5 only.");
            }
        }
    };

};
