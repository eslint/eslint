/**
 * @fileoverview Rule to flag statements that use != and == instead of !== and ===
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    "use strict";

    /**
     * Checks if either operand of a binary expression is a typeof operation
     * @param {ASTNode} node The node to check
     * @returns {boolean} if one of the operands is typeof
     * @private
     */
    function isTypeOf(node) {
        return [node.left, node.right].some(function(node) {
            return node.type === "UnaryExpression" && node.operator === "typeof";
        });
    }

    /**
     * Checks if operands are literals of the same type (via typeof)
     * @param {ASTNode} node The node to check
     * @returns {boolean} if operands are of same type
     * @private
     */
    function areLiteralsAndSameType(node) {
        return node.left.type === "Literal" && node.right.type === "Literal" &&
                typeof node.left.value === typeof node.right.value;
    }

    /**
     * Checks if operands are both null
     * @param {ASTNode} node The node to check
     * @returns {boolean} if operands are null
     * @private
     */
    function isNullCheck(node) {
        return (node.right.type === "Literal" && node.right.value === null) ||
                (node.left.type === "Literal" && node.left.value === null);
    }

    /**
     * Gets the location (line and column) of the binary expression's operator
     * @param {ASTNode} node The binary expression node to check
     * @param {String} operator The operator to find
     * @returns {Object} { line, column } location of operator
     * @private
     */
    function getLocation(node, operator) {
        var source, pos, operatorPos, line, column;

        source = context.getSource(node);
        line = node.loc.start.line;
        pos = 0;

        // Count lines to end of left expression
        while (line < node.left.loc.end.line) {
            pos = source.indexOf("\n", pos) + 1;
            line += 1;
        }
        pos += node.left.loc.end.column;

        operatorPos = source.indexOf(operator, pos);

        // Count lines to operator
        while ((pos = source.indexOf("\n", pos) + 1) !== 0) {
            line += 1;
            if (pos > operatorPos) {
                line -= 1;
                break;
            }
        }

        // Backtrack to the last newline (if any) to get column
        column = operatorPos - (source.lastIndexOf("\n", operatorPos) + 1);

        return {
            line: line,
            column: column
        };
    }

    return {
        "BinaryExpression": function(node) {
            var operator = node.operator,
                message;

            if (context.options[0] === "smart" && (isTypeOf(node) ||
                    areLiteralsAndSameType(node)) || isNullCheck(node)) {
                return;
            }

            if (context.options[0] === "allow-null" && isNullCheck(node)) {
                return;
            }

            if (operator === "==") {
                message = "Expected '===' and instead saw '=='.";
                context.report(node, getLocation(node, "=="), message);
            } else if (operator === "!=") {
                message = "Expected '!==' and instead saw '!='.";
                context.report(node, getLocation(node, "!="), message);
            }
        }
    };

};
