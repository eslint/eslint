/**
 * @fileoverview Rule to forbid mixing LF and LFCR line breaks.
 * @author Erik Mueller
 * @copyright 2015 Erik Mueller. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {
    var EXPECTED_LF_MSG = "Expected linebreaks to be 'LF' but found 'CRLF'.",
        EXPECTED_CRLF_MSG = "Expected linebreaks to be 'CRLF' but found 'LF'.";

    return {
        "Program": function checkForlinebreakStyle(node) {
            var linebreakStyle = context.options[0] || "unix",
                expectedLF = linebreakStyle === "unix",
                linebreaks = context.getSource().match(/\r\n|\r|\n|\u2028|\u2029/g),
                lineOfError = linebreaks.indexOf(expectedLF ? "\r\n" : "\n");

            if (lineOfError !== -1) {
                context.report(node, {
                    line: lineOfError + 1,
                    col: context.getSourceLines()[lineOfError].length
                }, expectedLF ? EXPECTED_LF_MSG : EXPECTED_CRLF_MSG);
            }
        }
    };
};
