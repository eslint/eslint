/**
 * @fileoverview Test rule to flag invalid args
 * @author Mathias Schreck
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    "use strict";

    var config = context.options[0];

    return {
        "Program": function(node) {
            if (config === true) {
                context.report(node, "Invalid args");
            }
        }
    };
};
