/**
 * @fileoverview Rule to flag missing semicolons.
 * @author Nicholas C. Zakas
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function checkForSemicolon(node) {

        // get tokens for the node plus one more token at the end
        var tokens = context.getTokens(node),
            nextToken = tokens.pop();

        if (nextToken.type !== "Punctuator" || nextToken.value !== ";") {
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
