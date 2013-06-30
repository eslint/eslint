/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    context.on("BlockStatement", function(node) {

        if (node.body.length === 0) {
            context.report(node, "Empty block statement.");
        }
    });

};
