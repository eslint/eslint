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

var OPERATORS = [
    "*", "/", "%", "+", "-", "<<", ">>", ">>>", "<", "<=", ">", ">=", "in",
    "instanceof", "==", "!=", "===", "!==", "&", "^", "|", "&&", "||", "=",
    "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "^=", "|=",
    "?", ":", ","
];

/**
 * Checks whether the operator is in same line as two adjacent tokens.
 * @param {ASTNode} left The token left to the operator.
 * @param {ASTNode} right The token right to the operator.
 * @param {ASTNode} operator The operator.
 * @returns {boolean} Whether the operator is in same line as two adjacent tokens.
 */
function isSameLine(left, right, operator) {
    return operator.loc.end.line === left.loc.end.line &&
                    operator.loc.end.line === right.loc.start.line;
}

/**
 * Check whether there are multiple spaces around the operator.
 * @param {ASTNode} left The token left to the operator.
 * @param {ASTNode} right The token right to the operator.
 * @param {ASTNode} operator The operator.
 * @returns {boolean} Whether there are multiple spaces.
 */
function isMultiSpaced(left, right, operator) {
    return operator.range[0] - left.range[1] > 1 ||
            right.range[0] - operator.range[1] > 1;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    /**
     * Reports an AST node as a rule violation.
     * @param {ASTNode} node The node to report.
     * @param {String} operator The operator near the spacing error.
     * @returns {void}
     * @private
     */
    function report(node, operator) {
        context.report(node, "Multiple spaces found around '" + operator + "'.");
    }

    /**
     * Get tokens and validate the spacing.
     * @param {ASTNode} node The parent node, used for reporting.
     * @param {String} leftName Child node left of the operator.
     * @param {String} rightName Child node right of the operator.
     * @returns {void}
     * @private
     */
    function validateSpacing(node, leftName, rightName) {
        var left = node[leftName],
            right = node[rightName],
            tokens = context.getTokens({range: [left.range[1], right.range[0]]}, 1, 1),
            operator;

        for (var i = 1, l = tokens.length - 1; i < l; ++i) {
            left = tokens[i - 1];
            operator = tokens[i];
            right = tokens[i + 1];

            if (operator && operator.type === "Punctuator" && OPERATORS.indexOf(operator.value) >= 0 &&
                isSameLine(left, right, operator) && isMultiSpaced(left, right, operator)
            ) {
                report(node, operator.value);
            }
        }
    }

    /**
     * Report if there are multiple spaces on the expression.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkExpression(node) {
        validateSpacing(node, "left", "right");
    }

    /**
     * Report if there are multiple spaces around conditional ternary operators.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkConditional(node) {
        validateSpacing(node, "test", "consequent");
        validateSpacing(node, "consequent", "alternate");
    }

    /**
     * Report if there are multiple spaces around equal operator in variable declaration.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkVar(node) {
        if (node.init) {
            validateSpacing(node, "id", "init");
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
         * @param {string} property The property of node.
         * @returns {void}
         * @private
         */
        return function(node) {
            var items = node[property];

            for (var i = 0, l = items.length; i < l; i++) {
                var left = items[i - 1],
                    right = items[i],
                    operator = context.getTokenBefore(right);

                if (operator && operator.type === "Punctuator" && operator.value === ",") {
                    if (isSameLine(left, right, operator) && isMultiSpaced(left, right, operator)) {
                        report(right, operator.value);
                    }
                }
            }
        };
    }

    /**
     * Checks arrays literals, allowing that some elements may be empty.
     * @param {ASTNode} node An ArrayExpression.
     * @returns {void}
     */
    function checkArray(node) {
        var elements = node.elements,
            last = context.getLastToken(node),
            length = elements.length,
            missing = 0,
            previous = context.getFirstToken(node),
            ranges = [],
            el, i, tokens;

        /**
         * Pushes another range and sets the new previous token.
         * @param {Token} token The token on the right side of the range.
         * @returns {void}
         */
        function pushNext(token) {
            ranges.push([previous, token]);
            previous = token;
        }

        // Collect every element that might be multi-spaced into a list of range
        // pairs. For example, `[1, , 2 + 3]` becomes:
        // ```
        // [ ["[", "1"],
        //   ["1", ","],
        //   [",", ","],
        //   [",", "2"],
        //   ["3", "]"] ]
        // ```
        for (i = 0; i < length; i++) {
            el = elements[i];

            if (el) {
                tokens = context.getTokens(el, missing, 1);

                tokens.slice(0, missing).forEach(pushNext);
                ranges.push([previous, tokens[missing]]);
                ranges.push(tokens.slice(-2));

                previous = tokens[tokens.length - 1];
                missing = 0;
            } else {
                ++missing;
            }
        }

        if (!ranges.length) {
            // If the array had no child elements, fill ranges directly from its
            // tokens - the square brackets with any commas in between
            context.getTokens(node).slice(1).forEach(pushNext);
        } else if (ranges[ranges.length - 1][1] !== last) {
            // Ensure the last range ends with the array"s closing bracket
            ranges.push([previous, context.getLastToken(node)]);
        }

        ranges.forEach(function(range) {
            var left = range[0],
                right = range[1];

            if (left.loc.end.line === right.loc.start.line &&
                    right.range[0] - left.range[1] > 1) {
                report(left.type === "Punctuator" && left.value === ","
                    ? left : right, ",");
            }
        });
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
