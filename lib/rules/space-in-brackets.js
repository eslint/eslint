/**
 * @fileoverview Disallows or enforces spaces inside of brackets.
 * @author Ian Christian Myers
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var shouldSpace = context.options[0] || "never";

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines whether two adjacent tokens are have whitespace between them.
     * @param {Object} left The left token object.
     * @param {Object} right The right token object.
     * @returns {Boolean} Whether or not there is space between the tokens.
     */
    function isSpaced(left, right) {
        return left.range[1] < right.range[0];
    }

    /**
     * Determines whether two adjacent tokens are on the same line.
     * @param {Object} left The left token object.
     * @param {Object} right The right token object.
     * @returns {Boolean} Whether or not the tokens are on the same line.
     */
    function isSameLine(left, right) {
        return left.loc.start.line === right.loc.start.line;
    }

    /**
     * Checks whether the given set of tokens are spaced according to the user
     * given preferences. Reports the node, if the tokens are improperly spaced.
     * @param {ASTNode} node The node to report in the event of an error.
     * @param {Object[]} tokens The tokens to be checked for spacing.
     * @returns {void}
     */
    function verifySpacing(node, tokens) {
        if (shouldSpace === "always") {
            if (!isSpaced(tokens[0], tokens[1])) {
                context.report(node, tokens[0].loc.end,
                        "A space is required after '" + tokens[0].value + "'");
            }

            if (!isSpaced(tokens[tokens.length - 2], tokens[tokens.length - 1])) {
                context.report(node, tokens[tokens.length - 1].loc.start,
                        "A space is required before '" + tokens[tokens.length - 1].value + "'");
            }
        } else if (shouldSpace === "never") {

            // This is an exception for Array and Object literals that do not
            // have any values on the same lines as brackets.
            if ((node.type === "ArrayExpression" || node.type === "ObjectExpression") &&
                    !isSameLine(tokens[0], tokens[1]) &&
                    !isSameLine(tokens[tokens.length - 2], tokens[tokens.length - 1])) {
                return;
            }

            if (isSpaced(tokens[0], tokens[1])) {
                context.report(node, tokens[0].loc.end,
                        "There should be no space after '" + tokens[0].value + "'");
            }

            if (isSpaced(tokens[tokens.length - 2], tokens[tokens.length - 1])) {
                context.report(node, tokens[tokens.length - 1].loc.start,
                        "There should be no space before '" + tokens[tokens.length - 1].value + "'");
            }
        }
    }

    /**
     * Checks whether the brackets of an Object or Array literal are spaced
     * according to the given preferences.
     * @param {ASTNode} node The ArrayExpression or ObjectExpression node.
     * @returns {void}
     */
    function checkLiteral(node) {
        var tokens = context.getTokens(node);
        verifySpacing(node, tokens);
    }

    /**
     * Checks whether the brackets of an Object's member are spaced according to
     * the given preferences, if the member is being accessed with bracket
     * notation
     * @param {ASTNode} node The MemberExpression node.
     * @returns {void}
     */
    function checkMember(node) {

        // Ensure the property is not enclosed in brackets.
        if (node.computed) {
            var tokens = context.getTokens(node.property, 1, 1);
            verifySpacing(node, tokens);
        }
    }


    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "MemberExpression": checkMember,
        "ArrayExpression": checkLiteral,
        "ObjectExpression": checkLiteral

    };

};
