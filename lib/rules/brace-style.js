/**
 * @fileoverview Rule to flag block statements that do not use the one true brace style
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var style = context.options[0] || "1tbs";

    var OPEN_MESSAGE = "Opening curly brace does not appear on the same line as controlling statement.",
        CLOSE_MESSAGE = "Closing curly brace does not appear on the same line as the subsequent block.",
        CLOSE_MESSAGE_STROUSTRUP = "Closing curly brace appears on the same line as the subsequent block.";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Binds a list of properties to a function that verifies that the opening
     * curly brace is on the same line as its controlling statement of a given
     * node.
     * @param {...string} The properties to check on the node.
     * @returns {Function} A function that will perform the check on a node
     */
    function checkBlock() {
        var blockProperties = arguments;
        return function(node) {
            [].forEach.call(blockProperties, function(blockProp) {
                var block = node[blockProp], previousToken, curlyToken;
                block = node[blockProp];
                if(block && block.type === "BlockStatement") {
                    previousToken = context.getTokenBefore(block);
                    curlyToken = context.getFirstToken(block);
                    if (previousToken.loc.start.line !== curlyToken.loc.start.line) {
                        context.report(node, OPEN_MESSAGE);
                    }
                }
            });
        };
    }

    /**
     * Enforces the configured brace style on IfStatements
     * @param {ASTNode} node An IfStatement node.
     * @returns {void}
     */
    function checkIfStatement(node) {
        var tokens;

        checkBlock("consequent", "alternate")(node);

        if (node.alternate && node.alternate.type === "BlockStatement") {
            tokens = context.getTokensBefore(node.alternate, 2);
            if (style === "1tbs") {
                if (tokens[0].loc.start.line !== tokens[1].loc.start.line) {
                    context.report(node.alternate, CLOSE_MESSAGE);
                }
            } else if (style === "stroustrup") {
                if (tokens[0].loc.start.line === tokens[1].loc.start.line) {
                    context.report(node.alternate, CLOSE_MESSAGE_STROUSTRUP);
                }
            }
        }
    }

    /**
     * Enforces the configured brace style on TryStatements
     * @param {ASTNode} node A TryStatement node.
     * @returns {void}
     */
    function checkTryStatement(node) {
        var tokens;

        checkBlock("block", "finalizer")(node);

        if (node.finalizer && node.finalizer.type === "BlockStatement") {
            tokens = context.getTokensBefore(node.finalizer, 2);
            if (style === "1tbs") {
                if (tokens[0].loc.start.line !== tokens[1].loc.start.line) {
                    context.report(node.finalizer, CLOSE_MESSAGE);
                }
            } else if (style === "stroustrup") {
                if (tokens[0].loc.start.line === tokens[1].loc.start.line) {
                    context.report(node.finalizer, CLOSE_MESSAGE_STROUSTRUP);
                }
            }
        }
    }

    /**
     * Enforces the configured brace style on CatchClauses
     * @param {ASTNode} node A CatchClause node.
     * @returns {void}
     */
    function checkCatchClause(node) {
        var previousToken = context.getTokenBefore(node),
            firstToken = context.getFirstToken(node);

        checkBlock("body")(node);

        if (node.body && node.body.type === "BlockStatement") {
            if (style === "1tbs") {
                if (previousToken.loc.start.line !== firstToken.loc.start.line) {
                    context.report(node, CLOSE_MESSAGE);
                }
            } else if (style === "stroustrup") {
                if (previousToken.loc.start.line === firstToken.loc.start.line) {
                    context.report(node, CLOSE_MESSAGE_STROUSTRUP);
                }
            }
        }
    }

    /**
     * Enforces the configured brace style on SwitchStatements
     * @param {ASTNode} node A SwitchStatement node.
     * @returns {void}
     */
    function checkSwitchStatement(node) {
        var tokens;
        if(node.cases && node.cases.length) {
            tokens = context.getTokensBefore(node.cases[0], 2);
            if (tokens[0].loc.start.line !== tokens[1].loc.start.line) {
                context.report(node, OPEN_MESSAGE);
            }
        } else {
            tokens = context.getLastTokens(node, 3);
            if (tokens[0].loc.start.line !== tokens[1].loc.start.line) {
                context.report(node, OPEN_MESSAGE);
            }
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "FunctionDeclaration": checkBlock("body"),
        "FunctionExpression": checkBlock("body"),
        "IfStatement": checkIfStatement,
        "TryStatement": checkTryStatement,
        "CatchClause": checkCatchClause,
        "DoWhileStatement": checkBlock("body"),
        "WhileStatement": checkBlock("body"),
        "WithStatement": checkBlock("body"),
        "ForStatement": checkBlock("body"),
        "ForInStatement": checkBlock("body"),
        "SwitchStatement": checkSwitchStatement
    };

};
