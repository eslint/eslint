/**
 * @fileoverview Rule to flag missing semicolons.
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = function(context) {

    var OPT_OUT_PATTERN = /[\[\(\/\+\-]/;

    var always = context.options[0] !== "never";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Check if a semicolon is unnecessary, only true if:
     *   - next token is on a new line and is not one of the opt-out tokens
     *   - next token is a valid statement divider
     * @param {Token} lastToken last token of current node.
     * @param {Token} nextToken next token after current node.
     * @returns {boolean} whether the semicolon is unnecessary.
     */
    function isUnnecessarySemicolon(lastToken, nextToken) {

        var lastTokenLine = lastToken.loc.end.line,
            nextTokenLine = nextToken && nextToken.loc.start.line,
            isOptOutToken = nextToken && OPT_OUT_PATTERN.test(nextToken.value),
            isDivider = nextToken && (nextToken.value === "}" || nextToken.value === ";");

        return (lastTokenLine !== nextTokenLine && !isOptOutToken) || isDivider;
    }

    /**
     * Checks a node to see if it's followed by a semicolon.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     */
    function checkForSemicolon(node) {
        var lastToken = context.getLastToken(node),
            nextToken = context.getTokenAfter(node);

        if (always) {
            if (lastToken.type !== "Punctuator" || lastToken.value !== ";") {
                context.report(node, lastToken.loc.end, "Missing semicolon.");
            }
        } else {
            if (lastToken.type === "Punctuator" &&
                lastToken.value === ";" &&
                isUnnecessarySemicolon(lastToken, nextToken)
            ) {
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
            (!/^For(?:In|Of)Statement/.test(parent.type) || parent.left !== node)
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
        "ThrowStatement": checkForSemicolon,
        "DebuggerStatement": checkForSemicolon,
        "BreakStatement": checkForSemicolon,
        "ContinueStatement": checkForSemicolon,
        "EmptyStatement": function (node) {
            var lastToken, nextToken;

            if (!always) {
                lastToken = context.getLastToken(node);
                nextToken = context.getTokenAfter(node) || context.getLastToken(node);

                if (isUnnecessarySemicolon(lastToken, nextToken)) {
                    context.report(node, "Extra semicolon.");
                }
            }


        }
    };

};
