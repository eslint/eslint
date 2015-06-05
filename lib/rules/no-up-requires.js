/**
 * @fileoverview Rule to enforce grouped require statements for Node.JS
 * @author Raphael Pigulla
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    function isRequireCall(node) {
        return node.callee.type === "Identifier" &&
            node.callee.name === "require";
    }

    function argumentContainsParentDots(node) {
        return node.arguments.length > 0 &&
            node.arguments[0].type === "Literal" &&
            node.arguments[0].value.indexOf("..") > -1;
    }

    return {
        "CallExpression": function(node) {
            if (isRequireCall(node) && argumentContainsParentDots(node)) {
                context.report(node, "Do not use .. in require paths");
            }
        }
    };
};
