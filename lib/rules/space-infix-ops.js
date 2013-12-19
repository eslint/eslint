/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
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
    ];

    function isSpaced(left, right) {
        var op, tokens = context.getTokens({range: [left.range[1], right.range[0]]}, 1, 1);
        for(var i = 1, l = tokens.length - 1; i < l; ++i) {
            op = tokens[i];
            if(
                op.type === "Punctuator" &&
                OPERATORS.indexOf(op.value) >= 0 &&
                (tokens[i - 1].range[1] >= op.range[0] || op.range[1] >= tokens[i + 1].range[0])
            ) {
                return false;
            }
        }
        return true;
    }

    function isRightSpaced(left, right) {
        var op, tokens = context.getTokens({range: [left.range[1], right.range[0]]}, 1, 1);
        for(var i = 1, l = tokens.length - 1; i < l; ++i) {
            op = tokens[i];
            if(
                op.type === "Punctuator" &&
                OPERATORS.indexOf(op.value) >= 0 &&
                op.range[1] >= tokens[i + 1].range[0]
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
        if(!isSpaced(node.left, node.right)) { report(node); }
    }

    function checkSequence(node) {
        for(var i = 0, l = node.expressions.length - 1; i < l; ++i) {
            if(!isRightSpaced(node.expressions[i], node.expressions[i + 1])) {
                report(node);
                break;
            }
        }
    }

    function checkConditional(node) {
        if(!isSpaced(node.test, node.consequent) || !isSpaced(node.consequent, node.alternate)) {
            report(node);
        }
    }

    function checkVar(node) {
        if(node.init && !isSpaced(node.id, node.init)) {
            report(node);
        }
    }

    return {
        "AssignmentExpression": checkBinary,
        "BinaryExpression": checkBinary,
        "LogicalExpression": checkBinary,
        "ConditionalExpression": checkConditional,
        "SequenceExpression": checkSequence,
        "VariableDeclarator": checkVar
    };

};
