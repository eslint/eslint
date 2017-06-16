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
        { code: "a|0", options: [{ int32Hint: true }] },
        { code: "a |0", options: [{ int32Hint: true }] },
        {
            code: "a + b",
            options: [{ exceptions: { BinaryExpression: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a+b",
            options: [{ exceptions: { BinaryExpression: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a + b",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a+b",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a+ b",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a +b",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a || b",
            options: [{ exceptions: { LogicalExpression: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a||b",
            options: [{ exceptions: { LogicalExpression: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a || b",
            options: [{ exceptions: { LogicalExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a||b",
            options: [{ exceptions: { LogicalExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a|| b",
            options: [{ exceptions: { LogicalExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a ||b",
            options: [{ exceptions: { LogicalExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a = b",
            options: [{ exceptions: { AssignmentExpression: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a=b",
            options: [{ exceptions: { AssignmentExpression: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a = b",
            options: [{ exceptions: { AssignmentExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a=b",
            options: [{ exceptions: { AssignmentExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a= b",
            options: [{ exceptions: { AssignmentExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a =b",
            options: [{ exceptions: { AssignmentExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a ? b : c",
            options: [{ exceptions: { ConditionalExpression: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a?b:c",
            options: [{ exceptions: { ConditionalExpression: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a ? b : c",
            options: [{ exceptions: { ConditionalExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a?b:c",
            options: [{ exceptions: { ConditionalExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a? b: c",
            options: [{ exceptions: { ConditionalExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a ?b :c",
            options: [{ exceptions: { ConditionalExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = b",
            options: [{ exceptions: { VariableDeclarator: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a=b",
            options: [{ exceptions: { VariableDeclarator: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = b",
            options: [{ exceptions: { VariableDeclarator: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a=b",
            options: [{ exceptions: { VariableDeclarator: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a= b",
            options: [{ exceptions: { VariableDeclarator: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a =b",
            options: [{ exceptions: { VariableDeclarator: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },

        {
            code: "var a = b, c = d",
            options: [{ exceptions: { VariableDeclarator: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = b,c = d",
            options: [{ exceptions: { VariableDeclarator: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a=b, c=d",
            options: [{ exceptions: { VariableDeclarator: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a=b,c=d",
            options: [{ exceptions: { VariableDeclarator: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a = b, c = d",
            options: [{ exceptions: { VariableDeclarator: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a=b, c=d",
            options: [{ exceptions: { VariableDeclarator: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a= b, c= d",
            options: [{ exceptions: { VariableDeclarator: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var a =b, c =d",
            options: [{ exceptions: { VariableDeclarator: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a = 0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a=0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a = 0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a=0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a= 0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var {a =0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a = 0) { }",
            options: [{ exceptions: { AssignmentPattern: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a=0) { }",
            options: [{ exceptions: { AssignmentPattern: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a = 0) { }",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a=0) { }",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a= 0) { }",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a =0) { }",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "a ** b",
            options: [{ exceptions: { BinaryExpression: "always" } }],
            parserOptions: { ecmaVersion: 7 }
        },
        {
            code: "a**b",
            options: [{ exceptions: { BinaryExpression: "never" } }],
            parserOptions: { ecmaVersion: 7 }
        },
        {
            code: "a ** b",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 7 }
        },
        {
            code: "a**b",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 7 }
        },
        {
            code: "a** b",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 7 }
        },
        {
            code: "a **b",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 7 }
        },
        {
            code: "'foo' in {}",
            options: [{ exceptions: { BinaryExpression: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo'in{}",
            options: [{ exceptions: { BinaryExpression: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo' in {}",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo'in{}",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo'in {}",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo' in{}",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo' instanceof {}",
            options: [{ exceptions: { BinaryExpression: "always" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo'instanceof{}",
            options: [{ exceptions: { BinaryExpression: "never" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo' instanceof {}",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo'instanceof{}",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo'instanceof {}",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "'foo' instanceof{}",
            options: [{ exceptions: { BinaryExpression: "ignore" } }],
            parserOptions: { ecmaVersion: 6 }
        }
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            code: "var {a = 0}=bar;",
            output: "var {a = 0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "always" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 12,
                nodeType: "VariableDeclarator"
            }]
        },
        {
            code: "var {a=0} = bar;",
            output: "var {a = 0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "always" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 7,
                nodeType: "AssignmentPattern"
            }]
        },
        {
            code: "var {a=0}=bar;",
            output: "var {a = 0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "always" } }],
            parserOptions: { ecmaVersion: 6 },
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
            code: "var {a=0}=bar;",
            output: "var {a=0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "never" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 10,
                nodeType: "VariableDeclarator"
            }]
        },
        {
            code: "var {a = 0} = bar;",
            output: "var {a=0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "never" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 8,
                nodeType: "AssignmentPattern"
            }]
        },
        {
            code: "var {a = 0}=bar;",
            output: "var {a=0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "never" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 8,
                nodeType: "AssignmentPattern"
            }, {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 12,
                nodeType: "VariableDeclarator"
            }]
        },
        {
            code: "var {a = 0}=bar;",
            output: "var {a = 0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 12,
                nodeType: "VariableDeclarator"
            }]
        },
        {
            code: "var {a=0}=bar;",
            output: "var {a=0} = bar;",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
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
                message: "Infix operators must be spaced.",
                line: 1,
                column: 15,
                nodeType: "AssignmentPattern"
            }]
        },
        {
            code: "function foo(a = 0) { return a/2; }",
            output: "function foo(a = 0) { return a / 2; }",
            options: [{ exceptions: { AssignmentPattern: "always" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 31,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "function foo(a=0) { return a / 2; }",
            output: "function foo(a = 0) { return a / 2; }",
            options: [{ exceptions: { AssignmentPattern: "always" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 15,
                nodeType: "AssignmentPattern"
            }]
        },
        {
            code: "function foo(a=0) { return a/2; }",
            output: "function foo(a = 0) { return a / 2; }",
            options: [{ exceptions: { AssignmentPattern: "always" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 15,
                nodeType: "AssignmentPattern"
            }, {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 29,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "function foo(a=0) { return a/2; }",
            output: "function foo(a=0) { return a / 2; }",
            options: [{ exceptions: { AssignmentPattern: "never" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 29,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "function foo(a = 0) { return a / 2; }",
            output: "function foo(a=0) { return a / 2; }",
            options: [{ exceptions: { AssignmentPattern: "never" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 16,
                nodeType: "AssignmentPattern"
            }]
        },
        {
            code: "function foo(a = 0) { return a/2; }",
            output: "function foo(a=0) { return a / 2; }",
            options: [{ exceptions: { AssignmentPattern: "never" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 16,
                nodeType: "AssignmentPattern"
            }, {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 31,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "function foo(a = 0) { return a/2; }",
            output: "function foo(a = 0) { return a / 2; }",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 31,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "function foo(a=0) { return a/2; }",
            output: "function foo(a=0) { return a / 2; }",
            options: [{ exceptions: { AssignmentPattern: "ignore" } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 29,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "a**b",
            output: "a ** b",
            parserOptions: { ecmaVersion: 7 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 2,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "'foo'in{}",
            output: "'foo' in {}",
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 6,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "'foo'instanceof{}",
            output: "'foo' instanceof {}",
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 6,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "var foo=function(a=0) { return a/2; }",
            output: "var foo = function(a = 0) { return a / 2; }",
            options: [{ exceptions: {
                VariableDeclarator: "always",
                AssignmentPattern: "always",
                BinaryExpression: "always"
            } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 8,
                nodetype: "VariableDeclarator"
            },
            {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 19,
                nodetype: "AssignmentPattern"
            },
            {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 33,
                nodetype: "BinaryExpression"
            }]
        },
        {
            code: "var foo = function(a = 0) { return a / 2; }",
            output: "var foo=function(a=0) { return a/2; }",
            options: [{ exceptions: {
                VariableDeclarator: "never",
                AssignmentPattern: "never",
                BinaryExpression: "never"
            } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 9,
                nodetype: "VariableDeclarator"
            },
            {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 22,
                nodetype: "AssignmentPattern"
            },
            {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 38,
                nodetype: "BinaryExpression"
            }]
        },
        {
            code: "var foo=function(a = 0) { return a/ 2; }",
            output: "var foo = function(a=0) { return a/ 2; }",
            options: [{ exceptions: {
                VariableDeclarator: "always",
                AssignmentPattern: "never",
                BinaryExpression: "ignore"
            } }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Infix operators must be spaced.",
                line: 1,
                column: 8,
                nodetype: "VariableDeclarator"
            },
            {
                message: "Infix operators must be spaced.",
                line: 1,
                column: 20,
                nodetype: "AssignmentPattern"
            }]
        }
    ]
});
