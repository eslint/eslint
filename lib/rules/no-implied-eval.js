/**
 * @fileoverview Rule to flag use of implied eval via setTimeout and setInterval
 * @author James Allardice
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {
        "CallExpression": function(node) {

            if (node.callee.type === "Identifier") {
                var callee = node.callee.name;

                if (callee === "setTimeout" || callee === "setInterval") {
                    var argument = node.arguments[0];
                    if (argument && argument.type === "Literal" && typeof argument.value === "string") {
                        context.report(node, "Implied eval. Consider passing a function instead of a string.");
                    }
                }
            }
        }
    };

};
