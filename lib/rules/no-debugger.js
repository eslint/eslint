/**
 * @fileoverview Rule to flag use of a debugger statement
 * @author Nicholas C. Zakas
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "DebuggerStatement": function(node) {
            context.report(node, "Unexpected 'debugger' statement.");
        }
    };

};
