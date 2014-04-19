/**
 * @fileoverview Rule to enforce the number of spaces after certain keywords
 * @author Nick Fisher
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    // unless the first option is `"never"`, then a space is required
    var requiresSpace = context.options[0] !== "never";

    /**
     * Check if the separation of two adjacent tokens meets the spacing rules, and report a problem if not.
     *
     * @param {ASTNode} node  The node to which the potential problem belongs.
     * @param {Token} left    The first token.
     * @param {Token} right   The second token
     * @returns {void}
     */
    function checkTokens(node, left, right) {
        var hasSpace = left.range[1] < right.range[0],
            value = left.value;

        if (hasSpace !== requiresSpace) {
            context.report(node, "Keyword \"{{value}}\" must {{not}}be followed by whitespace.", {
                value: value,
                not: requiresSpace ? "" : "not "
            });
        }
    }

    /**
     * Check if the given node (`if`, `for`, `while`, etc), has the correct spacing after it.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     */
    function check(node) {
        var tokens = context.getFirstTokens(node, 2);
        checkTokens(node, tokens[0], tokens[1]);

        // check the `else` of an `if`.
        if (tokens[0].value === "if" && node.alternate) {
            checkTokens(node.alternate, context.getTokenBefore(node.alternate), context.getFirstToken(node.alternate));
        }
    }

    return {
        "IfStatement": check,
        "ForStatement": check,
        "ForOfStatement": check,
        "ForInStatement": check,
        "WhileStatement": check,
        "DoWhileStatement": check,
        "SwitchStatement": check,
        "TryStatement": check,
        "CatchStatement": check,
        "WithStatement": check
    };
};

