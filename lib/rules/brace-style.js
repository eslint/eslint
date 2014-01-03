/**
 * @fileoverview Rule to flag block statements that do not use the one true brace style
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function checkBlock() {
        var blockProperties = arguments;
        return function(node) {
            var tokens, block;
            [].forEach.call(blockProperties, function(blockProp) {
                block = node[blockProp];
                if(block && block.type === "BlockStatement") {
                    tokens = context.getTokens(block, 1);
                    if (tokens[0].loc.start.line !== tokens[1].loc.start.line) {
                        context.report(node, "Opening curly brace does not appear on the same line as the block identifier.");
                    }
                }
            });
        };
    }

    function checkSwitchStatement(node) {
        var tokens;
        if(node.cases && node.cases.length) {
            tokens = context.getTokens(node.cases[0], 2);
            if (tokens[0].loc.start.line !== tokens[1].loc.start.line) {
                context.report(node, "Opening curly brace does not appear on the same line as the block identifier.");
            }
        } else {
            tokens = context.getTokens(node);
            tokens.pop();
            if (tokens.pop().loc.start.line !== tokens.pop().loc.start.line) {
                context.report(node, "Opening curly brace does not appear on the same line as the block identifier.");
            }
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": checkBlock("body"),
        "IfStatement": checkBlock("consequent", "alternate"),
        "TryStatement": checkBlock("block", "finalizer"),
        "CatchClause": checkBlock("body"),
        "DoWhileStatement": checkBlock("body"),
        "WhileStatement": checkBlock("body"),
        "WithStatement": checkBlock("body"),
        "ForStatement": checkBlock("body"),
        "ForInStatement": checkBlock("body"),
        "SwitchStatement": checkSwitchStatement
    };

};
