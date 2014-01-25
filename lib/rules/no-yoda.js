/**
 * @fileoverview Rule to disallow yoda comparisons
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    function isComparisonOperator(operator) {
        return (/^(==|===|!=|!==|<|>|<=|>=)$/).test(operator);
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "BinaryExpression": function(node) {

            if (node.left.type === "Literal" && isComparisonOperator(node.operator)) {
                context.report(node, "Expected literal to be on the right side of " + node.operator + ".");
            }

        }
    };

};
