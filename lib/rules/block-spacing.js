/**
 * @fileoverview A rule to disallow or enforce spaces inside of single line blocks.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

var util = require("../ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var always = (context.options[0] !== "never");
    var message = always ? "Requires a space" : "Unexpected space(s)";

    /**
     * Gets the open brace token from a given node.
     * @param {ASTNode} node - A BlockStatement/SwitchStatement node to get.
     * @returns {Token} The token of the open brace.
     */
    function getOpenBrace(node) {
        if (node.type === "SwitchStatement") {
            if (node.cases.length > 0) {
                return context.getTokenBefore(node.cases[0]);
            }
            return context.getLastToken(node, 1);
        }
        return context.getFirstToken(node);
    }

    /**
     * Checks whether or not:
     *   - given tokens are on same line.
     *   - there is/isn't a space between given tokens.
     * @param {Token} left - A token to check.
     * @param {Token} right - The token which is next to `left`.
     * @returns {boolean}
     *    When the option is `"always"`, `true` if there are one or more spaces between given tokens.
     *    When the option is `"never"`, `true` if there are not any spaces between given tokens.
     *    If given tokens are not on same line, it's always `true`.
     */
    function isValid(left, right) {
        return (
            !util.isTokenOnSameLine(left, right) ||
            util.isTokenSpaced(left, right) === always
        );
    }

    /**
     * Reports invalid spacing style inside braces.
     * @param {ASTNode} node - A BlockStatement/SwitchStatement node to get.
     * @returns {void}
     */
    function checkSpacingInsideBraces(node) {
        // Gets braces and the first/last token of content.
        var openBrace = getOpenBrace(node);
        var closeBrace = context.getLastToken(node);
        var firstToken = context.getTokenAfter(openBrace);
        var lastToken = context.getTokenBefore(closeBrace);

        // Skip if the node is invalid or empty.
        if (openBrace.type !== "Punctuator" ||
            openBrace.value !== "{" ||
            closeBrace.type !== "Punctuator" ||
            closeBrace.value !== "}" ||
            firstToken === closeBrace
        ) {
            return;
        }

        // Check.
        if (!isValid(openBrace, firstToken)) {
            context.report(node, openBrace.loc.start, message + " after \"{\".");
        }
        if (!isValid(lastToken, closeBrace)) {
            context.report(node, closeBrace.loc.start, message + " before \"}\".");
        }
    }

    return {
        BlockStatement: checkSpacingInsideBraces,
        SwitchStatement: checkSpacingInsideBraces
    };
};

module.exports.schema = [
    {enum: ["always", "never"]}
];
