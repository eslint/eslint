/**
 * @fileoverview Tests for no-unused-vars rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-unused-vars"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.defineRule("use-every-a", function(context) {
    /**
     * Mark a variable as used
     * @returns {void}
     * @private
     */
    function useA() {
        context.markVariableAsUsed("a");
    }
    return {
        "VariableDeclaration": useA,
        "ReturnStatement": useA
    };
});

ruleTester.run("no-unused-vars", rule, {
    valid: [
        "var foo = 5;\n\nlabel: while (true) {\n  console.log(foo);\n  break label;\n}",
        "var foo = 5;\n\nwhile (true) {\n  console.log(foo);\n  break;\n}",
        { code: "for (let prop in box) {\n        box[prop] = parseInt(box[prop]);\n}", ecmaFeatures: { blockBindings: true }},
        "var box = {a: 2};\n    for (var prop in box) {\n        box[prop] = parseInt(box[prop]);\n}",
        "f({ set foo(a) { return; } });",
        { code: "a; var a;", options: ["all"] },
        { code: "var a=10; alert(a);", options: ["all"] },
        { code: "var a=10; (function() { alert(a); })();", options: ["all"] },
        { code: "var a=10; (function() { setTimeout(function() { alert(a); }, 0); })();", options: ["all"] },
        { code: "var a=10; d[a] = 0;", options: ["all"] },
        { code: "(function() { var a=10; return a; })();", options: ["all"] },
        { code: "(function g() {})()", options: ["all"] },
        { code: "function f(a) {alert(a);}; f();", options: ["all"] },
        { code: "var c = 0; function f(a){ var b = a; return b; }; f(c);", options: ["all"] },
        { code: "function a(x, y){ return y; }; a();", options: ["all"] },
        { code: "var arr1 = [1, 2]; var arr2 = [3, 4]; for (var i in arr1) { arr1[i] = 5; } for (var i in arr2) { arr2[i] = 10; }", options: ["all"] },
        { code: "var a=10;", options: ["local"] },
        { code: "var min = \"min\"; Math[min];", options: ["all"] },
        { code: "Foo.bar = function(baz) { return baz; };", options: ["all"] },
        "myFunc(function foo() {}.bind(this))",
        "myFunc(function foo(){}.toString())",
        "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});}; foo()",
        "(function() { var doSomething = function doSomething() {}; doSomething() }())",
        "try {} catch(e) {}",
        "/*global a */ a;",
        { code: "var a=10; (function() { alert(a); })();", options: [{vars: "all"}] },
        { code: "function g(bar, baz) { return baz; }; g();", options: [{"vars": "all"}] },
        { code: "function g(bar, baz) { return baz; }; g();", options: [{"vars": "all", "args": "after-used"}] },
        { code: "function g(bar, baz) { return bar; }; g();", options: [{"vars": "all", "args": "none"}] },
        { code: "function g(bar, baz) { return 2; }; g();", options: [{"vars": "all", "args": "none"}] },
        { code: "function g(bar, baz) { return bar + baz; }; g();", options: [{"vars": "local", "args": "all"}] },
        { code: "var g = function(bar, baz) { return 2; }; g();", options: [{"vars": "all", "args": "none"}] },
        "(function z() { z(); })();",
        { code: " ", globals: {a: true} },
        { code: "var who = \"Paul\";\nmodule.exports = `Hello ${who}!`;", ecmaFeatures: { templateStrings: true }},
        { code: "export var foo = 123;", ecmaFeatures: { modules: true }},
        { code: "export function foo () {}", ecmaFeatures: { modules: true }},
        { code: "let toUpper = (partial) => partial.toUpperCase; export {toUpper}", ecmaFeatures: { blockBindings: true, arrowFunctions: true, modules: true }},
        { code: "export class foo {}", ecmaFeatures: { modules: true, classes: true }},
        { code: "class Foo{}; var x = new Foo(); x.foo()", ecmaFeatures: { classes: true }},
        { code: "const foo = \"hello!\";function bar(foobar = foo) {  foobar.replace(/!$/, \" world!\");}\nbar();", ecmaFeatures: { blockBindings: true, defaultParams: true }},
        "function Foo(){}; var x = new Foo(); x.foo()",
        "function foo() {var foo = 1; return foo}; foo();",
        "function foo(foo) {return foo}; foo(1);",
        "function foo() {function foo() {return 1;}; return foo()}; foo();",
        {code: "function foo() {var foo = 1; return foo}; foo();", ecmaFeatures: {globalReturn: true}},
        {code: "function foo(foo) {return foo}; foo(1);", ecmaFeatures: {globalReturn: true}},
        {code: "function foo() {function foo() {return 1;}; return foo()}; foo();", ecmaFeatures: {globalReturn: true}},
        {code: "const x = 1; const [y = x] = []; foo(y);", ecmaFeatures: {blockBindings: true, destructuring: true}},
        {code: "const x = 1; const {y = x} = {}; foo(y);", ecmaFeatures: {blockBindings: true, destructuring: true}},
        {code: "const x = 1; const {z: [y = x]} = {}; foo(y);", ecmaFeatures: {blockBindings: true, destructuring: true}},
        {code: "const x = []; const {z: [y] = x} = {}; foo(y);", ecmaFeatures: {blockBindings: true, destructuring: true}},
        {code: "const x = 1; let y; [y = x] = []; foo(y);", ecmaFeatures: {blockBindings: true, destructuring: true}},
        {code: "const x = 1; let y; ({y = x}) = {}; foo(y);", ecmaFeatures: {blockBindings: true, destructuring: true}},
        {code: "const x = 1; let y; ({z: [y = x]}) = {}; foo(y);", ecmaFeatures: {blockBindings: true, destructuring: true}},
        {code: "const x = []; let y; ({z: [y] = x}) = {}; foo(y);", ecmaFeatures: {blockBindings: true, destructuring: true}},
        {code: "const x = 1; function foo(y = x) { bar(y); } foo();", ecmaFeatures: {blockBindings: true, defaultParams: true}},
        {code: "const x = 1; function foo({y = x} = {}) { bar(y); } foo();", ecmaFeatures: {blockBindings: true, destructuring: true, defaultParams: true}},
        {code: "const x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();", ecmaFeatures: {blockBindings: true, defaultParams: true}},
        {code: "const x = 1; function foo(y = function() { bar(x); }) { y(); } foo();", ecmaFeatures: {blockBindings: true, defaultParams: true}},
        {code: "var x = 1; var [y = x] = []; foo(y);", ecmaFeatures: {destructuring: true}},
        {code: "var x = 1; var {y = x} = {}; foo(y);", ecmaFeatures: {destructuring: true}},
        {code: "var x = 1; var {z: [y = x]} = {}; foo(y);", ecmaFeatures: {destructuring: true}},
        {code: "var x = []; var {z: [y] = x} = {}; foo(y);", ecmaFeatures: {destructuring: true}},
        {code: "var x = 1, y; [y = x] = []; foo(y);", ecmaFeatures: {destructuring: true}},
        {code: "var x = 1, y; ({y = x}) = {}; foo(y);", ecmaFeatures: {destructuring: true}},
        {code: "var x = 1, y; ({z: [y = x]}) = {}; foo(y);", ecmaFeatures: {destructuring: true}},
        {code: "var x = [], y; ({z: [y] = x}) = {}; foo(y);", ecmaFeatures: {destructuring: true}},
        {code: "var x = 1; function foo(y = x) { bar(y); } foo();", ecmaFeatures: {defaultParams: true}},
        {code: "var x = 1; function foo({y = x} = {}) { bar(y); } foo();", ecmaFeatures: {destructuring: true, defaultParams: true}},
        {code: "var x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();", ecmaFeatures: {defaultParams: true}},
        {code: "var x = 1; function foo(y = function() { bar(x); }) { y(); } foo();", ecmaFeatures: {defaultParams: true}},

        // exported variables should work
        { code: "/*exported toaster*/ var toaster = 'great'" },
        { code: "/*exported toaster, poster*/ var toaster = 1; poster = 0;" },
        { code: "/*exported x*/ var { x } = y", ecmaFeatures: {destructuring: true} },
        { code: "/*exported x, y*/  var { x, y } = z", ecmaFeatures: {destructuring: true} },

        // Can mark variables as used via context.markVariableAsUsed()
        { code: "/*eslint use-every-a:1*/ var a;"},
        { code: "/*eslint use-every-a:1*/ !function(a) { return 1; }"},
        { code: "/*eslint use-every-a:1*/ !function() { var a; return 1 }"},

        // ignore pattern
        { code: "var _a;", options: [ { vars: "all", varsIgnorePattern: "^_" } ] },
        { code: "var a; function foo() { var _b; } foo();", options: [ { vars: "local", varsIgnorePattern: "^_" } ] },
        { code: "function foo(_a) { } foo();", options: [ { args: "all", argsIgnorePattern: "^_" } ] },
        { code: "function foo(a, _b) { return a; } foo();", options: [ { args: "after-used", argsIgnorePattern: "^_" } ] },
        { code: "var [ firstItemIgnored, secondItem ] = items;\nconsole.log(secondItem);", ecmaFeatures: {destructuring: true}, options: [ { vars: "all", varsIgnorePattern: "[iI]gnored" } ] }
    ],
    invalid: [
        { code: "function foox() { return foox(); }", errors: [{ message: "\"foox\" is defined but never used", type: "Identifier"}] },
        { code: "(function() { function foox() { if (true) { return foox(); } } }())", errors: [{ message: "\"foox\" is defined but never used", type: "Identifier"}] },
        { code: "var a=10", errors: [{ message: "\"a\" is defined but never used", type: "Identifier"}] },
        { code: "function f() { var a = 1; return function(){ f(a *= 2); }; }", errors: [{message: "\"f\" is defined but never used", type: "Identifier"}]},
        { code: "function f() { var a = 1; return function(){ f(++a); }; }", errors: [{message: "\"f\" is defined but never used", type: "Identifier"}]},
        { code: "/*global a */", errors: [{ message: "\"a\" is defined but never used", type: "Program"}] },
        { code: "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});};", errors: [{ message: "\"foo\" is defined but never used", type: "Identifier"}] },
        { code: "var a=10;", options: ["all"], errors: [{ message: "\"a\" is defined but never used", type: "Identifier"}] },
        { code: "var a=10; a=20;", options: ["all"], errors: [{ message: "\"a\" is defined but never used", type: "Identifier"}] },
        { code: "var a=10; (function() { var a = 1; alert(a); })();", options: ["all"], errors: [{ message: "\"a\" is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; alert(a+b)", options: ["all"], errors: [{ message: "\"c\" is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);", options: ["all"], errors: [{ message: "\"b\" is defined but never used", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);", options: ["all"], errors: [{ message: "\"b\" is defined but never used", type: "Identifier"}, { message: "\"c\" is defined but never used", type: "Identifier"}] },
        { code: "function f(){var a=[];return a.map(function(){});}", options: ["all"], errors: [{ message: "\"f\" is defined but never used", type: "Identifier"}] },
        { code: "function f(){var a=[];return a.map(function g(){});}", options: ["all"], errors: [{ message: "\"f\" is defined but never used", type: "Identifier"}] },
        { code: "function foo() {function foo(x) {\nreturn x; }; return function() {return foo; }; }", errors: [{message: "\"foo\" is defined but never used", line: 1, type: "Identifier"}]},
        { code: "function f(){var x;function a(){x=42;}function b(){alert(x);}}", options: ["all"], errors: 3 },
        { code: "function f(a) {}; f();", options: ["all"], errors: [{ message: "\"a\" is defined but never used", type: "Identifier"}] },
        { code: "function a(x, y, z){ return y; }; a();", options: ["all"], errors: [{ message: "\"z\" is defined but never used", type: "Identifier"}] },
        { code: "var min = Math.min", options: ["all"], errors: [{ message: "\"min\" is defined but never used" }] },
        { code: "var min = {min: 1}", options: ["all"], errors: [{ message: "\"min\" is defined but never used" }] },
        { code: "Foo.bar = function(baz) { return 1; };", options: ["all"], errors: [{ message: "\"baz\" is defined but never used" }] },
        { code: "var min = {min: 1}", options: [{"vars": "all"}], errors: [{ message: "\"min\" is defined but never used" }] },
        { code: "function gg(baz, bar) { return baz; }; gg();", options: [{"vars": "all"}], errors: [{ message: "\"bar\" is defined but never used" }] },
        { code: "(function(foo, baz, bar) { return baz; })();", options: [{"vars": "all", "args": "after-used"}], errors: [{ message: "\"bar\" is defined but never used" }]},
        { code: "(function(foo, baz, bar) { return baz; })();", options: [{"vars": "all", "args": "all"}], errors: [{ message: "\"foo\" is defined but never used" }, { message: "\"bar\" is defined but never used" }]},
        { code: "(function z(foo) { var bar = 33; })();", options: [{"vars": "all", "args": "all"}], errors: [{ message: "\"foo\" is defined but never used" }, { message: "\"bar\" is defined but never used" }]},
        { code: "(function z(foo) { z(); })();", options: [{}], errors: [{ message: "\"foo\" is defined but never used" }]},
        { code: "function f() { var a = 1; return function(){ f(a = 2); }; }", options: [{}], errors: [{ message: "\"f\" is defined but never used" }, {message: "\"a\" is defined but never used"}]},
        { code: "import x from \"y\";", ecmaFeatures: { modules: true }, errors: [{ message: "\"x\" is defined but never used" }]},
        { code: "export function fn2({ x, y }) {\n console.log(x); \n};", ecmaFeatures: { modules: true, destructuring: true }, errors: [{ message: "\"y\" is defined but never used" }]},
        { code: "export function fn2( x, y ) {\n console.log(x); \n};", ecmaFeatures: { modules: true }, errors: [{ message: "\"y\" is defined but never used" }]},

        // exported
        { code: "/*exported max*/ var max = 1, min = {min: 1}", errors: [{ message: "\"min\" is defined but never used" }] },
        { code: "/*exported x*/ var { x, y } = z", ecmaFeatures: { destructuring: true }, errors: [{ message: "\"y\" is defined but never used" }] },

        // ignore pattern
        { code: "var _a; var b;", options: [ { vars: "all", varsIgnorePattern: "^_" } ], errors: [{ message: "\"b\" is defined but never used", line: 1, column: 13 }] },
        { code: "var a; function foo() { var _b; var c_; } foo();", options: [ { vars: "local", varsIgnorePattern: "^_" } ], errors: [{ message: "\"c_\" is defined but never used", line: 1, column: 37 }] },
        { code: "function foo(a, _b) { } foo();", options: [ { args: "all", argsIgnorePattern: "^_" } ], errors: [{ message: "\"a\" is defined but never used", line: 1, column: 14 }] },
        { code: "function foo(a, _b, c) { return a; } foo();", options: [ { args: "after-used", argsIgnorePattern: "^_" } ], errors: [{ message: "\"c\" is defined but never used", line: 1, column: 21 }] },
        { code: "var [ firstItemIgnored, secondItem ] = items;", ecmaFeatures: {destructuring: true}, options: [ { vars: "all", varsIgnorePattern: "[iI]gnored" } ], errors: [{ message: "\"secondItem\" is defined but never used", line: 1, column: 25 }] },

        // https://github.com/eslint/eslint/issues/3617
        {
            code: "\n/* global foobar, foo, bar */\nfoobar;",
            errors: [
                {line: 2, column: 19, message: "\"foo\" is defined but never used" },
                {line: 2, column: 24, message: "\"bar\" is defined but never used" }
            ]
        },
        {
            code: "\n/* global foobar,\n   foo,\n   bar\n */\nfoobar;",
            errors: [
                {line: 3, column: 4, message: "\"foo\" is defined but never used" },
                {line: 4, column: 4, message: "\"bar\" is defined but never used" }
            ]
        },

        // https://github.com/eslint/eslint/issues/3714
        {
            code: "/* global a$fooz,$foo */\na$fooz;",
            errors: [
                {line: 1, column: 18, message: "\"$foo\" is defined but never used" }
            ]
        },
        {
            code: "/* globals a$fooz, $ */\na$fooz;",
            errors: [
                {line: 1, column: 20, message: "\"$\" is defined but never used" }
            ]
        },
        {
            code: "/*globals $foo*/",
            errors: [
                {line: 1, column: 11, message: "\"$foo\" is defined but never used" }
            ]
        },
        {
            code: "/* global global*/",
            errors: [
                {line: 1, column: 11, message: "\"global\" is defined but never used" }
            ]
        },
        {
            code: "/*global foo:true*/",
            errors: [
                {line: 1, column: 10, message: "\"foo\" is defined but never used" }
            ]
        },
        // non ascii.
        {
            code: "/*global 変数, 数*/\n変数;",
            errors: [
                {line: 1, column: 14, message: "\"数\" is defined but never used" }
            ]
        },
        // surrogate pair.
        // TODO: https://github.com/eslint/espree/issues/181
        // {
        //     code: "/*global 𠮷𩸽, 𠮷*/\n\\u{20BB7}\\u{29E3D};",
        //     env: {es6: true},
        //     errors: [
        //         {line: 1, column: 16, message: "\"𠮷\" is defined but never used" }
        //     ]
        // }

        // https://github.com/eslint/eslint/issues/4047
        {
            code: "export default function(a) {}",
            ecmaFeatures: {modules: true},
            errors: [{message: "\"a\" is defined but never used"}]
        },
        {
            code: "export default function(a, b) { console.log(a); }",
            ecmaFeatures: {modules: true},
            errors: [{message: "\"b\" is defined but never used"}]
        },
        {
            code: "export default (function(a) {});",
            ecmaFeatures: {modules: true},
            errors: [{message: "\"a\" is defined but never used"}]
        },
        {
            code: "export default (function(a, b) { console.log(a); });",
            ecmaFeatures: {modules: true},
            errors: [{message: "\"b\" is defined but never used"}]
        },
        {
            code: "export default (a) => {};",
            ecmaFeatures: {modules: true, arrowFunctions: true},
            errors: [{message: "\"a\" is defined but never used"}]
        },
        {
            code: "export default (a, b) => { console.log(a); };",
            ecmaFeatures: {modules: true, arrowFunctions: true},
            errors: [{message: "\"b\" is defined but never used"}]
        }
    ]
});
