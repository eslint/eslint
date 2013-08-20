/**
 * @fileoverview Rule to case statements without break
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "SwitchCase": function(node) {
            if (!node.consequent.some(function(item) {
                return item.type === "BreakStatement" || item.type === "ReturnStatement" ;
            })) {
                context.report(node, "Expected a 'break' statement in case statement.");
            }
        }
    };

};
