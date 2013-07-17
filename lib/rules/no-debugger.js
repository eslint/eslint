/**
 * @fileoverview Rule to flag use of an empty block statement
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
