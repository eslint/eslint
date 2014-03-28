/**
 * @fileoverview Tests for block-scoped-var rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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
        { code: "var eslint = require('eslint');", globals: {require: false} }
    ],
    invalid: [
        { code: "function f(){ x; }", errors: [{ message: "\"x\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f(){ x; { var x; } }", errors: [{ message: "\"x\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f(){ { var x; } x; }", errors: [{ message: "\"x\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f() { var a; { var b = 0; } a = b; }", errors: [{ message: "\"b\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f() { try { var a = 0; } catch (e) { var b = a; } }", errors: [{ message: "\"a\" used outside of binding context.", type: "Identifier" }] },
        { code: "var eslint = require('eslint');", globals: {}, errors: [{ message: "\"require\" used outside of binding context.", type: "Identifier" }] }
    ]
});
