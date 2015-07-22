/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/space-infix-ops", {
    valid: [
        "a + b",
        "a     + b",
        "(a) + (b)",
        "a + (b)",
        "a + +(b)",
        "a + (+(b))",
        "(a + b) + (c + d)",
        "a = b",
        "a ? b : c",
        "var a = b",
        { code: "a|0", args: [2, { int32Hint: true }] },
        { code: "a |0", args: [2, { int32Hint: true }] }
    ],
    invalid: [
        {
            code: "a+b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a +b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a+ b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a||b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ||b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a|| b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a=b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a= b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a =b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a?b:c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a?b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ? b:c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a? b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ?b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a ? b: c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ? b :c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 7
            }]
        },
        {
            code: "var a=b;",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 6
            }]
        },
        {
            code: "var a= b;",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 6
            }]
        },
        {
            code: "var a =b;",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 7
            }]
        },
        {
            code: "var a = b, c=d;",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 13
            }]
        },
        {
            code: "a| 0",
            args: [2, {
                int32Hint: true
            }],
            errors: [{
                message: "Infix operators must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "var output = test || (test && test.value) ||(test2 && test2.value);",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 43
            }]
        },
        {
            code: "var output = a ||(b && c.value) || (d && e.value);",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 16
            }]
        },
        {
            code: "var output = a|| (b && c.value) || (d && e.value);",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 15
            }]
        }
    ]
});
