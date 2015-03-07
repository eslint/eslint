/**
 * @fileoverview Rule to flag use of an empty block statement
 * @author Nicholas C. Zakas
 * @copyright Nicholas C. Zakas. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "BlockStatement": function(node) {
            var ancestors = context.getAncestors(),
                parent = ancestors[ancestors.length - 1],
                parentType = parent.type,
                hasHandler = !!(parent.handler || (parent.handlers && parent.handlers.length)),
                isFinallyBlock = (parentType === "TryStatement") && (parent.finalizer === node);

            if (/Function|CatchClause/.test(parentType) ||
                    (isFinallyBlock && !hasHandler)) {
                return;
            }

            if (node.body.length === 0) {
                context.report(node, "Empty block statement.");
            }
        },

        "SwitchStatement": function(node) {

            if (typeof node.cases === "undefined" || node.cases.length === 0) {
                context.report(node, "Empty switch statement.");
            }
        }
    };

};
