/**
 * @fileoverview Tests for no-shadow rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-shadow", {
    valid: [
        "var a=3; function b(x) { a++; return x + a; }; setTimeout(function() { b(a); }, 0);",
        "(function() { var doSomething = function doSomething() {}; doSomething() }())",
        "var arguments;\nfunction bar() { }",
        { code: "var a=3; var b = (x) => { a++; return x + a; }; setTimeout(() => { b(a); }, 0);", ecmaFeatures: { arrowFunctions: true } },
        { code: "class A {}", ecmaFeatures: {classes: true} },
        { code: "class A { constructor() { var a; } }", ecmaFeatures: {classes: true} }
    ],
    invalid: [
        {
            code: "function a(x) { var b = function c() { var x = 'foo'; }; }",
            errors: [{
                message: "x is already declared in the upper scope.",
                type: "Identifier",
                line: 1,
                column: 43
            }]
        },
        {
            code: "var a = (x) => { var b = () => { var x = 'foo'; }; }",
            ecmaFeatures: {
                arrowFunctions: true
            },
            errors: [{
                message: "x is already declared in the upper scope.",
                type: "Identifier",
                line: 1,
                column: 37
            }]
        },
        {
            code: "function a(x) { var b = function () { var x = 'foo'; }; }",
            errors: [{
                message: "x is already declared in the upper scope.",
                type: "Identifier",
                line: 1,
                column: 42
            }]
        },
        {
            code: "var x = 1; function a(x) { return ++x; }",
            errors: [{
                message: "x is already declared in the upper scope.",
                type: "Identifier",
                line: 1,
                column: 22
            }]
        },
        {
            code: "var a=3; function b() { var a=10; }",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier" }]
        },
        {
            code: "var a=3; function b() { var a=10; }; setTimeout(function() { b(); }, 0);",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier" }]
        },
        {
            code: "var a=3; function b() { var a=10; var b=0; }; setTimeout(function() { b(); }, 0);",
            errors: [{ message: "a is already declared in the upper scope.", type: "Identifier" }, { message: "b is already declared in the upper scope.", type: "Identifier" }]
        },
        {
            code: "var x = 1; { let x = 2; }",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "x is already declared in the upper scope.", type: "Identifier"}]
        },
        {
            code: "let x = 1; { const x = 2; }",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "x is already declared in the upper scope.", type: "Identifier"}]
        }
    ]
});
