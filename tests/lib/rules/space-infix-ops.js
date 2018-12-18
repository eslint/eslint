/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/space-infix-ops"),
    RuleTester = require("../../../lib/testers/rule-tester"),
    parser = require("../../fixtures/fixture-parser");

const ruleTester = new RuleTester();

ruleTester.run("space-infix-ops", rule, {
    valid: [
        "a + b",
        "a + ++b",
        "a++ + b",
        "a++ + ++b",
        "a     + b",
        "(a) + (b)",
        "((a)) + ((b))",
        "(((a))) + (((b)))",
        "a + +b",
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
        { code: "a ** b", parserOptions: { ecmaVersion: 7 } },
        { code: "a|0", options: [{ int32Hint: true }] },
        { code: "a |0", options: [{ int32Hint: true }] },

        // Type Annotations
        { code: "function foo(a: number = 0) { }", parserOptions: { ecmaVersion: 6 }, parser: parser("type-annotations/function-parameter-type-annotation") },
        { code: "function foo(): Bar { }", parserOptions: { ecmaVersion: 6 }, parser: parser("type-annotations/function-return-type-annotation") },
        { code: "var foo: Bar = '';", parserOptions: { ecmaVersion: 6 }, parser: parser("type-annotations/variable-declaration-init-type-annotation") },
        { code: "const foo = function(a: number = 0): Bar { };", parserOptions: { ecmaVersion: 6 }, parser: parser("type-annotations/function-expression-type-annotation") },

        // TypeScript Type Aliases
        { code: "type Foo<T> = T;", parserOptions: { ecmaVersion: 6 }, parser: parser("typescript-parsers/type-alias") }
    ],
    invalid: [
        {
            code: "a+b",
            output: "a + b",
            errors: [{
                message: "Operator '+' must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a +b",
            output: "a + b",
            errors: [{
                message: "Operator '+' must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a+ b",
            output: "a + b",
            errors: [{
                message: "Operator '+' must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a||b",
            output: "a || b",
            errors: [{
                message: "Operator '||' must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ||b",
            output: "a || b",
            errors: [{
                message: "Operator '||' must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a|| b",
            output: "a || b",
            errors: [{
                message: "Operator '||' must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a=b",
            output: "a = b",
            errors: [{
                message: "Operator '=' must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a= b",
            output: "a = b",
            errors: [{
                message: "Operator '=' must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a =b",
            output: "a = b",
            errors: [{
                message: "Operator '=' must be spaced.",
                type: "AssignmentExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a?b:c",
            output: "a ? b:c",
            errors: [{
                message: "Operator '?' must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a?b : c",
            output: "a ? b : c",
            errors: [{
                message: "Operator '?' must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ? b:c",
            output: "a ? b : c",
            errors: [{
                message: "Operator ':' must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a? b : c",
            output: "a ? b : c",
            errors: [{
                message: "Operator '?' must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "a ?b : c",
            output: "a ? b : c",
            errors: [{
                message: "Operator '?' must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 3
            }]
        },
        {
            code: "a ? b: c",
            output: "a ? b : c",
            errors: [{
                message: "Operator ':' must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 6
            }]
        },
        {
            code: "a ? b :c",
            output: "a ? b : c",
            errors: [{
                message: "Operator ':' must be spaced.",
                type: "ConditionalExpression",
                line: 1,
                column: 7
            }]
        },
        {
            code: "var a=b;",
            output: "var a = b;",
            errors: [{
                message: "Operator '=' must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 6
            }]
        },
        {
            code: "var a= b;",
            output: "var a = b;",
            errors: [{
                message: "Operator '=' must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 6
            }]
        },
        {
            code: "var a =b;",
            output: "var a = b;",
            errors: [{
                message: "Operator '=' must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 7
            }]
        },
        {
            code: "var a = b, c=d;",
            output: "var a = b, c = d;",
            errors: [{
                message: "Operator '=' must be spaced.",
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
                message: "Operator '|' must be spaced.",
                type: "BinaryExpression",
                line: 1,
                column: 2
            }]
        },
        {
            code: "var output = test || (test && test.value) ||(test2 && test2.value);",
            output: "var output = test || (test && test.value) || (test2 && test2.value);",
            errors: [{
                message: "Operator '||' must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 43
            }]
        },
        {
            code: "var output = a ||(b && c.value) || (d && e.value);",
            output: "var output = a || (b && c.value) || (d && e.value);",
            errors: [{
                message: "Operator '||' must be spaced.",
                type: "LogicalExpression",
                line: 1,
                column: 16
            }]
        },
        {
            code: "var output = a|| (b && c.value) || (d && e.value);",
            output: "var output = a || (b && c.value) || (d && e.value);",
            errors: [{
                message: "Operator '||' must be spaced.",
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
                message: "Operator '=' must be spaced.",
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
                message: "Operator '=' must be spaced.",
                line: 1,
                column: 7,
                nodeType: "AssignmentPattern"
            }, {
                message: "Operator '=' must be spaced.",
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
                message: "Operator '=' must be spaced.",
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
                message: "Operator '**' must be spaced.",
                line: 1,
                column: 2,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "'foo'in{}",
            output: "'foo' in {}",
            errors: [{
                message: "Operator 'in' must be spaced.",
                line: 1,
                column: 6,
                nodeType: "BinaryExpression"
            }]
        },
        {
            code: "'foo'instanceof{}",
            output: "'foo' instanceof {}",
            errors: [{
                message: "Operator 'instanceof' must be spaced.",
                line: 1,
                column: 6,
                nodeType: "BinaryExpression"
            }]
        },

        // Type Annotations

        {
            code: "var a: Foo= b;",
            output: "var a: Foo = b;",
            errors: [{
                message: "Operator '=' must be spaced.",
                type: "VariableDeclarator",
                line: 1,
                column: 11
            }],
            parser: parser("type-annotations/variable-declaration-init-type-annotation-no-space")
        },
        {
            code: "function foo(a: number=0): Foo { }",
            output: "function foo(a: number = 0): Foo { }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Operator '=' must be spaced.",
                line: 1,
                column: 23,
                nodeType: "AssignmentPattern"
            }],
            parser: parser("type-annotations/function-declaration-type-annotation-no-space")
        }
    ]
});
