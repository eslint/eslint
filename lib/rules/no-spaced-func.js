/**
 * @fileoverview Rule to check that spaced function application
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var sourceCode = context.getSourceCode();

    /**
     * Check if open space is present in a function name
     * @param {ASTNode} node node to evaluate
     * @returns {void}
     * @private
     */
    function detectOpenSpaces(node) {
        var lastCalleeToken = sourceCode.getLastToken(node.callee),
            tokens = sourceCode.getTokens(node),
            i = tokens.indexOf(lastCalleeToken),
            l = tokens.length;

        while (i < l && tokens[i].value !== "(") {
            ++i;
        }

        if (i >= l) {
            return;
        }

        // look for a space between the callee and the open paren
        if (sourceCode.isSpaceBetweenTokens(tokens[i - 1], tokens[i])) {
            context.report({
                node: node,
                loc: lastCalleeToken.loc.start,
                message: "Unexpected space between function name and paren.",
                fix: function(fixer) {
                    return fixer.removeRange([tokens[i - 1].range[1], tokens[i].range[0]]);
                }
            });
        }
    }

    return {
        "CallExpression": detectOpenSpaces,
        "NewExpression": detectOpenSpaces
    };

};

module.exports.schema = [];
