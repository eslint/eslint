/**
 * @fileoverview Rule to require or disallow yoda comparisons
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function (context) {

    // Default to "never" (!always) if no option

    var always = (context.options[0] === "always");

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Determines whether an operator is a comparison operator.
     * @param {String} operator The operator to check.
     * @returns {Boolean} Whether or not it is a comparison operator.
     */
    function isComparisonOperator(operator) {
        return (/^(==|===|!=|!==|<|>|<=|>=)$/).test(operator);
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {

        "BinaryExpression": function (node) {

            if (always) {

                // Comparisons must always be yoda-style: if ("blue" === color)

                if (node.right.type === "Literal" && isComparisonOperator(node.operator)) {
                    context.report(node, "Expected literal to be on the left side of " + node.operator + ".");
                }

            } else {

                // Comparisons must never be yoda-style (default)

                if (node.left.type === "Literal" && isComparisonOperator(node.operator)) {
                    context.report(node, "Expected literal to be on the right side of " + node.operator + ".");
                }

            }

        }

    };

};
