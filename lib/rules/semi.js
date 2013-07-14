/**
 * @fileoverview Rule to flag missing semicolons.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function checkForSemicolon(node) {

        // get text for the node plus one more character at the end
        var source = context.getSource(node, 0, 1);

        if (source[source.length - 1] !== ";") {
            context.report(node, "Missing semicolon.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {

        "VariableDeclaration": checkForSemicolon,
        "ExpressionStatement": checkForSemicolon
    };

};
