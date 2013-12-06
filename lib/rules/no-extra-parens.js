/**
 * @fileoverview Disallow parenthesesisng higher precedence subexpressions.
 * @author Michael Ficarra
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    function isParenthesised(node) {
        var tokens = context.getTokens(node, 1, 1),
            firstToken = tokens[0],
            lastToken = tokens[tokens.length - 1];
        return firstToken.value === "(" && firstToken.range[1] <= node.range[0] &&
            lastToken.value === ")" && lastToken.range[0] >= node.range[1];
    }

    function isParenthesisedTwice(node) {
        var tokens = context.getTokens(node, 2, 2),
            firstToken = tokens[0],
            lastToken = tokens[tokens.length - 1];
        return isParenthesised(node) &&
            firstToken.value === "(" && firstToken.range[1] <= node.range[0] &&
            lastToken.value === ")" && lastToken.range[0] >= node.range[1];
    }

    function precedence(node) {

        switch(node.type) {
            case "SequenceExpression":
                return 0;

            case "AssignmentExpression":
                return 1;

            case "ConditionalExpression":
                return 3;

            case "LogicalExpression":
                switch(node.operator) {
                    case "||":
                        return 4;
                    case "&&":
                        return 5;
                }

                /* falls through */
            case "BinaryExpression":
                switch(node.operator) {
                    case "|":
                        return 6;
                    case "^":
                        return 7;
                    case "&":
                        return 8;
                    case "==":
                    case "!=":
                    case "===":
                    case "!==":
                        return 9;
                    case "<":
                    case "<=":
                    case ">":
                    case ">=":
                    case "in":
                    case "instanceof":
                        return 10;
                    case "<<":
                    case ">>":
                    case ">>>":
                        return 11;
                    case "+":
                    case "-":
                        return 12;
                    case "*":
                    case "/":
                    case "%":
                        return 13;
                }
                /* falls through */
            case "UnaryExpression":
                return 14;
            case "UpdateExpression":
                return 15;
            case "CallExpression":
                return 16;
            case "NewExpression":
                return 17;
        }
        return 18;
    }

    function report(node) {
        context.report(node, "Gratuitous parentheses around expression.");
    }

    function dryUnaryUpdate(node) {
        if(isParenthesised(node.argument) && precedence(node.argument) >= precedence(node)) {
            report(node.argument);
        }
    }

    function dryCallNew(node) {
        if(isParenthesised(node.callee) && precedence(node.callee) >= precedence(node)) {
            report(node.callee);
        }
        if(node.arguments.length === 1) {
            if(isParenthesisedTwice(node.arguments[0]) && precedence(node.arguments[0]) >= precedence({type: "AssignmentExpression"})) {
                report(node.arguments[0]);
            }
        } else {
            [].forEach.call(node.arguments, function(arg){
                if(isParenthesised(arg) && precedence(arg) >= precedence({type: "AssignmentExpression"})) {
                    report(arg);
                }
            });
        }
    }

    function dryBinaryLogical(node) {
        var prec = precedence(node);
        if(isParenthesised(node.left) && precedence(node.left) >= prec) {
            report(node.left);
        }
        if(isParenthesised(node.right) && precedence(node.right) > prec) {
            report(node.right);
        }
    }

    return {
        "ArrayExpression": function(node) {
            [].forEach.call(node.elements, function(e) {
                if(e && isParenthesised(e) && precedence(e) >= precedence({type: "AssignmentExpression"})) {
                    report(e);
                }
            });
        },
        "AssignmentExpression": function(node) {
            if(isParenthesised(node.right) && precedence(node.right) >= precedence(node)) {
                report(node.right);
            }
        },
        "BinaryExpression": dryBinaryLogical,
        "CallExpression": dryCallNew,
        "ConditionalExpression": function(node) {
            if(isParenthesised(node.test) && precedence(node.test) >= precedence({type: "LogicalExpression", operator: "||"})) {
                report(node.test);
            }
            if(isParenthesised(node.consequent) && precedence(node.consequent) >= precedence({type: "AssignmentExpression"})) {
                report(node.consequent);
            }
            if(isParenthesised(node.alternate) && precedence(node.alternate) >= precedence({type: "AssignmentExpression"})) {
                report(node.alternate);
            }
        },
        "DoWhileStatement": function(node) {
            if(isParenthesisedTwice(node.test)) { report(node.test); }
        },
        "ExpressionStatement": function(node) {
            var tokens;
            if(isParenthesised(node.expression)) {
                tokens = context.getTokens(node.expression);
                if(tokens[0].value !== "function" && tokens[0].value !== "{") {
                    report(node.expression);
                }
            }
        },
        "ForInStatement": function(node) {
            if(isParenthesised(node.right)) { report(node.right); }
        },
        "ForStatement": function(node) {
            if(node.init && isParenthesised(node.init)) { report(node.init); }
            if(node.test && isParenthesised(node.test)) { report(node.test); }
            if(node.update && isParenthesised(node.update)) { report(node.update); }
        },
        "IfStatement": function(node) {
            if(isParenthesisedTwice(node.test)) { report(node.test); }
        },
        "LogicalExpression": dryBinaryLogical,
        "MemberExpression": function(node) {
            if(
                isParenthesised(node.object) &&
                precedence(node.object) >= precedence(node) &&
                (
                    node.computed ||
                    !(
                        node.object.type === "Literal" &&
                        typeof node.object.value === "number" &&
                        /^[0-9]+$/.test(context.getTokens(node.object)[0].value)
                    )
                )
            ) {
                report(node.object);
            }
        },
        "NewExpression": dryCallNew,
        "ObjectExpression": function(node) {
            [].forEach.call(node.properties, function(e) {
                var v = e.value;
                if(v && isParenthesised(v) && precedence(v) >= precedence({type: "AssignmentExpression"})) {
                    report(v);
                }
            });
        },
        "ReturnStatement": function(node) {
            if(node.argument && isParenthesised(node.argument)) { report(node.argument); }
        },
        "SequenceExpression": function(node) {
            [].forEach.call(node.expressions, function(e) {
                if(isParenthesised(e)) { report(e); }
            });
        },
        "SwitchCase": function(node) {
            if(node.test && isParenthesised(node.test)) { report(node.test); }
        },
        "SwitchStatement": function(node) {
            if(isParenthesisedTwice(node.discriminant)) { report(node.discriminant); }
        },
        "ThrowStatement": function(node) {
            if(isParenthesised(node.argument)) { report(node.argument); }
        },
        "UnaryExpression": dryUnaryUpdate,
        "UpdateExpression": dryUnaryUpdate,
        "VariableDeclarator": function(node) {
            if(node.init && isParenthesised(node.init) && precedence(node.init) >= precedence({type: "AssignmentExpression"})) {
                report(node.init);
            }
        },
        "WhileStatement": function(node) {
            if(isParenthesisedTwice(node.test)) { report(node.test); }
        },
        "WithStatement": function(node) {
            if(isParenthesisedTwice(node.object)) { report(node.object); }
        }
    };

};
