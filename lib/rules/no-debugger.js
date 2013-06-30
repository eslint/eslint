/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    context.on("DebuggerStatement", function(node) {
        context.report(node, "Unexpected debugger statement.");
    });

};
