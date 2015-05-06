/**
 * @fileoverview Rule to check empty line before "return" statement
 * @author Eric Clemmons <eric@smarterspam.com>
 * @copyright 2014 Eric Clemmons. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determine if provided node has a preceding empty line
     * @private
     * @param {ASTNode} node ReturnStatement node
     * @returns {boolean} True if `node` has a blank line before it
     */
    function hasEmptyLineBefore(node) {
        var previousToken = context.getTokenBefore(node);

        var lineNum = node.loc.start.line,
            previousLineNum = previousToken.loc.end.line;

        // Measure the # of lines between tokens
        var gap = lineNum - previousLineNum - 1;

        // Exclude comments from gap measurement
        context.getComments(node).leading.forEach(function() {
            gap--;
        });

        // There should be an empty line _somewhere_ between tokens
        return gap > 0;
    }

    /**
     * Determine if provided node is with an `if` or `{}` block
     * @private
     * @param {ASTNode} node - ReturnStatement node
     * @returns {boolean} True if `node`'s parent is `IfStatement` or `BlockStatement`
     */
    function isIfOrBlock(node) {
        return ["IfStatement", "BlockStatement"].indexOf(node.parent.type) !== -1;
    }

    /**
     * Determine if provided node is the first token in an `if` or `{}` block
     * @private
     * @param {ASTNode} node ReturnStatement node
     * @returns {boolean} True if `node` the first token within a block
     */
    function isFirstTokenInBlock(node) {
        var previousToken = context.getTokenBefore(node);

        if (!previousToken) {
            return true;
        }

        if (!isIfOrBlock(node)) {
            return false;
        }

        if (previousToken.type !== "Punctuator") {
            return false;
        }

        return [")", "{"].indexOf(previousToken.value) !== -1;
    }

    /**
     * Reports the provided node if missing a preceding blank line
     * @private
     * @param {ASTNode} node - ReturnStatement node
     * @returns {void}
     */
    function checkForBlankLine(node) {
        if (isFirstTokenInBlock(node)) {
            return;
        }

        if (hasEmptyLineBefore(node)) {
            return;
        }

        context.report(node, "Expected blank line before `return` statement.");
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "ReturnStatement": checkForBlankLine
    };
};
