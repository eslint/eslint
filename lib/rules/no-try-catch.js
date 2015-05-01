/**
 * @fileoverview Rule to flag use of with statement
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {
        "TryStatement": function(node) {
            context.report(node, "Unexpected use of 'try' statement.");
            if (node.handler && node.handler.type === "CatchClause") {
                context.report(node, node.handler.loc.start, "Unexpected use of 'catch' clause.");
            }
            if (node.finalizer) {
                context.report(node, {
                    line: node.finalizer.loc.start.line,
                    column: node.finalizer.loc.start.column - "finally ".length
                }, "Unexpected use of 'finally' clause.");
            }
        }
    };

};
