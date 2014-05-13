/**
 * @fileoverview Rule to disallow use of new operator with the `require` function
 * @author Wil Moore III
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    return {

        "NewExpression": function(node) {
            if (node.callee.type === "Identifier" && node.callee.name === "require") {
                context.report(node, "Unexpected use of new with require.");
            }
        }
    };

};
