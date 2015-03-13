/**
 * @fileoverview Rule to prevent a catch block to be empty.
 * @author Dieter Oberkofler
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var allowOnlyComment = !!context.options[0];

    function isBlockEmpty(block) {
        if (block.body && block.body.length > 0) {
            return false;
        }

        if (allowOnlyComment && block.trailingComments && block.trailingComments.length > 0) {
            return false;
        }

        return true;
    }

    return {
        "TryStatement": function(node) {
            var noOfHandlers = (node.handlers) ? node.handlers.length : 0,
                subNode,
                i;

            // check the catch clauses, if there are any
            for (i = 0; i < noOfHandlers; i++) {
                subNode = node.handlers[i];
                if (subNode.type === "CatchClause" && isBlockEmpty(node.handlers[i].body)) {
                    context.report(node, "Empty catch clause.");
                }
            }

            // check the finalizer claus, if there is one
            if (node.finalizer) {
                if (isBlockEmpty(node.finalizer)) {
                    context.report(node, "Empty finally clause.");
                }
            }
        }
    };
};
