/**
 * @fileoverview Tests for no-unused-vars rule.
 * @author Ilya Volodin
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
eslintTester.addRuleTest("lib/rules/no-unused-vars", {
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
        { code: "var min = \"min\"; Math[min];", args: [1, "all"] },
        { code: "Foo.bar = function(baz) { return baz; };", args: [1, "all"] },
        "myFunc(function foo() {}.bind(this))",
        "myFunc(function foo(){}.toString())",
        "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});}; foo()",
        "(function() { var doSomething = function doSomething() {}; doSomething() }())",
        "/*global a */ a;",
        { code: "var a=10; (function() { alert(a); })();", args: [1, {vars: "all"}] },
        { code: "function g(bar, baz) { return baz; }; g();", args: [1, {"vars": "all"}] },
        { code: "function g(bar, baz) { return baz; }; g();", args: [1, {"vars": "all", "args": "after-used"}] },
        { code: "function g(bar, baz) { return bar; }; g();", args: [1, {"vars": "all", "args": "none"}] },
        { code: "function g(bar, baz) { return 2; }; g();", args: [1, {"vars": "all", "args": "none"}] },
        { code: "function g(bar, baz) { return bar + baz; }; g();", args: [1, {"vars": "locals", "args": "all"}] },
        { code: "var g = function (bar, baz) { return 2; }; g();", args: [1, {"vars": "all", "args": "none"}] },
        "(function z() { z(); })();",
        { code: " ", globals: {a: true} }
    ],
    invalid: [
        { code: "var a=10", errors: [{ message: "a is defined but never used", type: "Identifier"}] },
        { code: "/*global a */", errors: [{ message: "a is defined but never used", type: "Program"}] },
        { code: "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});};", errors: [{ message: "foo is defined but never used", type: "Identifier"}] },
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
        { code: "var min = Math.min", args: [1, "all"], errors: [{ message: "min is defined but never used" }] },
        { code: "var min = {min: 1}", args: [1, "all"], errors: [{ message: "min is defined but never used" }] },
        { code: "Foo.bar = function(baz) { return 1; };", args: [1, "all"], errors: [{ message: "baz is defined but never used" }] },
        { code: "var min = {min: 1}", args: [1, {"vars": "all"}], errors: [{ message: "min is defined but never used" }] },
        { code: "function gg(baz, bar) { return baz; }; gg();", args: [1, {"vars": "all"}], errors: [{ message: "bar is defined but never used" }] },
        { code: "(function(foo, baz, bar) { return baz; })();", args: [1, {"vars": "all", "args": "after-used"}], errors: [{ message: "bar is defined but never used" }]},
        { code: "(function(foo, baz, bar) { return baz; })();", args: [1, {"vars": "all", "args": "all"}], errors: [{ message: "foo is defined but never used" }, { message: "bar is defined but never used" }]},
        { code: "(function z(foo) { var bar = 33; })();", args: [1, {"vars": "all", "args": "all"}], errors: [{ message: "foo is defined but never used" }, { message: "bar is defined but never used" }]},
        { code: "(function z(foo) { z(); })();", args: [1, {}], errors: [{ message: "foo is defined but never used" }]}
    ]
});
