/**
 * @fileoverview Rule to warn when a function expression does not have a name.
 * @author Kyle T. Nunery
 * @copyright 2015 Brandon Mills. All rights reserved.
 * @copyright 2014 Kyle T. Nunery. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    /**
     * Determines whether the current FunctionExpression node is a get, set, or
     * shorthand method in an object literal.
     * @returns {boolean} True if the node is a get, set, or shorthand method.
     */
    function isObjectMethod() {
        var parent = context.getAncestors().pop();
        return (parent.type === "Property" && (
            parent.method ||
            parent.kind === "get" ||
            parent.kind === "set"
        ));
    }

    return {
        "FunctionExpression": function(node) {

            var name = node.id && node.id.name;

            if (!name && !isObjectMethod()) {
                context.report(node, "Missing function expression name.");
            }
        }
    };
};
