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
                ft = /\s*\/\*\s*falls\sthrough\s*\*\/\s*/,
                consequent,
                i,
                len,
                switchCase;

            if (typeof cases !== "undefined") {

                for (i = 0, len = cases.length; i < len; i++) {
                    switchCase = cases[i];
                    consequent = switchCase.consequent;

                    // Check that there are statements for the case
                    if (consequent.length !== 0) {
                        var finalConsequentStatement = consequent[consequent.length-1],
                            isBreakStatement = finalConsequentStatement.type === "BreakStatement",
                            isReturnStatement = finalConsequentStatement.type === "ReturnStatement",
                            isThrowStatement = finalConsequentStatement.type === "ThrowStatement",
                            hasFallThroughComment = ft.exec(context.getSource(finalConsequentStatement, 0, 20)) !== null;

                        if (!isBreakStatement && !isReturnStatement &&
                                !isThrowStatement && !hasFallThroughComment) {
                            context.report(node, "No fall-through without explicit comment.");
                        }
                    }
                }
            }
        }
    };

};
