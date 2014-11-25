/**
 * @fileoverview Disallow use of multiple spaces.
 * @author Vignesh Anand aka vegetableman.
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var OPERATORS = [
        "*", "/", "%", "+", "-", "<<", ">>", ">>>", "<", "<=", ">", ">=", "in",
        "instanceof", "==", "!=", "===", "!==", "&", "^", "|", "&&", "||", "=",
        "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "^=", "|=",
        "?", ":", ","
    ], errOps = [];

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    /**
     * Reports an AST node as a rule violation.
     * @param {ASTNode} node The node to report.
     * @param {*} [value] The value to show in the error message.
     * @returns {void}
     * @private
     */
    function report(node, value) {
        value = (typeof value === "undefined") ? errOps.shift() : value;
        context.report(node, "Multiple spaces found around '{{value}}'.", {value: value});
    }

    /**
     * Checks whether the operator is in same line as two adjacent tokens.
     * @param {ASTNode} left The token left to the operator.
     * @param {ASTNode} right The token right to the operator.
     * @param {ASTNode} operator The operator.
     * @returns {boolean} True if the operator is on same line as two adjacent tokens.
     * @private
     */
    function isOperatorOnSameLine(left, right, operator) {
        return operator.loc.end.line === left.loc.end.line &&
                        operator.loc.end.line === right.loc.start.line;
    }

    /**
     * Checks whether two tokens are on the same line.
     * @param {ASTNode} left The leftmost token.
     * @param {ASTNode} right The rightmost token.
     * @returns {boolean} True if the tokens are on the same line, false if not.
     * @private
     */
    function isSameLine(left, right) {
        return left.loc.end.line === right.loc.start.line;
    }

    /**
     * Determines if a given token is a comma operator.
     * @param {ASTNode} token The token to check.
     * @returns {boolean} True if the token is a comma, false if not.
     * @private
     */
    function isComma(token) {
        return (token.type === "Punctuator") && (token.value === ",");
    }

    /**
     * Check whether there are multiple spaces around the operator.
     * @param {ASTNode} left The left token.
     * @param {ASTNode} right The right token.
     * @returns {boolean} True if there are multiple spaces between tokens, false if not.
     * @private
     */
    function isMultiSpaced(left, right) {
        return right.range[0] - left.range[1] > 1;
    }

    /**
     * Check whether there are multiple spaces around the operator.
     * @param {ASTNode} left The token left to the operator.
     * @param {ASTNode} right The token right to the operator.
     * @param {ASTNode} operator The operator.
     * @returns {boolean} Whether there are multiple spaces.
     * @private
     */
    function isOperatorMultiSpaced(left, right, operator) {
        return isMultiSpaced(left, operator) || isMultiSpaced(operator, right);
    }

    /**
     * Get tokens and validate the spacing.
     * @param {ASTNode} left The token left to the operator.
     * @param {ASTNode} right The token right to the operator.
     * @returns {boolean} Whether multiple spaces were found.
     * @private
     */
    function validateSpacing(left, right) {
        var tokens = context.getTokens({range: [left.range[1], right.range[0]]}, 1, 1),
            operator;

        for (var i = 1, l = tokens.length - 1; i < l; ++i) {
            left = tokens[i - 1];
            operator = tokens[i];
            right = tokens[i + 1];

            if (operator && operator.type === "Punctuator" && OPERATORS.indexOf(operator.value) >= 0 &&
                isOperatorOnSameLine(left, right, operator) && isOperatorMultiSpaced(left, right, operator)) {
                errOps.push(operator.value);
                return true;
            }
        }

        return false;
    }


    /**
     * Report if there are multiple spaces on the expression.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkExpression(node) {
        if (validateSpacing(node.left, node.right)) {
            report(node);
        }
    }

    /**
     * Report if there are multiple spaces around conditional ternary operators.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkConditional(node) {
        if (validateSpacing(node.test, node.consequent)) {
            report(node);
        }
        if (validateSpacing(node.consequent, node.alternate)) {
            report(node);
        }
    }

    /**
     * Report if there are multiple spaces around equal operator in variable declaration.
     * @param {ASTNode} node The node to check.
     * @returns {void}
     * @private
     */
    function checkVar(node) {
        if (node.init && validateSpacing(node.id, node.init)) {
            report(node);
        }
    }

    /**
     * Report if there are multiple spaces around list of items in objects, arrays,
     * function parameters, sequences and declarations.
     * @param {ASTNode} node The node to check.
     * @param {string} property The property of node.
     * @returns {void}
     * @private
     */
    function checkList(node, property) {
        var items = node[property];

        for (var i = 0, l = items.length; i < l; i++) {
            var left = items[i - 1] || context.getFirstToken(node),
                right = items[i] || context.getLastToken(node),
                operator = context.getTokenBefore(right);

            if (operator && operator.type === "Punctuator" && operator.value === ",") {
                if (isOperatorOnSameLine(left, right, operator) && isOperatorMultiSpaced(left, right, operator)) {
                    errOps.push(operator.value);
                    report(right);
                }
            }
        }
    }

    /**
     * Report if there are multiple spaces around list of items in objects, arrays,
     * function parameters, sequences and declarations.
     * @param {ASTNode} node The node to check.
     * @param {string} property The property of node.
     * @returns {void}
     * @private
     */
    function checkArray(node, property) {
        var items = node[property],
            left,
            right;

        for (var i = 0, l = items.length; i < l; i++) {

            // this can be null in the case of [,]
            left = items[i - 1];
            if (!left) {
                if (i === 0) {

                    // use the "[" token
                    left = context.getFirstToken(node);
                } else {

                    // use the last "right" value
                    left = right;
                }
            }

            right = items[i];
            if (right) {
                left = context.getTokenBefore(right);
            } else {
                right = context.getTokenAfter(left);
            }

            if (isSameLine(left, right) && isMultiSpaced(left, right)) {
                report(right, right.value);
            }
        }

        // one last check for any trailing commas
        right = context.getLastToken(node);
        left = context.getTokenBefore(right);

        if (isComma(left) && isSameLine(left, right) && isMultiSpaced(left, right)) {
            report(left, left.value);
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
        "ArrayExpression": function(node) {
            checkArray(node, "elements");
        },
        "ObjectExpression": function(node) {
            checkList(node, "properties");
        },
        "SequenceExpression": function(node) {
            checkList(node, "expressions");
        },
        "FunctionExpression": function(node) {
            checkList(node, "params");
        },
        "FunctionDeclaration": function(node) {
            checkList(node, "params");
        },
        "VariableDeclaration": function(node) {
            checkList(node, "declarations");
        }
    };

};
