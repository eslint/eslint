/**
 * @fileoverview Rule to restrict what can be thrown as an exception.
 * @author Dieter Oberkofler
 * @copyright 2015 Ian VanSchooten. All rights reserved.
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determine if a node contains only literals (including concatenation)
 * @param  {ASTNode}  node  ASTNode to check for only literals
 * @returns {Boolean}       True if completely literal, false otherwise
 */
function isLiteral(node) {
    if (node.type === "Literal") {
        return true;
    }

    if (node.type === "BinaryExpression") {
        if (isLiteral(node.left) && isLiteral(node.right)) {
            return true;
        } else {
            return false;
        }
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "ThrowStatement": function(node) {
            if (isLiteral(node.argument)) {
                context.report(node, "Do not throw a literal.");
            } else if (node.argument.type === "Identifier") {
                if (node.argument.name === "undefined") {
                    context.report(node, "Do not throw undefined.");
                }
            }

        }

    };

};

module.exports.schema = [];
