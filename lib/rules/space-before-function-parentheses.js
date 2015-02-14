/**
 * @fileoverview Rule to validate spacing before function parentheses.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 * @copyright 2015 Mathias Schreck
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var configuration = context.options[0],
        requireAnonymousFunctionSpacing = true,
        requireNamedFunctionSpacing = true;

    if (typeof configuration === "object") {
        requireAnonymousFunctionSpacing = configuration.anonymous !== "never";
        requireNamedFunctionSpacing = configuration.named !== "never";
    } else if (configuration === "never") {
        requireAnonymousFunctionSpacing = false;
        requireNamedFunctionSpacing = false;
    }

    /**
     * Determines whether two adjacent tokens are have whitespace between them.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not there is space between the tokens.
     */
    function isSpaced(left, right) {
        return left.range[1] < right.range[0];
    }

    /**
     * Validates the spacing before function parentheses.
     * @param {ASTNode} node The node to be validated.
     * @returns {void}
     */
    function validateSpacingBeforeParentheses(node) {
        var tokens = context.getTokens(node),
            isNamedFunction = node.id ? true : false,
            leftToken,
            rightToken,
            location;

        if (isNamedFunction) {
            leftToken = tokens[1];
            rightToken = tokens[2];
        } else {
            leftToken = tokens[0];
            rightToken = tokens[1];
        }

        location = leftToken.loc.end;

        if (isSpaced(leftToken, rightToken)) {
            if ((isNamedFunction && !requireNamedFunctionSpacing) || (!isNamedFunction && !requireAnonymousFunctionSpacing)) {
                context.report(node, location, "Unexpected space before function parentheses.");
            }
        } else {
            if ((isNamedFunction && requireNamedFunctionSpacing) || (!isNamedFunction && requireAnonymousFunctionSpacing)) {
                context.report(node, location, "Missing space before function parentheses.");
            }
        }
    }

    return {
        "FunctionDeclaration": validateSpacingBeforeParentheses,
        "FunctionExpression": validateSpacingBeforeParentheses
    };
};
