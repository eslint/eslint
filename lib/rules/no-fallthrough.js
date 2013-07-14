/**
 * @fileoverview Rule to flag fall-through cases in switch statements.
 * @author Matt DuVall<http://mattduvall.com/>
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "SwitchStatement": function(node) {
            var cases = node.cases,
                consequent,
                i,
                switchCase;

            if (typeof cases !== "undefined") {

                for (i = 0, len = cases.length; i < len; i++) {
                    switchCase = cases[i];
                    consequent = switchCase.consequent;

                    // Check that there are statements for the case and that
                    // the last statement is not a break
                    if (consequent.length !== 0 &&
                            consequent[consequent.length-1].type !== "BreakStatement") {
                        context.report(node, "No fall-through without explicit comment.");
                    }
                }
            }
        }
    };

};
