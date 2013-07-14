/**
 * @fileoverview Checks for unreachable code due to return, throws, or false branch.
 * @author Joel Feenstra
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "BlockStatement": function(node) {
            for (i = 0; i < node.body.length - 1; i++) {

                if (node.body[i].type === "ReturnStatement") {
                    context.report(node.body[i + 1], "Found unexpected statement after a return.");
                    return;

                } else if (node.body[i].type === "ThrowStatement") {
                    context.report(node.body[i + 1], "Found unexpected statement after a throw.");
                    return;
                }
            }
        }
    };

};
