/**
 * @fileoverview Rule to flag bitwise identifiers
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var options = context.options;

    // Remove the allow from each allowed option and force lowercase.
    var allowed = (options[0] || "").split(",").map(function map(exception) {
        return exception.replace("allow-", "").toLowerCase();
    });

    var BITWISE_OPERATORS = {
        "^": "xor",
        "|": "or",
        "&": "and",
        "<<": "leftshift",
        ">>": "rightshift",
        ">>>": "zerofill-rightshift",
        "^=": "xor-assign",
        "|=": "or-assign",
        "&=": "and-assign",
        "<<=": "leftshift-assign",
        ">>=": "rightshift-assign",
        ">>>=": "zerofill-rightshift-assign",
        "~": "not"
    };

    /**
     * Reports an unexpected use of a bitwise operator.
     * @param   {ASTNode} node Node which contains the bitwise operator.
     * @returns {void}
     */
    function report(node) {
        context.report(node, "Unexpected use of '{{operator}}'.", { operator: node.operator });
    }

    /**
     * Checks if the given node has a bitwise operator.
     * @param   {ASTNode} node The node to check.
     * @returns {boolean} Whether or not the node has a bitwise operator.
     */
    function hasBitwiseOperator(node) {
        return Object.keys(BITWISE_OPERATORS).indexOf(node.operator) !== -1;
    }

    /**
     * Checks if exceptions were provided, e.g. `allow-not, allow-or`.
     * @param   {ASTNode} node The node to check.
     * @returns {boolean} Whether or not the node has a bitwise operator.
     */
    function allowedOperator(node) {
        return allowed.some(function some(exception) {
            return exception === BITWISE_OPERATORS[node.operator];
        });
    }

    /**
     * Report if the given node contains a bitwise operator.
     * @param   {ASTNode} node The node to check.
     * @returns {void}
     */
    function checkNodeForBitwiseOperator(node) {
        if (hasBitwiseOperator(node) && !allowedOperator(node)) {
            report(node);
        }
    }

    return {
        "AssignmentExpression": checkNodeForBitwiseOperator,
        "BinaryExpression": checkNodeForBitwiseOperator,
        "UnaryExpression": checkNodeForBitwiseOperator
    };

};

module.exports.schema = [];
