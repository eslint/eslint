/**
 * @fileoverview Validates newlines before and after dots
 * @author Greg Cochard
 * @copyright 2015 Greg Cochard
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

    var config = context.options[0],
        // default to onObject if no preference is passed
        onObject = config === "object" || !config;

    /**
     * Checks whether two tokens are on the same line.
     * @param {Object} left The leftmost token.
     * @param {Object} right The rightmost token.
     * @returns {boolean} True if the tokens are on the same line, false if not.
     * @private
     */
    function isSameLine(left, right) {
        return left.loc.end.line === right.loc.start.line;
    }

    /**
     * Reports if the given token has invalid spacing.
     * @param {ASTNode} obj The object owning the property.
     * @param {ASTNode} prop The property of the object.
     * @param {ASTNode} node The corresponding node of the token.
     * @returns {void}
     */
    function checkDotLocation(obj, prop, node) {

        if (!isSameLine(obj, prop)) {
            var dot = context.getTokensBetween(obj, prop)[0];
            if (onObject) {
                if (obj.loc.start.line !== dot.loc.start.line) {
                    context.report(node, dot.loc.start, "Expected dot to be on same line as object.");
                }
            } else if (prop.loc.start.line !== dot.loc.start.line) {
            // if (afterNewline && prop.loc.line !== dot.loc.line) {
                context.report(node, dot.loc.start, "Expected dot to be on same line as property.");
            }
        }
    }

    /**
     * Checks the spacing of the dot within a member expression.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     */
    function checkNode(node) {
        checkDotLocation(node.object, node.property, node);
    }

    return {
        "MemberExpression": checkNode
    };
};
