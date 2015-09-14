/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/space-infix-ops"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("space-infix-ops", rule, {
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
        { code: "const my_object = {key: 'value'};", ecmaFeatures: { blockBindings: true } },
        { code: "var {a = 0} = bar;", ecmaFeatures: { destructuring: true } },
        { code: "function foo(a = 0) { }", ecmaFeatures: { defaultParams: true } },
        { code: "a|0", options: [{ int32Hint: true }] },
        { code: "a |0", options: [{ int32Hint: true }] }
    ],
    invalid: [
        {
            code: "a+b",
            output: "a + b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a +b",
            output: "a + b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a+ b",
            output: "a + b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a||b",
            output: "a || b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ||b",
            output: "a || b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a|| b",
            output: "a || b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a=b",
            output: "a = b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a= b",
            output: "a = b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a =b",
            output: "a = b",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a?b:c",
            output: "a ? b:c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a?b : c",
            output: "a ? b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ? b:c",
            output: "a ? b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a? b : c",
            output: "a ? b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ?b : c",
            output: "a ? b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a ? b: c",
            output: "a ? b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ? b :c",
            output: "a ? b : c",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 7
            }]
        },
        {
            code: "var a=b;",
            output: "var a = b;",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 6
            }]
        },
        {
            code: "var a= b;",
            output: "var a = b;",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 6
            }]
        },
        {
            code: "var a =b;",
            output: "var a = b;",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 7
            }]
        },
        {
            code: "var a = b, c=d;",
            output: "var a = b, c = d;",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 13
            }]
        },
        {
            code: "a| 0",
            output: "a | 0",
            options: [{
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
            output: "var output = test || (test && test.value) || (test2 && test2.value);",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 43
            }]
        },
        {
            code: "var output = a ||(b && c.value) || (d && e.value);",
            output: "var output = a || (b && c.value) || (d && e.value);",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 16
            }]
        },
        {
            code: "var output = a|| (b && c.value) || (d && e.value);",
            output: "var output = a || (b && c.value) || (d && e.value);",
            errors: [{
                message: "Infix operators must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 15
            }]
        },
        {
            code: "const my_object={key: 'value'}",
            output: "const my_object = {key: 'value'}",
            ecmaFeatures: { blockBindings: true },
            errors: [{
                message: "Infix operators must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 16
            }]
        },
        {
            code: "var {a=0}=bar;",
            output: "var {a = 0} = bar;",
            ecmaFeatures: { destructuring: true },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 7,
                nodeType: "AssignmentPattern"
            }, {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 10,
                nodeType: "VariableDeclarator"
            }]
        },
        {
            code: "function foo(a=0) { }",
            output: "function foo(a = 0) { }",
            ecmaFeatures: { defaultParams: true },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 15,
                nodeType: "AssignmentPattern"
            }]
        }
    ]
});
