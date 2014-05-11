/**
 * @fileoverview Rule to flag octal escape sequences in string literals.
 * @author Ian Christian Myers
 */
/*jshint unused: true */
/*eslint no-unused-vars: 0*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "Literal": function(node) {
            // TODO: Traceur currently doesn't support decoding octal literals.
            // if (typeof node.value !== "string") {
            //     return;
            // }
            // var match = node.raw.match(/^([^\\]|\\[^0-7])*\\([0-7])/),
            //     octalDigit;

            // if (match) {
            //     octalDigit = match[2];
            //     context.report(node, "Don't use octal: '\\{{octalDigit}}'. Use '\\u....' instead.",
            //             { octalDigit: octalDigit });
            // }
        }

    };

};
