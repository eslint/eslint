/**
 * @fileoverview Tests for consistent-return rule.
 * @author Raphael Pigulla
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/consistent-return"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("consistent-return", rule, {

    valid: [
        "function foo() { return; }",
        "function foo() { if (true) return; }",
        "function foo() { if (true) return; else return; }",
        "function foo() { if (true) return true; else return false; }",
        "f(function() { return; })",
        "f(function() { if (true) return; })",
        "f(function() { if (true) return; else return; })",
        "f(function() { if (true) return true; else return false; })",
        "function foo() { function bar() { return true; } return; }",
        "function foo() { function bar() { return; } return false; }",
        "function Foo() { if (!(this instanceof Foo)) return new Foo(); }",
        { code: "function foo() { if (true) return; else return undefined; }", options: [{ treatUndefinedAsUnspecified: true }] },
        { code: "function foo() { if (true) return; else return void 0; }", options: [{ treatUndefinedAsUnspecified: true }] },
        { code: "function foo() { if (true) return undefined; else return; }", options: [{ treatUndefinedAsUnspecified: true }] },
        { code: "function foo() { if (true) return undefined; else return void 0; }", options: [{ treatUndefinedAsUnspecified: true }] },
        { code: "function foo() { if (true) return void 0; else return; }", options: [{ treatUndefinedAsUnspecified: true }] },
        { code: "function foo() { if (true) return void 0; else return undefined; }", options: [{ treatUndefinedAsUnspecified: true }] },
        { code: "var x = () => {  return {}; };", parserOptions: { ecmaVersion: 6 } },
        { code: "if (true) { return 1; } return 0;", parserOptions: { ecmaVersion: 6, ecmaFeatures: { globalReturn: true } } },

        // https://github.com/eslint/eslint/issues/7790
        { code: "class Foo { constructor() { if (true) return foo; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "var Foo = class { constructor() { if (true) return foo; } }", parserOptions: { ecmaVersion: 6 } }
    ],

    invalid: [
        {
            code: "function foo() { if (true) return true; else return; }",
            errors: [
                {
                    messageId: "missingReturnValue",
                    data: { name: "Function 'foo'" },
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "var foo = () => { if (true) return true; else return; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingReturnValue",
                    data: { name: "Arrow function" },
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "function foo() { if (true) return; else return false; }",
            errors: [
                {
                    messageId: "unexpectedReturnValue",
                    data: { name: "Function 'foo'" },
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "f(function() { if (true) return true; else return; })",
            errors: [
                {
                    messageId: "missingReturnValue",
                    data: { name: "Function" },
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "f(function() { if (true) return; else return false; })",
            errors: [
                {
                    messageId: "unexpectedReturnValue",
                    data: { name: "Function" },
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "f(a => { if (true) return; else return false; })",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedReturnValue",
                    data: { name: "Arrow function" },
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "function foo() { if (true) return true; return undefined; }",
            options: [{ treatUndefinedAsUnspecified: true }],
            errors: [
                {
                    messageId: "missingReturnValue",
                    data: { name: "Function 'foo'" },
                    type: "ReturnStatement",
                    column: 41
                }
            ]
        },
        {
            code: "function foo() { if (true) return true; return void 0; }",
            options: [{ treatUndefinedAsUnspecified: true }],
            errors: [
                {
                    messageId: "missingReturnValue",
                    data: { name: "Function 'foo'" },
                    type: "ReturnStatement",
                    column: 41
                }
            ]
        },
        {
            code: "function foo() { if (true) return undefined; return true; }",
            options: [{ treatUndefinedAsUnspecified: true }],
            errors: [
                {
                    messageId: "unexpectedReturnValue",
                    data: { name: "Function 'foo'" },
                    type: "ReturnStatement",
                    column: 46
                }
            ]
        },
        {
            code: "function foo() { if (true) return void 0; return true; }",
            options: [{ treatUndefinedAsUnspecified: true }],
            errors: [
                {
                    messageId: "unexpectedReturnValue",
                    data: { name: "Function 'foo'" },
                    type: "ReturnStatement",
                    column: 43
                }
            ]
        },
        {
            code: "if (true) { return 1; } return;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                {
                    messageId: "missingReturnValue",
                    data: { name: "Program" },
                    type: "ReturnStatement"
                }
            ]
        },
        {
            code: "function foo() { if (a) return true; }",
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "function 'foo'" },
                    type: "FunctionDeclaration",
                    column: 10
                }
            ]
        },
        {
            code: "function _foo() { if (a) return true; }",
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "function '_foo'" },
                    type: "FunctionDeclaration",
                    column: 10
                }
            ]
        },
        {
            code: "f(function foo() { if (a) return true; });",
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "function 'foo'" },
                    type: "FunctionExpression",
                    column: 12
                }
            ]
        },
        {
            code: "f(function() { if (a) return true; });",
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "function" },
                    type: "FunctionExpression",
                    column: 3
                }
            ]
        },
        {
            code: "f(() => { if (a) return true; });",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "arrow function" },
                    type: "ArrowFunctionExpression",
                    column: 6
                }
            ]
        },
        {
            code: "var obj = {foo() { if (a) return true; }};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "method 'foo'" },
                    type: "FunctionExpression",
                    column: 12
                }
            ]
        },
        {
            code: "class A {foo() { if (a) return true; }};",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "method 'foo'" },
                    type: "FunctionExpression",
                    column: 10
                }
            ]
        },
        {
            code: "if (a) return true;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "program" },
                    type: "Program",
                    column: 1
                }
            ]
        },
        {
            code: "class A { CapitalizedFunction() { if (a) return true; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "method 'CapitalizedFunction'" },
                    type: "FunctionExpression",
                    column: 11
                }
            ]
        },
        {
            code: "({ constructor() { if (a) return true; } });",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingReturn",
                    data: { name: "method 'constructor'" },
                    type: "FunctionExpression",
                    column: 4
                }
            ]
        }
    ]
});
