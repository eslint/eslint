/**
 * @fileoverview Disallow construction of dense arrays using the Array constructor
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    function check(node) {
        if (
            node.arguments.length !== 1 &&
            node.callee.type === "Identifier" &&
            node.callee.name === "Array"
        ) {
            context.report(node, "The array literal notation [] is preferrable.");
        }
    }

    return {
        "CallExpression": check,
        "NewExpression": check
    };

};
