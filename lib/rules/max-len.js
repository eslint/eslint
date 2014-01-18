/**
 * @fileoverview Rule to check for max length on a line.
 * @author Matt DuVall <http://www.mattduvall.com>
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function stringRepeat(str, num) {
        var result = "";
        for (num |= 0; num > 0; num >>>= 1, str += str) {
            if (num & 1) {
                result += str;
            }
        }
        return result;
    }

    var tabWidth = context.options[1];

    var maxLength = context.options[0],
        tabString = stringRepeat(" ", tabWidth);

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------
    function checkProgramForMaxLength(node) {
        // Esprima does not include leading whitespace on the first line, this
        // sets the initial range to 80 for getSource
        node.range[0] = 0;
        var lines = context.getSource(node);
        if(!lines) {
            return;
        }

        // Replace the tabs
        // Split (honors line-ending)
        // Iterate
        lines
            .replace(/\t/g, tabString)
            .split(/\r?\n/)
            .forEach(function(line, i){
                if (line.length > maxLength) {
                    context.report(node, "Line " + (i + 1) + " exceeds the maximum line length of " + maxLength + ".");
                }
            });
    }


    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "Program": checkProgramForMaxLength
    };

};
