/**
 * @fileoverview Test rule to flag if the global var `test` is missing;
 * @author Mathias Schreck
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    return {
        "Program": function(node) {
            var globals = context.getScope().variables.map(function (variable) {
                return variable.name;
            });

            if (globals.indexOf("test") === -1) {
                context.report(node, "Global variable test was not defined.");
            }
            if (globals.indexOf("foo") !== -1) {
                context.report(node, "Global variable foo should not be used.");
            }
        }
    };
};
