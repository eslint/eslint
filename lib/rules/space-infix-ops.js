/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var int32Hint = context.options[0] ? context.options[0].int32Hint === true : false;

    var OPERATORS = [
        "*", "/", "%", "+", "-", "<<", ">>", ">>>", "<", "<=", ">", ">=", "in",
        "instanceof", "==", "!=", "===", "!==", "&", "^", "|", "&&", "||", "=",
        "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", ">>>=", "&=", "^=", "|=",
        "?", ":", ","
    ];

    function isSpaced(left, right) {
        var op, tokens = context.getTokensBetween(left, right, 1);
        for (var i = 1, l = tokens.length - 1; i < l; ++i) {
            op = tokens[i];
            if (
                op.type === "Punctuator" &&
                OPERATORS.indexOf(op.value) >= 0 &&
                (tokens[i - 1].range[1] >= op.range[0] || op.range[1] >= tokens[i + 1].range[0])
            ) {
                return false;
            }
        }
        return true;
    }

    function report(node) {
        context.report(node, "Infix operators must be spaced.");
    }

    function checkBinary(node) {
        if (!isSpaced(node.left, node.right)) {
            if (!(int32Hint && context.getSource(node).substr(-2) === "|0")) {
                report(node);
            }
        }
    }

    function checkConditional(node) {
        if (!isSpaced(node.test, node.consequent) || !isSpaced(node.consequent, node.alternate)) {
            report(node);
        }
    }

    function checkVar(node) {
        if (node.init && !isSpaced(node.id, node.init)) {
            report(node);
        }
    }

    return {
        "AssignmentExpression": checkBinary,
        "BinaryExpression": checkBinary,
        "LogicalExpression": checkBinary,
        "ConditionalExpression": checkConditional,
        "VariableDeclarator": checkVar
    };

};
