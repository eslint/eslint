/**
 * @fileoverview Rule to forbid control charactes from regular expressions.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";


    function getRegExp(node) {

        if (node.value instanceof RegExp) {
            return node.value;
        } else if (typeof node.value === "string") {

            var parent = context.getAncestors().pop();
            if (parent.type === "NewExpression" && parent.callee.name === "RegExp") {
                return new RegExp(node.value);
            }
        } else {
            return null;
        }
        
    }



    return {

        "Literal": function(node) {

            var computedValue,
                regex = getRegExp(node);

            if (regex) {
                computedValue = regex.toString();
                if (/[\x00-\x1f]/.test(computedValue)) {
                    context.report(node, "Unexpected control character in regular expression.");
                }
            }
        }
    };

};
