/**
 * @fileoverview Tests for block-scoped-var rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/block-scoped-var", {
    valid: [
        "function f() { var a, b; { a = true; } b = a; }",
        "var a; function f() { var b = a; }",
        "function f(a) { }",
        "!function(a) { };",
        "!function f(a) { };",
        "function f(a) { var b = a; }",
        "!function f(a) { var b = a; };",
        "function f() { var g = f; }",
        "function f() { } function g() { var f = g; }",
        "function f() { var hasOwnProperty; { hasOwnProperty; } }",
        "function f(){ a; b; var a, b; }",
        "function f(){ g(); function g(){} }",
        { code: "new Date", globals: {Date: false} },
        { code: "new Date", globals: {} },
        { code: "var eslint = require('eslint');", globals: {require: false} },
        "function f(a) { return a.b; }",
        "var a = { \"foo\": 3 };",
        "var a = { foo: 3 };",
        "var a = { foo: 3, bar: 5 };",
        "var a = { set foo(a){}, get bar(){} };",
        "function f(a) { return arguments[0]; }",
        "function f() { }; var a = f;",
        "var a = f; function f() { };",
        "function f(){ for(var i; i; i) i; }",
        "function f(){ for(var a=0, b=1; a; b) a, b; }",
        "function f(){ for(var a in {}) a; }",
        "function f(){ switch(2) { case 1: var b = 2; b; break; default: b; break;} b; }"
    ],
    invalid: [
        { code: "function f(){ x; }", errors: [{ message: "\"x\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f(){ x; { var x; } }", errors: [{ message: "\"x\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f(){ { var x; } x; }", errors: [{ message: "\"x\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f() { var a; { var b = 0; } a = b; }", errors: [{ message: "\"b\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f() { try { var a = 0; } catch (e) { var b = a; } }", errors: [{ message: "\"a\" used outside of binding context.", type: "Identifier" }] },
        { code: "var eslint = require('eslint');", globals: {}, errors: [{ message: "\"require\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f(a) { return a[b]; }", errors: [{ message: "\"b\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f() { return b.a; }", errors: [{ message: "\"b\" used outside of binding context.", type: "Identifier" }] },
        { code: "var a = { foo: bar };", errors: [{ message: "\"bar\" used outside of binding context.", type: "Identifier" }] },
        { code: "var a = { foo: foo };", errors: [{ message: "\"foo\" used outside of binding context.", type: "Identifier" }] },
        { code: "var a = { bar: 7, foo: bar };", errors: [{ message: "\"bar\" used outside of binding context.", type: "Identifier" }] },
        { code: "var a = arguments;", errors: [{ message: "\"arguments\" used outside of binding context.", type: "Identifier" }] },
        { code: "function x(){}; var a = arguments;", errors: [{ message: "\"arguments\" used outside of binding context.", type: "Identifier" }] },
        { code: "function z(b){}; var a = b;", errors: [{ message: "\"b\" used outside of binding context.", type: "Identifier" }] },
        { code: "function z(){var b;}; var a = b;", errors: [{ message: "\"b\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f(){ try{}catch(e){} e }", errors: [{ message: "\"e\" used outside of binding context.", type: "Identifier" }] }
    ]
});
