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
            var src = context.getSource();

            var lines = src.split(/\r?\n/g);

            var location = {
                line:   lines.length,
                column: lines[lines.length - 1].length + 1
            };

            // Check that file is ended with EOL
            if (lines[lines.length - 1] !== "") {
                context.report(node, location, "Unexpected end of file - newline needed.");

            } else if (lines[lines.length - 2].trim().length === 0) {
                // Check if previous line is empty or contains spaces only
                context.report(node, location, "Multiple empty lines at the end of file.");
            }
        }

    };

};
