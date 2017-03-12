/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    rule = require("../../../lib/rules/space-infix-ops"),
    RuleTester = require("../../../lib/testers/rule-tester");

const ruleTester = new RuleTester();

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
        { code: "const my_object = {key: 'value'};", parserOptions: { ecmaVersion: 6 } },
        { code: "var {a = 0} = bar;", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a = 0) { }", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a: number = 0) { }", parser: path.resolve(__dirname, "../../fixtures/parsers/flow-stub-parser.js"), parserOptions: { ecmaVersion: 6 } },
        { code: "a ** b", parserOptions: { ecmaVersion: 7 } },
        { code: "a ** b ** c", parserOptions: { ecmaVersion: 7 } },
        { code: "(-a) ** b ** c", parserOptions: { ecmaVersion: 7 } },
        { code: "-(a ** b ** c)", parserOptions: { ecmaVersion: 7 } },
        { code: "a**b", parserOptions: { ecmaVersion: 7 }, options: [{ "**": "never" }] },
        { code: "a**b**c", parserOptions: { ecmaVersion: 7 }, options: [{ "**": "never" }] },
        { code: "(-a)**b**c", parserOptions: { ecmaVersion: 7 }, options: [{ "**": "never" }] },
        { code: "-(a**b**c)", parserOptions: { ecmaVersion: 7 }, options: [{ "**": "never" }] },
        { code: "a|0", options: [{ int32Hint: true }] },
        { code: "a |0", options: [{ int32Hint: true }] },
        { code: "a + b-c * d*e", options: [{ "+": "always", "-": "never", "*": "ignore" }] },
        { code: "a + b-c * d*e", options: [{ all: "always", "+": "always", "-": "never", "*": "ignore" }] },
        { code: "a + b-c * d*e", options: [{ all: "never", "+": "always", "-": "never", "*": "ignore" }] },
        { code: "a + b-c * d*e", options: [{ all: "ignore", "+": "always", "-": "never", "*": "ignore" }] },
        { code: "a + b-c*d", options: { all: "never", "+": "always" } },
        { code: "foo in bar", options: { all: "never" } },
        { code: "foo instanceof bar", options: { all: "never" } },
        { code: "foo + +bar", options: { all: "never" } }
    ],
    invalid: [
        {
            code: "a+b",
            output: "a + b",
            errors: [{
                message: "Operator `+` must be surrounded by spaces.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a +b",
            output: "a + b",
            errors: [{
                message: "Operator `+` must be surrounded by spaces.",
                type: "BinaryExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a+ b",
            output: "a + b",
            errors: [{
                message: "Operator `+` must be surrounded by spaces.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a||b",
            output: "a || b",
            errors: [{
                message: "Operator `||` must be surrounded by spaces.",
                type: "LogicalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ||b",
            output: "a || b",
            errors: [{
                message: "Operator `||` must be surrounded by spaces.",
                type: "LogicalExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a|| b",
            output: "a || b",
            errors: [{
                message: "Operator `||` must be surrounded by spaces.",
                type: "LogicalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a=b",
            output: "a = b",
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                type: "AssignmentExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a= b",
            output: "a = b",
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                type: "AssignmentExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a =b",
            output: "a = b",
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                type: "AssignmentExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a?b:c",
            output: "a ? b:c",
            errors: [{
                message: "Operator `?` must be surrounded by spaces.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a?b : c",
            output: "a ? b : c",
            errors: [{
                message: "Operator `?` must be surrounded by spaces.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ? b:c",
            output: "a ? b : c",
            errors: [{
                message: "Operator `:` must be surrounded by spaces.",
                type: "ConditionalExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a? b : c",
            output: "a ? b : c",
            errors: [{
                message: "Operator `?` must be surrounded by spaces.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ?b : c",
            output: "a ? b : c",
            errors: [{
                message: "Operator `?` must be surrounded by spaces.",
                type: "ConditionalExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a ? b: c",
            output: "a ? b : c",
            errors: [{
                message: "Operator `:` must be surrounded by spaces.",
                type: "ConditionalExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ? b :c",
            output: "a ? b : c",
            errors: [{
                message: "Operator `:` must be surrounded by spaces.",
                type: "ConditionalExpression",
                line: 1,
                column: 7
            }]
        },
        {
            code: "var a=b;",
            output: "var a = b;",
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                type: "VariableDeclarator",
                line: 1,
                column: 6
            }]
        },
        {
            code: "var a= b;",
            output: "var a = b;",
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                type: "VariableDeclarator",
                line: 1,
                column: 6
            }]
        },
        {
            code: "var a =b;",
            output: "var a = b;",
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                type: "VariableDeclarator",
                line: 1,
                column: 7
            }]
        },
        {
            code: "var a = b, c=d;",
            output: "var a = b, c = d;",
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
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
                message: "Operator `|` must be surrounded by spaces.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "var output = test || (test && test.value) ||(test2 && test2.value);",
            output: "var output = test || (test && test.value) || (test2 && test2.value);",
            errors: [{
                message: "Operator `||` must be surrounded by spaces.",
                type: "LogicalExpression",
                line: 1,
                column: 43
            }]
        },
        {
            code: "var output = a ||(b && c.value) || (d && e.value);",
            output: "var output = a || (b && c.value) || (d && e.value);",
            errors: [{
                message: "Operator `||` must be surrounded by spaces.",
                type: "LogicalExpression",
                line: 1,
                column: 16
            }]
        },
        {
            code: "var output = a|| (b && c.value) || (d && e.value);",
            output: "var output = a || (b && c.value) || (d && e.value);",
            errors: [{
                message: "Operator `||` must be surrounded by spaces.",
                type: "LogicalExpression",
                line: 1,
                column: 15
            }]
        },
        {
            code: "const my_object={key: 'value'}",
            output: "const my_object = {key: 'value'}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                type: "VariableDeclarator",
                line: 1,
                column: 16
            }]
        },
        {
            code: "var {a=0}=bar;",
            output: "var {a = 0} = bar;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                line: 1,
                column: 7,
                nodeType: "AssignmentPattern"
            }, {
                message: "Operator `=` must be surrounded by spaces.",
                line: 1,
                column: 10,
                nodeType: "VariableDeclarator"
            }]
        },
        {
            code: "function foo(a=0) { }",
            output: "function foo(a = 0) { }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Operator `=` must be surrounded by spaces.",
                line: 1,
                column: 15,
                nodeType: "AssignmentPattern"
            }]
        },
        {
            code: "a**b",
            output: "a ** b",
            parserOptions: { ecmaVersion: 7 },
            errors: [{
                message: "Operator `**` must be surrounded by spaces.",
                line: 1,
                column: 2,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "a ** b",
            output: "a**b",
            options: { "**": "never" },
            parserOptions: { ecmaVersion: 7 },
            errors: [{
                message: "Operator `**` must not be surrounded by spaces.",
                line: 1,
                column: 2,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "'foo'in{}",
            output: "'foo' in {}",
            errors: [{
                message: "Operator `in` must be surrounded by spaces.",
                line: 1,
                column: 6,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "'foo'instanceof{}",
            output: "'foo' instanceof {}",
            errors: [{
                message: "Operator `instanceof` must be surrounded by spaces.",
                line: 1,
                column: 6,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "a+b - c",
            options: { all: "never", "+": "always" },
            output: "a + b-c",
            errors: [{
                message: "Operator `+` must be surrounded by spaces.",
                line: 1,
                column: 2,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "foo.bar+baz",
            output: "foo.bar + baz",
            errors: [{
                message: "Operator `+` must be surrounded by spaces.",
                line: 1,
                column: 8,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "foo+ +bar",
            output: "foo + +bar",
            errors: [{
                message: "Operator `+` must be surrounded by spaces.",
                line: 1,
                column: 4,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "foo- -bar",
            output: "foo - -bar",
            errors: [{
                message: "Operator `-` must be surrounded by spaces.",
                line: 1,
                column: 4,
                nodeType: "BinaryExpression"
            }]
        }
    ]
});
