/**
 * @fileoverview Rule to flag missing semicolons.
 * @author Nicholas C. Zakas
 */


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = function(context) {

    "use strict";

    var always = context.options[0] !== "never";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Checks a node to see if it's followed by a semicolon.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     */
    function checkForSemicolon(node) {

        var tokens = context.getTokens(node),
            token = tokens.pop();

        if (always) {
            if (token.type !== "Punctuator" || token.value !== ";") {
                context.report(node, node.loc.end, "Missing semicolon.");
            }
        } else {
            if (token.type === "Punctuator" && token.value === ";") {
                context.report(node, node.loc.end, "Extra semicolon.");
            }
        }
    }

    /**
     * Checks to see if there's a semicolon after a variable declaration.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     */
    function checkForSemicolonForVariableDeclaration(node) {

        var ancestors = context.getAncestors(),
            parentIndex = ancestors.length - 1,
            parent = ancestors[parentIndex];

        if ((parent.type !== "ForStatement" || parent.init !== node) &&
            (parent.type !== "ForInStatement" || parent.left !== node)
        ) {
            checkForSemicolon(node);
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {

        "VariableDeclaration": checkForSemicolonForVariableDeclaration,
        "ExpressionStatement": checkForSemicolon,
        "ReturnStatement": checkForSemicolon,
        "DebuggerStatement": checkForSemicolon,
        "BreakStatement": checkForSemicolon,
        "ContinueStatement": checkForSemicolon,
        "EmptyStatement": function (node) {
            var tokens,
                token;

            if (!always) {
                tokens = context.getTokens(node, 0, 1);
                token = tokens.pop();

                if (!(/[\[\(\/\+\-]/.test(token.value))) {
                    context.report(node, "Extra semicolon.");
                }
            }


        }
    };

};
