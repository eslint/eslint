/**
 * @fileoverview Disallow use of multiple spaces.
 * @author Vignesh Anand aka vegetableman.
 * @copyright 2014 Vignesh Anand. All rights reserved.
 * @copyright 2014 Brandon Mills. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var OPERATORS = {
    "Punctuator": {
        "*": true, "/": true, "%": true, "+": true, "-": true, "<<": true,
        ">>": true, ">>>": true, "<": true, "<=": true, ">": true, ">=": true,
        "==": true, "!=": true, "===": true, "!==": true, "&": true, "^": true,
        "|": true, "&&": true, "||": true, "=": true, "+=": true, "-=": true,
        "*=": true, "/=": true, "%=": true, "<<=": true, ">>=": true,
        ">>>=": true, "&=": true, "^=": true, "|=": true, "?": true, ":": true,
        ",": true
    },
    "Keyword": {
        "in": true,
        "instanceof": true
    }
};

/**
 * Determines whether a token is a binary operator.
 * @param   {Token}   token The token.
 * @returns {Boolean}       Whether the token is a binary operator.
 */
function isOperator(token) {
    var type = OPERATORS[token.type];
    return (type && type[token.value]) || false;
}

/**
 * Gets the index of the first element of an array that satisfies a predicate.
 * Like Array.prototype.indexOf(), but with a predicate instead of equality.
 * @param   {Array}    array     An array to search.
 * @param   {Function} predicate A function returning true if its argument
 *                               satisfies a condition.
 * @returns {Number}             The index of the first element that satisifies
 *                               the predicate, or -1 if no elements match.
 */
function findIndex(array, predicate) {
    for (var i = 0, l = array.length; i < l; i++) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    /**
     * Validates that two adjacent tokens are separated by less than two spaces.
     * @param   {Token} left  Token on the left side.
     * @param   {Token} right Token on the right side.
     * @returns {void}
     */
    function validate(left, right) {
        var op;

        if (
            left.loc.end.line === right.loc.start.line &&
            right.range[0] - left.range[1] > 1
        ) {
            op = isOperator(left) ? left : right;
            context.report(op, "Multiple spaces found {{side}} '{{op}}'.", {
                side: op === right ? "before" : "after",
                op: op.value
            });
        }
    }

    /**
     * Validates the spacing of two nodes with an operator between them.
     * @param   {ASTNode} left  Node left of the operator.
     * @param   {ASTNode} right Node right of the operator.
     * @returns {void}
     */
    function validateBetween(left, right) {
        var tokens = context.getTokensBetween(left, right, 1),
            operatorIndex = findIndex(tokens.slice(1, -1), isOperator) + 1,
            op = tokens[operatorIndex];

        validate(tokens[operatorIndex - 1], op);
        validate(op, tokens[operatorIndex + 1]);
    }

    /**
     * Report if there are multiple spaces on the expression.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkExpression(node) {
        validateBetween(node.left, node.right);
    }

    /**
     * Report if there are multiple spaces around conditional ternary operators.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkConditional(node) {
        validateBetween(node.test, node.consequent);
        validateBetween(node.consequent, node.alternate);
    }

    /**
     * Report if there are multiple spaces around equal operator in variable declaration.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkVar(node) {
        if (node.init) {
            validateBetween(node.id, node.init);
        }
    }

    /**
     * Generates a function to check object literals and other list-like nodes.
     * @param {String} property Name of the node's collection property.
     * @returns {Function} A function that checks spacing within list-like node.
     * @private
     */
    function checkList(property) {
        /**
         * Report if there are multiple spaces around list of items in objects,
         * function parameters, sequences and declarations.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         * @private
         */
        return function(node) {
            var items = node[property];

            for (var i = 0, l = items.length; i < l - 1; i++) {
                validateBetween(items[i], items[i + 1]);
            }
        };
    }

    /**
     * Checks arrays literals, allowing that some elements may be empty.
     * @param {ASTNode} node An ArrayExpression.
     * @returns {void}
     * @private
     */
    function checkArray(node) {
        var elements = node.elements,
            elementIndex = 0,
            tokens = context.getTokens(node),
            tokenIndex = 0,
            length = tokens.length,
            dest;

        // Check spacing at the beginning, around commas, and at the end
        while (tokenIndex < length - 1) {
            validate(tokens[tokenIndex], tokens[++tokenIndex]);

            // Don't advance to the next element until both sides of the comma
            // have been checked
            if (tokens[tokenIndex].value !== ",") {
                // Skip to just before the end of the array or the next comma
                if (elements[elementIndex]) {
                    dest = elements[elementIndex].range[1];
                    // Move to the end of the element
                    while (tokens[tokenIndex].range[1] < dest) {
                        ++tokenIndex;
                    }
                    // Move past anything (like closing parens) between the end
                    // of the node and the following comma or end brace.
                    while (
                        tokenIndex + 1 < tokens.length &&
                        tokens[tokenIndex + 1].value !== ","
                    ) {
                        ++tokenIndex;
                    }
                }
                ++elementIndex;
            }
        }
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        "AssignmentExpression": checkExpression,
        "BinaryExpression": checkExpression,
        "LogicalExpression": checkExpression,
        "ConditionalExpression": checkConditional,
        "VariableDeclarator": checkVar,
        "ArrayExpression": checkArray,
        "ObjectExpression": checkList("properties"),
        "SequenceExpression": checkList("expressions"),
        "FunctionExpression": checkList("params"),
        "FunctionDeclaration": checkList("params"),
        "VariableDeclaration": checkList("declarations")
    };

};
