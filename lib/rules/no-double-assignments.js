/**
 * @fileoverview Rule to catch accidental variable overwriting
 * @author Denis Sokolov
 * @copyright 2015 Denis Sokolov. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Identify an identifier respecting the object it belongs to
 * @param {Expression} expression Expression to inspect
 * @returns {string} The description of the identifier
 */
function getExpressionName(expression) {
    if (expression.type === "Identifier") {
        return expression.name;
    }

    if (expression.type === "MemberExpression") {
        return getExpressionName(expression.object) + "-" + expression.property.name;
    }

    return null;
}

/**
 * Identify the target of an assignment, if any
 * @param {ASTNode} node The Node to inspect
 * @returns {string} The description of the assignment target or null
 */
function getVarName(node) {
    if (!node || node.type !== "ExpressionStatement") {
        return null;
    }

    if (node.expression.type !== "AssignmentExpression") {
        return null;
    }

    return getExpressionName(node.expression.left);
}

/**
 * Check if any list members pass the predicate
 * @param {Array} list List to inspect
 * @param {Function} predicate Predicate to call
 * @returns {boolean} Whether any members passed the predicate
 */
function any(list, predicate) {
    for (var i = list.length - 1; i >= 0; i--) {
        if (predicate(list[i])) {
            return true;
        }
    }
    return false;
}

/**
 * Test whether an expression includes a particular name in the calculation
 * @param {string} name Name of the identifier
 * @param {Expression} expression Expression to inspect
 * @returns {boolean} Whether the expression includes the name
 */
function includesName(name, expression) {
    var includesIn = includesName.bind(null, name);

    if (expression.callee && includesIn(expression.callee)) {
        return true;
    }
    if (expression.arguments && any(expression.arguments, includesIn)) {
        return true;
    }

    if (expression.left && includesIn(expression.left)) {
        return true;
    }

    if (expression.right && includesIn(expression.right)) {
        return true;
    }

    if ((getExpressionName(expression) || "").substring(0, name.length) === name) {
        return true;
    }

    return false;
}

module.exports = function(context) {
    var sourceCode = context.getSourceCode();

    /**
     * Return a node previous to the current
     * @param {ASTNode} node The current Node
     * @returns {ASTNode} The previous node
     */
    function getPrevNode(node) {
        var prevToken = sourceCode.getTokenBefore(node);
        if (prevToken) {
            return sourceCode.getNodeByRangeIndex(prevToken.range[0]);
        }
        return null;
    }


    return {
        "ExpressionStatement": function(node) {
            // Only check assignments
            if (node.expression.operator !== "=") {
                return;
            }

            var name = getVarName(node);
            if (!name) {
                return;
            }

            // Only check assignments to the same variable in a row
            if (name !== getVarName(getPrevNode(node))) {
                return;
            }

            // Only check assignments where the intermediate value is unused
            if (includesName(name, node.expression.right)) {
                return;
            }

            context.report(
                node.expression.left,
                "Double assignment to the same variable, probably a mistake."
            );
        }
    };
};

module.exports.schema = [];
