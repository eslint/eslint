/**
 * @fileoverview Tests for no-unused-vars rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-vars"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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
        VariableDeclaration: useA,
        ReturnStatement: useA
    };
});

ruleTester.run("no-unused-vars", rule, {
    valid: [
        "var foo = 5;\n\nlabel: while (true) {\n  console.log(foo);\n  break label;\n}",
        "var foo = 5;\n\nwhile (true) {\n  console.log(foo);\n  break;\n}",
        { code: "for (let prop in box) {\n        box[prop] = parseInt(box[prop]);\n}", parserOptions: { ecmaVersion: 6 }},
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
        { code: "function g(bar, baz) { return baz; }; g();", options: [{vars: "all"}] },
        { code: "function g(bar, baz) { return baz; }; g();", options: [{vars: "all", args: "after-used"}] },
        { code: "function g(bar, baz) { return bar; }; g();", options: [{vars: "all", args: "none"}] },
        { code: "function g(bar, baz) { return 2; }; g();", options: [{vars: "all", args: "none"}] },
        { code: "function g(bar, baz) { return bar + baz; }; g();", options: [{vars: "local", args: "all"}] },
        { code: "var g = function(bar, baz) { return 2; }; g();", options: [{vars: "all", args: "none"}] },
        "(function z() { z(); })();",
        { code: " ", globals: {a: true} },
        { code: "var who = \"Paul\";\nmodule.exports = `Hello ${who}!`;", parserOptions: { ecmaVersion: 6 }},
        { code: "export var foo = 123;", parserOptions: { sourceType: "module" }},
        { code: "export function foo () {}", parserOptions: { sourceType: "module" }},
        { code: "let toUpper = (partial) => partial.toUpperCase; export {toUpper}", parserOptions: { sourceType: "module" }},
        { code: "export class foo {}", parserOptions: { sourceType: "module" }},
        { code: "class Foo{}; var x = new Foo(); x.foo()", parserOptions: { ecmaVersion: 6 }},
        { code: "const foo = \"hello!\";function bar(foobar = foo) {  foobar.replace(/!$/, \" world!\");}\nbar();", parserOptions: { ecmaVersion: 6 }},
        "function Foo(){}; var x = new Foo(); x.foo()",
        "function foo() {var foo = 1; return foo}; foo();",
        "function foo(foo) {return foo}; foo(1);",
        "function foo() {function foo() {return 1;}; return foo()}; foo();",
        {code: "function foo() {var foo = 1; return foo}; foo();", parserOptions: { parserOptions: { ecmaVersion: 6 } }},
        {code: "function foo(foo) {return foo}; foo(1);", parserOptions: { parserOptions: { ecmaVersion: 6 } }},
        {code: "function foo() {function foo() {return 1;}; return foo()}; foo();", parserOptions: { parserOptions: { ecmaVersion: 6 } }},
        {code: "const x = 1; const [y = x] = []; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 1; const {y = x} = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 1; const {z: [y = x]} = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = []; const {z: [y] = x} = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 1; let y; [y = x] = []; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 1; let y; ({z: [y = x]}) = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = []; let y; ({z: [y] = x}) = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 1; function foo(y = x) { bar(y); } foo();", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 1; function foo({y = x} = {}) { bar(y); } foo();", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();", parserOptions: { ecmaVersion: 6 }},
        {code: "const x = 1; function foo(y = function() { bar(x); }) { y(); } foo();", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1; var [y = x] = []; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1; var {y = x} = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1; var {z: [y = x]} = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = []; var {z: [y] = x} = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1, y; [y = x] = []; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1, y; ({z: [y = x]}) = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = [], y; ({z: [y] = x}) = {}; foo(y);", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1; function foo(y = x) { bar(y); } foo();", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1; function foo({y = x} = {}) { bar(y); } foo();", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();", parserOptions: { ecmaVersion: 6 }},
        {code: "var x = 1; function foo(y = function() { bar(x); }) { y(); } foo();", parserOptions: { ecmaVersion: 6 }},

        // exported variables should work
        { code: "/*exported toaster*/ var toaster = 'great'" },
        { code: "/*exported toaster, poster*/ var toaster = 1; poster = 0;" },
        { code: "/*exported x*/ var { x } = y", parserOptions: { ecmaVersion: 6 } },
        { code: "/*exported x, y*/  var { x, y } = z", parserOptions: { ecmaVersion: 6 } },

        // Can mark variables as used via context.markVariableAsUsed()
        { code: "/*eslint use-every-a:1*/ var a;"},
        { code: "/*eslint use-every-a:1*/ !function(a) { return 1; }"},
        { code: "/*eslint use-every-a:1*/ !function() { var a; return 1 }"},

        // ignore pattern
        { code: "var _a;", options: [ { vars: "all", varsIgnorePattern: "^_" } ] },
        { code: "var a; function foo() { var _b; } foo();", options: [ { vars: "local", varsIgnorePattern: "^_" } ] },
        { code: "function foo(_a) { } foo();", options: [ { args: "all", argsIgnorePattern: "^_" } ] },
        { code: "function foo(a, _b) { return a; } foo();", options: [ { args: "after-used", argsIgnorePattern: "^_" } ] },
        { code: "var [ firstItemIgnored, secondItem ] = items;\nconsole.log(secondItem);", parserOptions: { ecmaVersion: 6 }, options: [ { vars: "all", varsIgnorePattern: "[iI]gnored" } ] },

        // for-in loops (see #2342)
        "(function(obj) { var name; for ( name in obj ) return; })({});",
        "(function(obj) { var name; for ( name in obj ) { return; } })({});",
        "(function(obj) { for ( var name in obj ) { return true } })({})",
        "(function(obj) { for ( var name in obj ) return true })({})",

        { code: "(function(obj) { let name; for ( name in obj ) return; })({});", parserOptions: { ecmaVersion: 6 }},
        { code: "(function(obj) { let name; for ( name in obj ) { return; } })({});", parserOptions: { ecmaVersion: 6 }},
        { code: "(function(obj) { for ( let name in obj ) { return true } })({})", parserOptions: { ecmaVersion: 6 }},
        { code: "(function(obj) { for ( let name in obj ) return true })({})", parserOptions: { ecmaVersion: 6 }},

        { code: "(function(obj) { for ( const name in obj ) { return true } })({})", parserOptions: { ecmaVersion: 6 }},
        { code: "(function(obj) { for ( const name in obj ) return true })({})", parserOptions: { ecmaVersion: 6 }},

        // caughtErrors
        {
            code: "try{}catch(err){console.error(err);}",
            options: [{caughtErrors: "all"}]
        },
        {
            code: "try{}catch(err){}",
            options: [{caughtErrors: "none"}]
        },
        {
            code: "try{}catch(ignoreErr){}",
            options: [{caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore"}]
        },

        // caughtErrors with other combinations
        {
            code: "try{}catch(err){}",
            options: [{vars: "all", args: "all"}]
        },

        // https://github.com/eslint/eslint/issues/6348
        {code: "var a = 0, b; b = a = a + 1; foo(b);"},
        {code: "var a = 0, b; b = a += a + 1; foo(b);"},
        {code: "var a = 0, b; b = a++; foo(b);"},
        {code: "function foo(a) { var b = a = a + 1; bar(b) } foo();"},
        {code: "function foo(a) { var b = a += a + 1; bar(b) } foo();"},
        {code: "function foo(a) { var b = a++; bar(b) } foo();"},

        // https://github.com/eslint/eslint/issues/6576
        {
            code: [
                "var unregisterFooWatcher;",
                "// ...",
                "unregisterFooWatcher = $scope.$watch( \"foo\", function() {",
                "    // ...some code..",
                "    unregisterFooWatcher();",
                "});"
            ].join("\n")
        },
        {
            code: [
                "var ref;",
                "ref = setInterval(",
                "    function(){",
                "        clearInterval(ref);",
                "    }, 10);",
            ].join("\n")
        },
        {
            code: [
                "var _timer;",
                "function f() {",
                "    _timer = setTimeout(function () {}, _timer ? 100 : 0);",
                "}",
                "f();",
            ].join("\n")
        },
        {code: "function foo(cb) { cb = function() { function something(a) { cb(1 + a); } register(something); }(); } foo();"},
        {code: "function* foo(cb) { cb = yield function(a) { cb(1 + a); }; } foo();", parserOptions: {ecmaVersion: 6}},
        {code: "function foo(cb) { cb = tag`hello${function(a) { cb(1 + a); }}`; } foo();", parserOptions: {ecmaVersion: 6}},
        {code: "function foo(cb) { var b; cb = b = function(a) { cb(1 + a); }; b(); } foo();"},

        // https://github.com/eslint/eslint/issues/6646
        {
            code: [
                "function someFunction() {",
                "    var a = 0, i;",
                "    for (i = 0; i < 2; i++) {",
                "        a = myFunction(a);",
                "    }",
                "}",
                "someFunction();"
            ].join("\n")
        },

        // https://github.com/eslint/eslint/issues/7124
        {
            code: "(function(a, b, {c, d}) { d })",
            options: [{argsIgnorePattern: "c"}],
            parserOptions: {ecmaVersion: 6}
        },
        {
            code: "(function(a, b, {c, d}) { c })",
            options: [{argsIgnorePattern: "d"}],
            parserOptions: {ecmaVersion: 6}
        },

        // https://github.com/eslint/eslint/issues/7250
        {
            code: "(function(a, b, c) { c })",
            options: [{argsIgnorePattern: "c"}],
        },
        {
            code: "(function(a, b, {c, d}) { c })",
            options: [{argsIgnorePattern: "[cd]"}],
            parserOptions: {ecmaVersion: 6},
        },
    ],
    invalid: [
        { code: "function foox() { return foox(); }", errors: [{ message: "'foox' is defined but never used.", type: "Identifier"}] },
        { code: "(function() { function foox() { if (true) { return foox(); } } }())", errors: [{ message: "'foox' is defined but never used.", type: "Identifier"}] },
        { code: "var a=10", errors: [{ message: "'a' is defined but never used.", type: "Identifier"}] },
        { code: "function f() { var a = 1; return function(){ f(a *= 2); }; }", errors: [{message: "'f' is defined but never used.", type: "Identifier"}]},
        { code: "function f() { var a = 1; return function(){ f(++a); }; }", errors: [{message: "'f' is defined but never used.", type: "Identifier"}]},
        { code: "/*global a */", errors: [{ message: "'a' is defined but never used.", type: "Program"}] },
        { code: "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});};", errors: [{ message: "'foo' is defined but never used.", type: "Identifier"}] },
        { code: "var a=10;", options: ["all"], errors: [{ message: "'a' is defined but never used.", type: "Identifier"}] },
        { code: "var a=10; a=20;", options: ["all"], errors: [{ message: "'a' is defined but never used.", type: "Identifier"}] },
        { code: "var a=10; (function() { var a = 1; alert(a); })();", options: ["all"], errors: [{ message: "'a' is defined but never used.", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; alert(a+b)", options: ["all"], errors: [{ message: "'c' is defined but never used.", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);", options: ["all"], errors: [{ message: "'b' is defined but never used.", type: "Identifier"}] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);", options: ["all"], errors: [{ message: "'b' is defined but never used.", type: "Identifier"}, { message: "'c' is defined but never used.", type: "Identifier"}] },
        { code: "function f(){var a=[];return a.map(function(){});}", options: ["all"], errors: [{ message: "'f' is defined but never used.", type: "Identifier"}] },
        { code: "function f(){var a=[];return a.map(function g(){});}", options: ["all"], errors: [{ message: "'f' is defined but never used.", type: "Identifier"}] },
        { code: "function foo() {function foo(x) {\nreturn x; }; return function() {return foo; }; }", errors: [{message: "'foo' is defined but never used.", line: 1, type: "Identifier"}]},
        { code: "function f(){var x;function a(){x=42;}function b(){alert(x);}}", options: ["all"], errors: 3 },
        { code: "function f(a) {}; f();", options: ["all"], errors: [{ message: "'a' is defined but never used.", type: "Identifier"}] },
        { code: "function a(x, y, z){ return y; }; a();", options: ["all"], errors: [{ message: "'z' is defined but never used.", type: "Identifier"}] },
        { code: "var min = Math.min", options: ["all"], errors: [{ message: "'min' is defined but never used." }] },
        { code: "var min = {min: 1}", options: ["all"], errors: [{ message: "'min' is defined but never used." }] },
        { code: "Foo.bar = function(baz) { return 1; };", options: ["all"], errors: [{ message: "'baz' is defined but never used." }] },
        { code: "var min = {min: 1}", options: [{vars: "all"}], errors: [{ message: "'min' is defined but never used." }] },
        { code: "function gg(baz, bar) { return baz; }; gg();", options: [{vars: "all"}], errors: [{ message: "'bar' is defined but never used." }] },
        { code: "(function(foo, baz, bar) { return baz; })();", options: [{vars: "all", args: "after-used"}], errors: [{ message: "'bar' is defined but never used." }]},
        { code: "(function(foo, baz, bar) { return baz; })();", options: [{vars: "all", args: "all"}], errors: [{ message: "'foo' is defined but never used." }, { message: "'bar' is defined but never used." }]},
        { code: "(function z(foo) { var bar = 33; })();", options: [{vars: "all", args: "all"}], errors: [{ message: "'foo' is defined but never used." }, { message: "'bar' is defined but never used." }]},
        { code: "(function z(foo) { z(); })();", options: [{}], errors: [{ message: "'foo' is defined but never used." }]},
        { code: "function f() { var a = 1; return function(){ f(a = 2); }; }", options: [{}], errors: [{ message: "'f' is defined but never used." }, {message: "'a' is defined but never used."}]},
        { code: "import x from \"y\";", parserOptions: { sourceType: "module" }, errors: [{ message: "'x' is defined but never used." }]},
        { code: "export function fn2({ x, y }) {\n console.log(x); \n};", parserOptions: { sourceType: "module" }, errors: [{ message: "'y' is defined but never used." }]},
        { code: "export function fn2( x, y ) {\n console.log(x); \n};", parserOptions: { sourceType: "module" }, errors: [{ message: "'y' is defined but never used." }]},

        // exported
        { code: "/*exported max*/ var max = 1, min = {min: 1}", errors: [{ message: "'min' is defined but never used." }] },
        { code: "/*exported x*/ var { x, y } = z", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'y' is defined but never used." }] },

        // ignore pattern
        { code: "var _a; var b;", options: [ { vars: "all", varsIgnorePattern: "^_" } ], errors: [{ message: "'b' is defined but never used.", line: 1, column: 13 }] },
        { code: "var a; function foo() { var _b; var c_; } foo();", options: [ { vars: "local", varsIgnorePattern: "^_" } ], errors: [{ message: "'c_' is defined but never used.", line: 1, column: 37 }] },
        { code: "function foo(a, _b) { } foo();", options: [ { args: "all", argsIgnorePattern: "^_" } ], errors: [{ message: "'a' is defined but never used.", line: 1, column: 14 }] },
        { code: "function foo(a, _b, c) { return a; } foo();", options: [ { args: "after-used", argsIgnorePattern: "^_" } ], errors: [{ message: "'c' is defined but never used.", line: 1, column: 21 }] },
        { code: "var [ firstItemIgnored, secondItem ] = items;", parserOptions: { ecmaVersion: 6 }, options: [ { vars: "all", varsIgnorePattern: "[iI]gnored" } ], errors: [{ message: "'secondItem' is defined but never used.", line: 1, column: 25 }] },

        // for-in loops (see #2342)
        { code: "(function(obj) { var name; for ( name in obj ) { i(); return; } })({});", errors: [{ message: "'name' is defined but never used.", line: 1, column: 22 }] },
        { code: "(function(obj) { var name; for ( name in obj ) { } })({});", errors: [{ message: "'name' is defined but never used.", line: 1, column: 22 }] },
        { code: "(function(obj) { for ( var name in obj ) { } })({});", errors: [{ message: "'name' is defined but never used.", line: 1, column: 28 }] },

        // https://github.com/eslint/eslint/issues/3617
        {
            code: "\n/* global foobar, foo, bar */\nfoobar;",
            errors: [
                {line: 2, column: 19, message: "'foo' is defined but never used." },
                {line: 2, column: 24, message: "'bar' is defined but never used." }
            ]
        },
        {
            code: "\n/* global foobar,\n   foo,\n   bar\n */\nfoobar;",
            errors: [
                {line: 3, column: 4, message: "'foo' is defined but never used." },
                {line: 4, column: 4, message: "'bar' is defined but never used." }
            ]
        },

        // https://github.com/eslint/eslint/issues/3714
        {
            code: "/* global a$fooz,$foo */\na$fooz;",
            errors: [
                {line: 1, column: 18, message: "'$foo' is defined but never used." }
            ]
        },
        {
            code: "/* globals a$fooz, $ */\na$fooz;",
            errors: [
                {line: 1, column: 20, message: "'$' is defined but never used." }
            ]
        },
        {
            code: "/*globals $foo*/",
            errors: [
                {line: 1, column: 11, message: "'$foo' is defined but never used." }
            ]
        },
        {
            code: "/* global global*/",
            errors: [
                {line: 1, column: 11, message: "'global' is defined but never used." }
            ]
        },
        {
            code: "/*global foo:true*/",
            errors: [
                {line: 1, column: 10, message: "'foo' is defined but never used." }
            ]
        },

        // non ascii.
        {
            code: "/*global 変数, 数*/\n変数;",
            errors: [
                {line: 1, column: 14, message: "'数' is defined but never used." }
            ]
        },

        // surrogate pair.
        {
            code: "/*global 𠮷𩸽, 𠮷*/\n\\u{20BB7}\\u{29E3D};",
            env: {es6: true},
            errors: [
                {line: 1, column: 16, message: "'𠮷' is defined but never used." }
            ]
        },

        // https://github.com/eslint/eslint/issues/4047
        {
            code: "export default function(a) {}",
            parserOptions: { sourceType: "module" },
            errors: [{message: "'a' is defined but never used."}]
        },
        {
            code: "export default function(a, b) { console.log(a); }",
            parserOptions: { sourceType: "module" },
            errors: [{message: "'b' is defined but never used."}]
        },
        {
            code: "export default (function(a) {});",
            parserOptions: { sourceType: "module" },
            errors: [{message: "'a' is defined but never used."}]
        },
        {
            code: "export default (function(a, b) { console.log(a); });",
            parserOptions: { sourceType: "module" },
            errors: [{message: "'b' is defined but never used."}]
        },
        {
            code: "export default (a) => {};",
            parserOptions: { sourceType: "module" },
            errors: [{message: "'a' is defined but never used."}]
        },
        {
            code: "export default (a, b) => { console.log(a); };",
            parserOptions: { sourceType: "module" },
            errors: [{message: "'b' is defined but never used."}]
        },

        // caughtErrors
        {
            code: "try{}catch(err){};",
            options: [{caughtErrors: "all"}],
            errors: [{message: "'err' is defined but never used."}]
        },
        {
            code: "try{}catch(err){};",
            options: [{caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore"}],
            errors: [{message: "'err' is defined but never used."}]
        },

        // multiple try catch with one success
        {
            code: "try{}catch(ignoreErr){}try{}catch(err){};",
            options: [{caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore"}],
            errors: [{message: "'err' is defined but never used."}]
        },

        // multiple try catch both fail
        {
            code: "try{}catch(error){}try{}catch(err){};",
            options: [{caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore"}],
            errors: [
                {message: "'error' is defined but never used."},
                {message: "'err' is defined but never used."}
            ]
        },

        // caughtErrors with other configs
        {
            code: "try{}catch(err){};",
            options: [{vars: "all", args: "all", caughtErrors: "all"}],
            errors: [{message: "'err' is defined but never used."}]
        },

        // no conclict in ignore patterns
        {
            code: "try{}catch(err){};",
            options: [
                {
                    vars: "all",
                    args: "all",
                    caughtErrors: "all",
                    argsIgnorePattern: "^er"
                }
            ],
            errors: [{message: "'err' is defined but never used."}]
        },

        // Ignore reads for modifications to itself: https://github.com/eslint/eslint/issues/6348
        {code: "var a = 0; a = a + 1;", errors: [{message: "'a' is defined but never used."}]},
        {code: "var a = 0; a = a + a;", errors: [{message: "'a' is defined but never used."}]},
        {code: "var a = 0; a += a + 1;", errors: [{message: "'a' is defined but never used."}]},
        {code: "var a = 0; a++;", errors: [{message: "'a' is defined but never used."}]},
        {code: "function foo(a) { a = a + 1 } foo();", errors: [{message: "'a' is defined but never used."}]},
        {code: "function foo(a) { a += a + 1 } foo();", errors: [{message: "'a' is defined but never used."}]},
        {code: "function foo(a) { a++ } foo();", errors: [{message: "'a' is defined but never used."}]},
        {code: "var a = 3; a = a * 5 + 6;", errors: [{message: "'a' is defined but never used."}]},
        {code: "var a = 2, b = 4; a = a * 2 + b;", errors: [{message: "'a' is defined but never used."}]},

        // https://github.com/eslint/eslint/issues/6576 (For coverage)
        {
            code: "function foo(cb) { cb = function(a) { cb(1 + a); }; bar(not_cb); } foo();",
            errors: [{message: "'cb' is defined but never used."}]
        },
        {
            code: "function foo(cb) { cb = function(a) { return cb(1 + a); }(); } foo();",
            errors: [{message: "'cb' is defined but never used."}]
        },
        {
            code: "function foo(cb) { cb = (function(a) { cb(1 + a); }, cb); } foo();",
            errors: [{message: "'cb' is defined but never used."}]
        },
        {
            code: "function foo(cb) { cb = (0, function(a) { cb(1 + a); }); } foo();",
            errors: [{message: "'cb' is defined but never used."}]
        },

        // https://github.com/eslint/eslint/issues/6646
        {
            code: [
                "while (a) {",
                "    function foo(b) {",
                "        b = b + 1;",
                "    }",
                "    foo()",
                "}"
            ].join("\n"),
            errors: [{message: "'b' is defined but never used."}]
        },

        // https://github.com/eslint/eslint/issues/7124
        {
            code: "(function(a, b, c) {})",
            options: [{argsIgnorePattern: "c"}],
            errors: [{message: "'b' is defined but never used."}]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{argsIgnorePattern: "[cd]"}],
            parserOptions: {ecmaVersion: 6},
            errors: [{message: "'b' is defined but never used."}]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{argsIgnorePattern: "c"}],
            parserOptions: {ecmaVersion: 6},
            errors: [{message: "'d' is defined but never used."}]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{argsIgnorePattern: "d"}],
            parserOptions: {ecmaVersion: 6},
            errors: [{message: "'c' is defined but never used."}]
        },
    ]
});
