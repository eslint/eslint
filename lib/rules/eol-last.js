/**
 * @fileoverview Require file to end with single newline.
 * @author Nodeca Team <https://github.com/nodeca>
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "Program": function checkBadEOF(node) {
            // Get the whole source code, not for node only.
            var src = context.getSource(), location = {column: 1};

            if (src.length === 0) {
                return;
            }

            if (src[src.length - 1] !== "\n") {
                // file is not newline-terminated
                location.line = src.split(/\n/g).length;
                context.report(node, "Newline required at end of file but not found.", {location: location});
            } else if (/\n\s*\n$/.test(src)) {
                // last line is empty
                location.line = src.split(/\n/g).length - 1;
                context.report(node, "Unexpected blank line at end of file.", {location: location});
            }
        }

    };

};
