/**
 * @fileoverview Rule to check for max length on a line.
 * @author Matt DuVall <http://www.mattduvall.com>
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    var maxLength = context.options[0],
        tabWidth = context.options[1],
        tabString = stringRepeat(" ", tabWidth);

    function stringRepeat(num) {
        num = parseInt(num, 10);
        var tabString = "",
            i;

        for (i = 0; i < tabWidth; i += 1) {
            tabString += " ";
        }

        return tabString;
    }

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------
    function checkProgramForMaxLength(node) {
        // Esprima does not include leading whitespace on the first line, this
        // sets the initial range to 80 for getSource
        node.range[0] = 0;
        var lines = context.getSource(node).split("\n"),
            i,
            line;

        for (i = 0; i < lines.length; i++) {
            line = lines[i];

            // Replace the tabs with the tab width
            line = line.replace(/\t/g, tabString);

            if (line.length > maxLength) {
                context.report(node, "Line " + i + " exceeds the maximum line length of " + maxLength + ".");
            }
        }
    }


    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "Program": checkProgramForMaxLength
    };

};
