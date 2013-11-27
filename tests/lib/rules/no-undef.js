/**
 * @fileoverview Tests for no-undef rule.
 * @author Mark Macdonald
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-undef", {
    valid: [
        "var a = 1, b = 2; a;",
        "/*global b*/ function f() { b; }",
        { code: "function f() { b; }", globals: { b: false} },
        { code: "function f() { b; }", global: { b: false} },
        "/*global b a:false*/  a;  function f() { b; a; }",
        "function a(){}  a();",
        "function f(b) { b; }",
        "var a; a = 1; a++;",
        "var a; function f() { a = 1; }",
        "/*global b:true*/ b++;",
        "/*jslint browser:true*/ window;",
        "/*jshint browser:true*/ window;",
        "/*jshint node:true*/ require(\"a\");",
        "Object; isNaN();",
        "function evilEval(stuffToEval) { var ultimateAnswer; ultimateAnswer = 42; eval(stuffToEval); }"

    ],
    invalid: [
        { code: "a = 1;", errors: [{ message: "'a' is not defined.", type: "Identifier"}] },
        { code: "var a = b;", errors: [{ message: "'b' is not defined.", type: "Identifier"}] },
        { code: "function f() { b; }", errors: [{ message: "'b' is not defined.", type: "Identifier"}] },
        { code: "/*global b:false*/ function f() { b = 1; }", errors: [{ message: "'b' is read only.", type: "Identifier"}] },
        { code: "function f() { b = 1; }", global: { b: false }, errors: [{ message: "'b' is read only.", type: "Identifier"}] },
        { code: "/*global b:false*/ function f() { b++; }", errors: [{ message: "'b' is read only.", type: "Identifier"}] },
        { code: "/*global b*/ b = 1;", errors: [{ message: "'b' is read only.", type: "Identifier"}] },
        { code: "/*global b:false*/ var b = 1;", errors: [{ message: "'b' is read only.", type: "Identifier"}] },
        { code: "window;", errors: [{ message: "'window' is not defined.", type: "Identifier"}] },
        { code: "/*jshint browser:false*/ window;", errors: [{ message: "'window' is not defined.", type: "Identifier"}] },
        { code: "require(\"a\");", errors: [{ message: "'require' is not defined.", type: "Identifier"}] },
        { code: "/*jshint node:false*/ require(\"a\");", errors: [{ message: "'require' is not defined.", type: "Identifier"}] },
        { code: "Array = 1;", errors: [{ message: "'Array' is read only.", type: "Identifier"}] }
    ]
});
