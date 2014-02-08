/**
 * @fileoverview Rule to warn when a function expression does not have a name.
 * @author Kyle T. Nunery
 */
 "use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    return {
        "FunctionExpression": function(node) {
        	
        	var name = node.id && node.id.name;

            if (!name) {
                context.report(node, "The function expression does not have a name. Named function expressions aid in debugging.");
            }
        }
    };
};
