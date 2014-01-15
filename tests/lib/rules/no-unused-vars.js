/**
 * @fileoverview Tests for no-unused-vars rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-unused-vars", {
    valid: [
        { code: "var a=10; alert(a);", args: [1, "all"] },
        { code: "var a=10; (function() { alert(a); })();", args: [1, "all"] },
        { code: "var a=10; (function() { setTimeout(function() { alert(a); }, 0); })();", args: [1, "all"] },
        { code: "var a=10; d[a] = 0;", args: [1, "all"] },
        { code: "(function() { var a=10; return a; })();", args: [1, "all"] },
        { code: "(function g() {})()", args: [1, "all"] },
        { code: "function f(a) {alert(a);}; f();", args: [1, "all"] },
        { code: "var c = 0; function f(a){ var b = a; return b; }; f(c);", args: [1, "all"] },
        { code: "function a(x, y){ return y; }; a();", args: [1, "all"] },
        { code: "var arr1 = [1, 2]; var arr2 = [3, 4]; for (var i in arr1) { arr1[i] = 5; } for (var i in arr2) { arr2[i] = 10; }", args: [1, "all"] },
        { code: "var a=10;", args: [1, "local"] },
        "var a=10",
        "myFunc(function foo() {}.bind(this))"
    ],
    invalid: [
        { code: "var a=10;", args: [1, "all"], errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "var a=10; a=20;", args: [1, "all"], errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "var a=10; (function() { var a = 1; alert(a); })();", args: [1, "all"], errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; alert(a+b)", args: [1, "all"], errors: [{ message: "c is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);", args: [1, "all"], errors: [{ message: "b is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);", args: [1, "all"], errors: [{ message: "b is defined but never used", type: "Identifier"}, { message: "c is defined but never used", type: "Identifier"}] },
        { code: "function f(){var a=[];return a.map(function(){});}", args: [1, "all"], errors: [{ message: "f is defined but never used", type: "Identifier"}] },
        { code: "function f(){var a=[];return a.map(function g(){});}", args: [1, "all"], errors: [{ message: "f is defined but never used", type: "Identifier"}] },
        { code: "function f(){var x;function a(){x=42;}function b(){alert(x);}}", args: [1, "all"], errors: 3 },
        { code: "function f(a) {}; f();", args: [1, "all"], errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "function a(x, y, z){ return y; }; a();", args: [1, "all"], errors: [{ message: "z is defined but never used", type: "Identifier"}] },
    ]
});
