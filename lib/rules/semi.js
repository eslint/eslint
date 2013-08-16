/**
 * @fileoverview Rule to flag missing semicolons.
 * @author Nicholas C. Zakas
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = function(context) {

    "use strict";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function checkForSemicolon(node) {
        // get tokens for the node plus one more token at the end
        var tokens = context.getTokens(node),
            nextToken = tokens.pop();

        checkTokenForSemicolon(node, nextToken);
    }

    function checkForSemicolonForVariableDeclaration(node) {
        // get tokens for the node plus one more token at the end
        var ancestors = context.getAncestors(),
            parentIndex = ancestors.length-1,
            parent = ancestors[parentIndex];

        if ((parent.type !== "ForStatement" || parent.init !== node) &&
            (parent.type !== "ForInStatement" || parent.left !== node)
        ) {
            checkForSemicolon(node);
        }
    }

    function checkTokenForSemicolon(node, token) {
        if (token.type !== "Punctuator" || token.value !== ";") {
            context.report(node, "Missing semicolon.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {

        "VariableDeclaration": checkForSemicolonForVariableDeclaration,
        "ExpressionStatement": checkForSemicolon

    };

};
