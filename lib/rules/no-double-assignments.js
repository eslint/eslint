"use strict";

function getPrevNode(context, node) {
    var prevToken = context.getTokenBefore(node);
    if (prevToken) {
        return context.getNodeByRangeIndex(prevToken.range[0]);
    }
}

function expressionname(expression) {
    if (expression.type === "Identifier") {
        return expression.name;
    }

    if (expression.type === "MemberExpression") {
        return expressionname(expression.object) + "-" + expression.property.name;
    }
}

function varname(node) {
    if (!node || node.type !== "ExpressionStatement") {
        return null;
    }

    if (node.expression.type !== "AssignmentExpression") {
        return null;
    }

    return expressionname(node.expression.left);
}

function any(list, testCb) {
    for (var i = list.length - 1; i >= 0; i--) {
        if (testCb(list[i])) {
            return true;
        }
    }
    return false;
}

function includesname(name, expression) {
    if (expression.callee && includesname(name, expression.callee)) {
        return true;
    }

    if (expression.arguments && any(expression.arguments, includesname.bind(null, name))) {
        return true;
    }

    if (expression.left && includesname(name, expression.left)) {
        return true;
    }

    if (expression.right && includesname(name, expression.right)) {
        return true;
    }

    return (expressionname(expression) || "").substring(0, name.length) === name;
}

module.exports = function(context) {
    return {
        "ExpressionStatement": function(node) {
            if (node.expression.operator !== "=") {
                return;
            }

            var prev = getPrevNode(context, node);

            var name = varname(node);
            if (name && name === varname(prev) && !includesname(name, node.expression.right)) {
                context.report(
                    node.expression.left,
                    "Double assignment to the same variable, probably a mistake."
                );
            }
        }
    };
};

module.exports.schema = [];
