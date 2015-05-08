/**
 * @fileoverview Disallows multiple blank lines.
 * implementation adapted from the no-trailing-spaces rule.
 * @author Greg Cochard
 * @copyright 2014 Greg Cochard. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    // Use options.max or 2 as default
    var numLines = 2;

    if (context.options.length) {
        numLines = context.options[0].max;
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "Program": function checkBlankLines(node) {
            var lines = context.getSourceLines(),
                currentLocation = -1,
                lastLocation,
                blankCounter = 0,
                location,
                trimmedLines = lines.map(function(str) {
                    return str.trim();
                });
            // swallow the final newline, as some editors add it automatically
            // and we don't want it to cause an issue
            if (trimmedLines[trimmedLines.length - 1] === "") {
                trimmedLines = trimmedLines.slice(0, -1);
            }

            // Aggregate and count blank lines
            lastLocation = currentLocation;
            currentLocation = trimmedLines.indexOf("", currentLocation + 1);
            while (currentLocation !== -1) {
                lastLocation = currentLocation;
                currentLocation = trimmedLines.indexOf("", currentLocation + 1);
                if (lastLocation === currentLocation - 1) {
                    blankCounter++;
                } else {
                    if (blankCounter >= numLines) {
                        location = {
                            line: lastLocation + 1,
                            column: lines[lastLocation].length
                        };
                        context.report(node, location, "Multiple blank lines not allowed.");
                    }

                    // Finally, reset the blank counter
                    blankCounter = 0;
                }
            }
        }
    };

};
