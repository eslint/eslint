/**
 * @fileoverview Tests for no-unused-vars rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-unused-vars", {
    valid: [
        "var a=10; alert(a);",
        "var a=10; (function() { alert(a); })();",
        "var a=10; (function() { setTimeout(function() { alert(a); }, 0); })();",
        "var a=10; d[a] = 0;",
        "(function() { var a=10; return a; })();",
        "(function g() {})()",
        "function f(a) {alert(a);}; f();",
        "var c = 0; function f(a){ var b = a; return b; }; f(c);",
        "function a(x, y){ return y; }; a();"
    ],
    invalid: [
        { code: "var a=10;", errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "var a=10; a=20;", errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "var a=10; (function() { var a = 1; alert(a); })();", errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; alert(a+b)", errors: [{ message: "c is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);", errors: [{ message: "b is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);", errors: [{ message: "b is defined but never used", type: "Identifier"}, { message: "c is defined but never used", type: "Identifier"}] },
        { code: "function f(){var a=[];return a.map(function(){});}", errors: [{ message: "f is defined but never used", type: "Identifier"}] },
        { code: "function f(){var a=[];return a.map(function g(){});}", errors: [{ message: "f is defined but never used", type: "Identifier"}] },
        { code: "function f(){var x;function a(){x=42;}function b(){alert(x);}}", errors: 3 },
        { code: "function f(a) {}; f();", errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "function a(x, y, z){ return y; }; a();", errors: [{ message: "z is defined but never used", type: "Identifier"}] },
    ]
});
