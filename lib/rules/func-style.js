/**
 * @fileoverview Rule to enforce a particular function style
 * @author Nicholas C. Zakas
 * @copyright 2013 Nicholas C. Zakas. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var style = context.options[0],
        enforceDeclarations = (style === "declaration"),
        stack = [];

    return {
        "Program": function() {
            stack = [];
        },

        "FunctionDeclaration": function(node) {
            stack.push(false);

            if (!enforceDeclarations) {
                context.report(node, "Expected a function expression.");
            }
        },
        "FunctionDeclaration:exit": function() {
            stack.pop();
        },

        "FunctionExpression": function(node) {
            stack.push(false);

            if (enforceDeclarations && node.parent.type === "VariableDeclarator") {
                context.report(node.parent, "Expected a function declaration.");
            }
        },
        "FunctionExpression:exit": function() {
            stack.pop();
        },

        "ArrowFunctionExpression": function() {
            stack.push(false);
        },
        "ArrowFunctionExpression:exit": function(node) {
            var hasThisExpr = stack.pop();

            if (enforceDeclarations && !hasThisExpr && node.parent.type === "VariableDeclarator") {
                context.report(node.parent, "Expected a function declaration.");
            }
        },

        "ThisExpression": function() {
            if (stack.length > 0) {
                stack[stack.length - 1] = true;
            }
        }
    };

};

module.exports.schema = [
    {
        "enum": ["declaration", "expression"]
    }
];
