/**
 * @fileoverview Rule to flag block statements that do not use the one true brace style
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function checkBlockStartsAtIdentifier(node) {
        var startLine = node.loc.start.line;

        // Checks for opening curly brace on FunctionDeclarations.
        if (node.body && startLine !== node.body.loc.start.line) {
            context.report(node, "Opening curly brace does not appear on the same line as the block identifier.");
        }

        // Checks for opening curly brace on IfStatement, DoWhileStatement,
        // WhileStatement, WithStatement, ForStatement, and ForInStatement.
        if (node.consequent && startLine !== node.consequent.loc.start.line) {
            context.report(node, "Opening curly brace does not appear on the same line as the block identifier.");
        }

        // Checks for opening curly brace on TryStatement.
        if (node.block && startLine !== node.block.loc.start.line) {
            context.report(node, "Opening curly brace does not appear on the same line as the block identifier.");
        }

        // Checks for opening curly on SwitchStatement.
        if (node.discriminant && startLine !== node.cases[0].loc.start.line - 1) {
            context.report(node, "Opening curly brace does not appear on the same line as the block identifier.");
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": checkBlockStartsAtIdentifier,
        "IfStatement": checkBlockStartsAtIdentifier,
        "SwitchStatement": checkBlockStartsAtIdentifier,
        "TryStatement": checkBlockStartsAtIdentifier,
        "DoWhileStatement": checkBlockStartsAtIdentifier,
        "WhileStatement": checkBlockStartsAtIdentifier,
        "WithStatement": checkBlockStartsAtIdentifier,
        "ForStatement": checkBlockStartsAtIdentifier,
        "ForInStatement": checkBlockStartsAtIdentifier
    };

};
