/**
 * @fileoverview Rule to flag use of trailing whitespace.
 * @author Jed Hunsaker
 */


//------------------------------------------------------------------------------                                         
// Helpers
//------------------------------------------------------------------------------

function hasTrailingWhitespace(value) {
    return (/[\t ]\r?\n/).test(value);
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "Whitespace": function(node) {

            if (hasTrailingWhitespace(node.value)) {
                context.report(node, "Unexpected trailing whitespace.");
            }

        }
    };

};
