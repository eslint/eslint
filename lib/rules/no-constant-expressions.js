/**
 * @fileoverview Rule to prevent boolean expression logic errors
 * @author Denis Sokolov
 */

"use strict";

var staticEval = require("static-eval");

var EVAL_FAILED = {};

function evaluate(node, env) {
    try {
        return staticEval(node, env);
    } catch (err) {
        return EVAL_FAILED;
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/* eslint-disable curly, valid-jsdoc */

function unique(list) {
    return list.filter(function(elem, pos) {
        return list.indexOf(elem) === pos;
    });
}

function delta(num) {
    num = num || 1;
    return num * 0.000000000000001;
}


var ARITHMETIC_OPERATORS = "&,|,<,<=,>,>=,===,==,!=,!==".split(",");

function findArithmeticComparison(node) {
    if (ARITHMETIC_OPERATORS.indexOf(node.operator) === -1)
        return false;

    function attempt(idnode, numnode, op) {
        if (idnode.type !== "Identifier") return false;
        if (numnode.type !== "Literal" || typeof numnode.value !== "number") return false;
        return [idnode.name, numnode.value, op];
    }

    function reverse(op) {
        if (op === "<") return ">";
        if (op === "<=") return ">=";
        if (op === ">") return "<";
        if (op === ">=") return "<=";
        return op;
    }

    return attempt(node.left, node.right, node.operator) ||
        attempt(node.right, node.left, reverse(node.operator));
}

function isLiteralValue(node, value) {
    return node.type === "Literal" && node.value === value;
}

function isOnlyLiteralStrings(node) {
    return (node.type === "Literal" && typeof node.value === "string") ||
        (node.type === "BinaryExpression" && isOnlyLiteralStrings(node.left) && isOnlyLiteralStrings(node.right));
}

function isSameIdentifier(left, right) {
    return left.type === "Identifier" && right.type === "Identifier" &&
        left.name === right.name;
}

function findBinaryTautologies(node) {
    if (node.operator === "*") {
        if (node.left.type === "Identifier" && isLiteralValue(node.right, 0))
            return node.left.name;
        if (node.right.type === "Identifier" && isLiteralValue(node.left, 0))
            return node.right.name;
    }
    if (node.operator === "/") {
        if (isSameIdentifier(node.left, node.right)) {
            return node.left.name;
        }
    }
    if ("==,===,!=,!==".indexOf(node.operator) > -1) {
        if (isSameIdentifier(node.left, node.right))
            return node.left.name;
    }
}

/**
 * Finds all identifiers in the expression with a list of values with should try out:
 * @returns [
 *   { name: "isFoo", values: [true, false] },
 *   { name: "bar", values: [1, 0, -1] }
 * ]
 */
function findIdentifiers(topNode) {
    var result = {};

    function push(arg, values) {
        if (typeof arg !== "string") {
            if (arg.type !== "Identifier") {
                descend(arg); // eslint-disable-line no-use-before-define
                return;
            }
            arg = arg.name;
        }
        var name = arg;
        if (!result[name]) {
            result[name] = [];
        }
        if (values.length === 0) {
            result.noconstantexpressionfail = [];
        }
        result[name] = result[name].concat(values);
    }

    function pushBoolean(arg) {
        push(arg, [true, false]);
    }

    function descend(node) {
        if (node.type === "LogicalExpression") {
            descend(node.left);
            descend(node.right);
            return;
        }
        if (node.type === "UnaryExpression") {
            if (node.operator === "!") {
                pushBoolean(node.argument);
                return;
            }
            descend(node.argument);
            return;
        }
        if (node.type === "BinaryExpression") {
            var arithmComp = findArithmeticComparison(node);
            if (arithmComp) {
                var name = arithmComp[0];
                var val = arithmComp[1];
                var op = arithmComp[2];
                if (op === "<") push(name, [val - delta(val), val]);
                else if (op === "<=") push(name, [val, val + delta(val)]);
                else if (op === ">") push(name, [val + delta(val), val]);
                else if (op === ">=") push(name, [val, val - delta(val)]);
                else push(name, [val, val + 1]);
                return;
            }

            var arithmTaut = findBinaryTautologies(node);
            if (arithmTaut) {
                push(arithmTaut, [1]);
                return;
            }

            if ((node.operator === "===" || node.operator === "!==") &&
                node.left.type === "Identifier" && node.right.type === "Identifier"
            ) {
                pushBoolean(node.left);
                pushBoolean(node.right);
                return;
            }

            descend(node.left);
            descend(node.right);
            return;
        }
        if (node.type === "Identifier") {
            push(node.name, []);
            return;
        }
        if (node.type === "Literal") {
            return;
        }
        if (node.type === "ArrayExpression") {
            node.elements.forEach(descend);
            return;
        }
        if (node.type === "CallExpression") {
            push("!dummy-callee-confusing", []);
            return;
        }
        if (node.type === "AssignmentExpression") {
            push("!dummy-assign-not-supported", []);
            return;
        }
        if (node.type === "ConditionalExpression") {
            if (node.test.type === "Identifier") {
                pushBoolean(node.test);
            } else {
                descend(node.test);
            }
            descend(node.consequent);
            descend(node.alternate);
            return;
        }

        push("!dummy-unknown-expression", []);
    }

    descend(topNode);

    return Object.keys(result).map(function(name) {
        return {
            name: name,
            values: unique(result[name])
        };
    });
}

function permutations(idents) {
    var counter = 1;
    var identsWithCounters = idents.map(function(ident) {
        var i = {
            name: ident.name,
            values: ident.values,
            permutationsBefore: counter
        };
        counter *= ident.values.length;
        return i;
    });
    return (new Array(counter)).join().split(",").map(function(_, iteration) {
        var env = {};
        identsWithCounters.forEach(function(ident) {
            env[ident.name] = ident.values[
                Math.floor(iteration / ident.permutationsBefore) % (ident.values.length)
            ];
        });
        return env;
    });
}

function find(arr, cb) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (cb(arr[i])) {
            return true;
        }
    }
    return false;
}

module.exports = function(context) {
    var warnedParents = [];

    function warned(node) {
        if (node.type !== "BinaryExpression" && node.type !== "LogicalExpression") {
            return false;
        }
        var found = find(warnedParents, function(p) {
            return node === p;
        });
        if (found) {
            return true;
        }
        return warned(node.parent);
    }

    function report(node, result) {
        if (result === EVAL_FAILED) return;
        context.report(node, "Expression always " + result);
        warnedParents.push(node);
    }

    function check(node) {
        if (warned(node.parent)) {
            return;
        }

        var idents = findIdentifiers(node);
        if (idents.length === 0) {
            if (isOnlyLiteralStrings(node)) {
                return;
            }
            report(node, evaluate(node, {}));
            return;
        }

        var noInformationAboutSomeidents = find(idents, function(ident) {
            return ident.values.length === 0;
        });
        if (noInformationAboutSomeidents) {
            return;
        }

        var perms = permutations(idents);
        var result = evaluate(node, perms[0]);
        var foundDifferentResult = find(perms.slice(1), function(env) {
            return evaluate(node, env) !== result;
        });
        if (!foundDifferentResult) {
            report(node, result);
            return;
        }
    }

    return {
        "BinaryExpression": check,
        "LogicalExpression": check
    };
};
