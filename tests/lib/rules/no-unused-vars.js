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

ruleTester.defineRule("use-every-a", context => {

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

/**
 * Returns an expected error for defined-but-not-used variables.
 * @param {string} varName The name of the variable
 * @param {string} [type] The node type (defaults to "Identifier")
 * @returns {Object} An expected error object
 */
function definedError(varName, type) {
    return { message: `'${varName}' is defined but never used.`, type: type || "Identifier" };
}

/**
 * Returns an expected error for assigned-but-not-used variables.
 * @param {string} varName The name of the variable
 * @param {string} [type] The node type (defaults to "Identifier")
 * @returns {Object} An expected error object
 */
function assignedError(varName, type) {
    return { message: `'${varName}' is assigned a value but never used.`, type: type || "Identifier" };
}

ruleTester.run("no-unused-vars", rule, {
    valid: [
        "var foo = 5;\n\nlabel: while (true) {\n  console.log(foo);\n  break label;\n}",
        "var foo = 5;\n\nwhile (true) {\n  console.log(foo);\n  break;\n}",
        { code: "for (let prop in box) {\n        box[prop] = parseInt(box[prop]);\n}", parserOptions: { ecmaVersion: 6 } },
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
        { code: "var a=10; (function() { alert(a); })();", options: [{ vars: "all" }] },
        { code: "function g(bar, baz) { return baz; }; g();", options: [{ vars: "all" }] },
        { code: "function g(bar, baz) { return baz; }; g();", options: [{ vars: "all", args: "after-used" }] },
        { code: "function g(bar, baz) { return bar; }; g();", options: [{ vars: "all", args: "none" }] },
        { code: "function g(bar, baz) { return 2; }; g();", options: [{ vars: "all", args: "none" }] },
        { code: "function g(bar, baz) { return bar + baz; }; g();", options: [{ vars: "local", args: "all" }] },
        { code: "var g = function(bar, baz) { return 2; }; g();", options: [{ vars: "all", args: "none" }] },
        "(function z() { z(); })();",
        { code: " ", globals: { a: true } },
        { code: "var who = \"Paul\";\nmodule.exports = `Hello ${who}!`;", parserOptions: { ecmaVersion: 6 } },
        { code: "export var foo = 123;", parserOptions: { sourceType: "module" } },
        { code: "export function foo () {}", parserOptions: { sourceType: "module" } },
        { code: "let toUpper = (partial) => partial.toUpperCase; export {toUpper}", parserOptions: { sourceType: "module" } },
        { code: "export class foo {}", parserOptions: { sourceType: "module" } },
        { code: "class Foo{}; var x = new Foo(); x.foo()", parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = \"hello!\";function bar(foobar = foo) {  foobar.replace(/!$/, \" world!\");}\nbar();", parserOptions: { ecmaVersion: 6 } },
        "function Foo(){}; var x = new Foo(); x.foo()",
        "function foo() {var foo = 1; return foo}; foo();",
        "function foo(foo) {return foo}; foo(1);",
        "function foo() {function foo() {return 1;}; return foo()}; foo();",
        { code: "function foo() {var foo = 1; return foo}; foo();", parserOptions: { parserOptions: { ecmaVersion: 6 } } },
        { code: "function foo(foo) {return foo}; foo(1);", parserOptions: { parserOptions: { ecmaVersion: 6 } } },
        { code: "function foo() {function foo() {return 1;}; return foo()}; foo();", parserOptions: { parserOptions: { ecmaVersion: 6 } } },
        { code: "const x = 1; const [y = x] = []; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 1; const {y = x} = {}; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 1; const {z: [y = x]} = {}; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = []; const {z: [y] = x} = {}; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 1; let y; [y = x] = []; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 1; let y; ({z: [y = x]} = {}); foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = []; let y; ({z: [y] = x} = {}); foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 1; function foo(y = x) { bar(y); } foo();", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 1; function foo({y = x} = {}) { bar(y); } foo();", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 1; function foo(y = function() { bar(x); }) { y(); } foo();", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1; var [y = x] = []; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1; var {y = x} = {}; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1; var {z: [y = x]} = {}; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = []; var {z: [y] = x} = {}; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1, y; [y = x] = []; foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1, y; ({z: [y = x]} = {}); foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = [], y; ({z: [y] = x} = {}); foo(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1; function foo(y = x) { bar(y); } foo();", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1; function foo({y = x} = {}) { bar(y); } foo();", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1; function foo(y = function(z = x) { bar(z); }) { y(); } foo();", parserOptions: { ecmaVersion: 6 } },
        { code: "var x = 1; function foo(y = function() { bar(x); }) { y(); } foo();", parserOptions: { ecmaVersion: 6 } },

        // exported variables should work
        "/*exported toaster*/ var toaster = 'great'",
        "/*exported toaster, poster*/ var toaster = 1; poster = 0;",
        { code: "/*exported x*/ var { x } = y", parserOptions: { ecmaVersion: 6 } },
        { code: "/*exported x, y*/  var { x, y } = z", parserOptions: { ecmaVersion: 6 } },

        // Can mark variables as used via context.markVariableAsUsed()
        "/*eslint use-every-a:1*/ var a;",
        "/*eslint use-every-a:1*/ !function(a) { return 1; }",
        "/*eslint use-every-a:1*/ !function() { var a; return 1 }",

        // ignore pattern
        { code: "var _a;", options: [{ vars: "all", varsIgnorePattern: "^_" }] },
        { code: "var a; function foo() { var _b; } foo();", options: [{ vars: "local", varsIgnorePattern: "^_" }] },
        { code: "function foo(_a) { } foo();", options: [{ args: "all", argsIgnorePattern: "^_" }] },
        { code: "function foo(a, _b) { return a; } foo();", options: [{ args: "after-used", argsIgnorePattern: "^_" }] },
        { code: "var [ firstItemIgnored, secondItem ] = items;\nconsole.log(secondItem);", options: [{ vars: "all", varsIgnorePattern: "[iI]gnored" }], parserOptions: { ecmaVersion: 6 } },

        // for-in loops (see #2342)
        "(function(obj) { var name; for ( name in obj ) return; })({});",
        "(function(obj) { var name; for ( name in obj ) { return; } })({});",
        "(function(obj) { for ( var name in obj ) { return true } })({})",
        "(function(obj) { for ( var name in obj ) return true })({})",

        { code: "(function(obj) { let name; for ( name in obj ) return; })({});", parserOptions: { ecmaVersion: 6 } },
        { code: "(function(obj) { let name; for ( name in obj ) { return; } })({});", parserOptions: { ecmaVersion: 6 } },
        { code: "(function(obj) { for ( let name in obj ) { return true } })({})", parserOptions: { ecmaVersion: 6 } },
        { code: "(function(obj) { for ( let name in obj ) return true })({})", parserOptions: { ecmaVersion: 6 } },

        { code: "(function(obj) { for ( const name in obj ) { return true } })({})", parserOptions: { ecmaVersion: 6 } },
        { code: "(function(obj) { for ( const name in obj ) return true })({})", parserOptions: { ecmaVersion: 6 } },

        // caughtErrors
        {
            code: "try{}catch(err){console.error(err);}",
            options: [{ caughtErrors: "all" }]
        },
        {
            code: "try{}catch(err){}",
            options: [{ caughtErrors: "none" }]
        },
        {
            code: "try{}catch(ignoreErr){}",
            options: [{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" }]
        },

        // caughtErrors with other combinations
        {
            code: "try{}catch(err){}",
            options: [{ vars: "all", args: "all" }]
        },

        // Using object rest for variable omission
        {
            code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(coords);",
            options: [{ ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2018 }
        },

        // https://github.com/eslint/eslint/issues/6348
        "var a = 0, b; b = a = a + 1; foo(b);",
        "var a = 0, b; b = a += a + 1; foo(b);",
        "var a = 0, b; b = a++; foo(b);",
        "function foo(a) { var b = a = a + 1; bar(b) } foo();",
        "function foo(a) { var b = a += a + 1; bar(b) } foo();",
        "function foo(a) { var b = a++; bar(b) } foo();",

        // https://github.com/eslint/eslint/issues/6576
        [
            "var unregisterFooWatcher;",
            "// ...",
            "unregisterFooWatcher = $scope.$watch( \"foo\", function() {",
            "    // ...some code..",
            "    unregisterFooWatcher();",
            "});"
        ].join("\n"),
        [
            "var ref;",
            "ref = setInterval(",
            "    function(){",
            "        clearInterval(ref);",
            "    }, 10);"
        ].join("\n"),
        [
            "var _timer;",
            "function f() {",
            "    _timer = setTimeout(function () {}, _timer ? 100 : 0);",
            "}",
            "f();"
        ].join("\n"),
        "function foo(cb) { cb = function() { function something(a) { cb(1 + a); } register(something); }(); } foo();",
        { code: "function* foo(cb) { cb = yield function(a) { cb(1 + a); }; } foo();", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(cb) { cb = tag`hello${function(a) { cb(1 + a); }}`; } foo();", parserOptions: { ecmaVersion: 6 } },
        "function foo(cb) { var b; cb = b = function(a) { cb(1 + a); }; b(); } foo();",

        // https://github.com/eslint/eslint/issues/6646
        [
            "function someFunction() {",
            "    var a = 0, i;",
            "    for (i = 0; i < 2; i++) {",
            "        a = myFunction(a);",
            "    }",
            "}",
            "someFunction();"
        ].join("\n"),

        // https://github.com/eslint/eslint/issues/7124
        {
            code: "(function(a, b, {c, d}) { d })",
            options: [{ argsIgnorePattern: "c" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "(function(a, b, {c, d}) { c })",
            options: [{ argsIgnorePattern: "d" }],
            parserOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/7250
        {
            code: "(function(a, b, c) { c })",
            options: [{ argsIgnorePattern: "c" }]
        },
        {
            code: "(function(a, b, {c, d}) { c })",
            options: [{ argsIgnorePattern: "[cd]" }],
            parserOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/7351
        {
            code: "(class { set foo(UNUSED) {} })",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { set bar(UNUSED) {} } console.log(Foo)",
            parserOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/8119
        {
            code: "(({a, ...rest}) => rest)",
            options: [{ args: "all", ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2018 }
        },

        // https://github.com/eslint/eslint/issues/10952
        "/*eslint use-every-a:1*/ !function(b, a) { return 1 }",

        // https://github.com/eslint/eslint/issues/10982
        "var a = function () { a(); }; a();",
        "var a = function(){ return function () { a(); } }; a();",
        {
            code: "const a = () => { a(); }; a();",
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "const a = () => () => { a(); }; a();",
            parserOptions: { ecmaVersion: 2015 }
        }
    ],
    invalid: [
        { code: "function foox() { return foox(); }", errors: [definedError("foox")] },
        { code: "(function() { function foox() { if (true) { return foox(); } } }())", errors: [definedError("foox")] },
        { code: "var a=10", errors: [assignedError("a")] },
        { code: "function f() { var a = 1; return function(){ f(a *= 2); }; }", errors: [definedError("f")] },
        { code: "function f() { var a = 1; return function(){ f(++a); }; }", errors: [definedError("f")] },
        { code: "/*global a */", errors: [definedError("a", "Program")] },
        { code: "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});};", errors: [definedError("foo")] },
        { code: "var a=10;", options: ["all"], errors: [assignedError("a")] },
        { code: "var a=10; a=20;", options: ["all"], errors: [assignedError("a")] },
        { code: "var a=10; (function() { var a = 1; alert(a); })();", options: ["all"], errors: [assignedError("a")] },
        { code: "var a=10, b=0, c=null; alert(a+b)", options: ["all"], errors: [assignedError("c")] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);", options: ["all"], errors: [assignedError("b")] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);", options: ["all"], errors: [assignedError("b"), assignedError("c")] },
        { code: "function f(){var a=[];return a.map(function(){});}", options: ["all"], errors: [definedError("f")] },
        { code: "function f(){var a=[];return a.map(function g(){});}", options: ["all"], errors: [definedError("f")] },
        { code: "function foo() {function foo(x) {\nreturn x; }; return function() {return foo; }; }", errors: [{ message: "'foo' is defined but never used.", line: 1, type: "Identifier" }] },
        { code: "function f(){var x;function a(){x=42;}function b(){alert(x);}}", options: ["all"], errors: 3 },
        { code: "function f(a) {}; f();", options: ["all"], errors: [definedError("a")] },
        { code: "function a(x, y, z){ return y; }; a();", options: ["all"], errors: [definedError("z")] },
        { code: "var min = Math.min", options: ["all"], errors: [assignedError("min")] },
        { code: "var min = {min: 1}", options: ["all"], errors: [assignedError("min")] },
        { code: "Foo.bar = function(baz) { return 1; };", options: ["all"], errors: [definedError("baz")] },
        { code: "var min = {min: 1}", options: [{ vars: "all" }], errors: [assignedError("min")] },
        { code: "function gg(baz, bar) { return baz; }; gg();", options: [{ vars: "all" }], errors: [definedError("bar")] },
        { code: "(function(foo, baz, bar) { return baz; })();", options: [{ vars: "all", args: "after-used" }], errors: [definedError("bar")] },
        { code: "(function(foo, baz, bar) { return baz; })();", options: [{ vars: "all", args: "all" }], errors: [definedError("foo"), definedError("bar")] },
        { code: "(function z(foo) { var bar = 33; })();", options: [{ vars: "all", args: "all" }], errors: [definedError("foo"), assignedError("bar")] },
        { code: "(function z(foo) { z(); })();", options: [{}], errors: [definedError("foo")] },
        { code: "function f() { var a = 1; return function(){ f(a = 2); }; }", options: [{}], errors: [definedError("f"), { message: "'a' is assigned a value but never used." }] },
        { code: "import x from \"y\";", parserOptions: { sourceType: "module" }, errors: [definedError("x")] },
        { code: "export function fn2({ x, y }) {\n console.log(x); \n};", parserOptions: { sourceType: "module" }, errors: [definedError("y")] },
        { code: "export function fn2( x, y ) {\n console.log(x); \n};", parserOptions: { sourceType: "module" }, errors: [definedError("y")] },

        // exported
        { code: "/*exported max*/ var max = 1, min = {min: 1}", errors: [assignedError("min")] },
        { code: "/*exported x*/ var { x, y } = z", parserOptions: { ecmaVersion: 6 }, errors: [assignedError("y")] },

        // ignore pattern
        {
            code: "var _a; var b;",
            options: [{ vars: "all", varsIgnorePattern: "^_" }],
            errors: [{ message: "'b' is defined but never used. Allowed unused vars must match /^_/.", line: 1, column: 13 }]
        },
        {
            code: "var a; function foo() { var _b; var c_; } foo();",
            options: [{ vars: "local", varsIgnorePattern: "^_" }],
            errors: [{ message: "'c_' is defined but never used. Allowed unused vars must match /^_/.", line: 1, column: 37 }]
        },
        {
            code: "function foo(a, _b) { } foo();",
            options: [{ args: "all", argsIgnorePattern: "^_" }],
            errors: [{ message: "'a' is defined but never used. Allowed unused args must match /^_/.", line: 1, column: 14 }]
        },
        {
            code: "function foo(a, _b, c) { return a; } foo();",
            options: [{ args: "after-used", argsIgnorePattern: "^_" }],
            errors: [{ message: "'c' is defined but never used. Allowed unused args must match /^_/.", line: 1, column: 21 }]
        },
        {
            code: "function foo(_a) { } foo();",
            options: [{ args: "all", argsIgnorePattern: "[iI]gnored" }],
            errors: [{ message: "'_a' is defined but never used. Allowed unused args must match /[iI]gnored/.", line: 1, column: 14 }]
        },
        {
            code: "var [ firstItemIgnored, secondItem ] = items;",
            options: [{ vars: "all", varsIgnorePattern: "[iI]gnored" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'secondItem' is assigned a value but never used. Allowed unused vars must match /[iI]gnored/.", line: 1, column: 25 }]
        },

        // for-in loops (see #2342)
        { code: "(function(obj) { var name; for ( name in obj ) { i(); return; } })({});", errors: [{ message: "'name' is assigned a value but never used.", line: 1, column: 22 }] },
        { code: "(function(obj) { var name; for ( name in obj ) { } })({});", errors: [{ message: "'name' is assigned a value but never used.", line: 1, column: 22 }] },
        { code: "(function(obj) { for ( var name in obj ) { } })({});", errors: [{ message: "'name' is assigned a value but never used.", line: 1, column: 28 }] },

        // https://github.com/eslint/eslint/issues/3617
        {
            code: "\n/* global foobar, foo, bar */\nfoobar;",
            errors: [
                { line: 2, column: 19, message: "'foo' is defined but never used." },
                { line: 2, column: 24, message: "'bar' is defined but never used." }
            ]
        },
        {
            code: "\n/* global foobar,\n   foo,\n   bar\n */\nfoobar;",
            errors: [
                { line: 3, column: 4, message: "'foo' is defined but never used." },
                { line: 4, column: 4, message: "'bar' is defined but never used." }
            ]
        },

        // Rest property sibling without ignoreRestSiblings
        {
            code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(coords);",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { line: 2, column: 9, message: "'type' is assigned a value but never used." }
            ]
        },

        // Unused rest property with ignoreRestSiblings
        {
            code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
            options: [{ ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { line: 2, column: 18, message: "'coords' is assigned a value but never used." }
            ]
        },

        // Unused rest property without ignoreRestSiblings
        {
            code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { line: 2, column: 18, message: "'coords' is assigned a value but never used." }
            ]
        },

        // Nested array destructuring with rest property
        {
            code: "const data = { vars: ['x','y'], x: 1, y: 2 };\nconst { vars: [x], ...coords } = data;\n console.log(coords)",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { line: 2, column: 16, message: "'x' is assigned a value but never used." }
            ]
        },

        // Nested object destructuring with rest property
        {
            code: "const data = { defaults: { x: 0 }, x: 1, y: 2 };\nconst { defaults: { x }, ...coords } = data;\n console.log(coords)",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { line: 2, column: 21, message: "'x' is assigned a value but never used." }
            ]
        },

        // https://github.com/eslint/eslint/issues/8119
        {
            code: "(({a, ...rest}) => {})",
            options: [{ args: "all", ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: ["'rest' is defined but never used."]
        },

        // https://github.com/eslint/eslint/issues/3714
        {
            code: "/* global a$fooz,$foo */\na$fooz;",
            errors: [
                { line: 1, column: 18, message: "'$foo' is defined but never used." }
            ]
        },
        {
            code: "/* globals a$fooz, $ */\na$fooz;",
            errors: [
                { line: 1, column: 20, message: "'$' is defined but never used." }
            ]
        },
        {
            code: "/*globals $foo*/",
            errors: [
                { line: 1, column: 11, message: "'$foo' is defined but never used." }
            ]
        },
        {
            code: "/* global global*/",
            errors: [
                { line: 1, column: 11, message: "'global' is defined but never used." }
            ]
        },
        {
            code: "/*global foo:true*/",
            errors: [
                { line: 1, column: 10, message: "'foo' is defined but never used." }
            ]
        },

        // non ascii.
        {
            code: "/*global 変数, 数*/\n変数;",
            errors: [
                { line: 1, column: 14, message: "'数' is defined but never used." }
            ]
        },

        // surrogate pair.
        {
            code: "/*global 𠮷𩸽, 𠮷*/\n\\u{20BB7}\\u{29E3D};",
            errors: [
                { line: 1, column: 16, message: "'𠮷' is defined but never used." }
            ],
            env: { es6: true }
        },

        // https://github.com/eslint/eslint/issues/4047
        {
            code: "export default function(a) {}",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'a' is defined but never used." }]
        },
        {
            code: "export default function(a, b) { console.log(a); }",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'b' is defined but never used." }]
        },
        {
            code: "export default (function(a) {});",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'a' is defined but never used." }]
        },
        {
            code: "export default (function(a, b) { console.log(a); });",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'b' is defined but never used." }]
        },
        {
            code: "export default (a) => {};",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'a' is defined but never used." }]
        },
        {
            code: "export default (a, b) => { console.log(a); };",
            parserOptions: { sourceType: "module" },
            errors: [{ message: "'b' is defined but never used." }]
        },

        // caughtErrors
        {
            code: "try{}catch(err){};",
            options: [{ caughtErrors: "all" }],
            errors: [{ message: "'err' is defined but never used." }]
        },
        {
            code: "try{}catch(err){};",
            options: [{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" }],
            errors: [{ message: "'err' is defined but never used. Allowed unused args must match /^ignore/." }]
        },

        // multiple try catch with one success
        {
            code: "try{}catch(ignoreErr){}try{}catch(err){};",
            options: [{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" }],
            errors: [{ message: "'err' is defined but never used. Allowed unused args must match /^ignore/." }]
        },

        // multiple try catch both fail
        {
            code: "try{}catch(error){}try{}catch(err){};",
            options: [{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" }],
            errors: [
                { message: "'error' is defined but never used. Allowed unused args must match /^ignore/." },
                { message: "'err' is defined but never used. Allowed unused args must match /^ignore/." }
            ]
        },

        // caughtErrors with other configs
        {
            code: "try{}catch(err){};",
            options: [{ vars: "all", args: "all", caughtErrors: "all" }],
            errors: [{ message: "'err' is defined but never used." }]
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
            errors: [{ message: "'err' is defined but never used." }]
        },

        // Ignore reads for modifications to itself: https://github.com/eslint/eslint/issues/6348
        { code: "var a = 0; a = a + 1;", errors: [{ message: "'a' is assigned a value but never used." }] },
        { code: "var a = 0; a = a + a;", errors: [{ message: "'a' is assigned a value but never used." }] },
        { code: "var a = 0; a += a + 1;", errors: [{ message: "'a' is assigned a value but never used." }] },
        { code: "var a = 0; a++;", errors: [{ message: "'a' is assigned a value but never used." }] },
        { code: "function foo(a) { a = a + 1 } foo();", errors: [{ message: "'a' is assigned a value but never used." }] },
        { code: "function foo(a) { a += a + 1 } foo();", errors: [{ message: "'a' is assigned a value but never used." }] },
        { code: "function foo(a) { a++ } foo();", errors: [{ message: "'a' is assigned a value but never used." }] },
        { code: "var a = 3; a = a * 5 + 6;", errors: [{ message: "'a' is assigned a value but never used." }] },
        { code: "var a = 2, b = 4; a = a * 2 + b;", errors: [{ message: "'a' is assigned a value but never used." }] },

        // https://github.com/eslint/eslint/issues/6576 (For coverage)
        {
            code: "function foo(cb) { cb = function(a) { cb(1 + a); }; bar(not_cb); } foo();",
            errors: [{ message: "'cb' is assigned a value but never used." }]
        },
        {
            code: "function foo(cb) { cb = function(a) { return cb(1 + a); }(); } foo();",
            errors: [{ message: "'cb' is assigned a value but never used." }]
        },
        {
            code: "function foo(cb) { cb = (function(a) { cb(1 + a); }, cb); } foo();",
            errors: [{ message: "'cb' is assigned a value but never used." }]
        },
        {
            code: "function foo(cb) { cb = (0, function(a) { cb(1 + a); }); } foo();",
            errors: [{ message: "'cb' is assigned a value but never used." }]
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
            errors: [{ message: "'b' is assigned a value but never used." }]
        },

        // https://github.com/eslint/eslint/issues/7124
        {
            code: "(function(a, b, c) {})",
            options: [{ argsIgnorePattern: "c" }],
            errors: [
                {
                    message: "'a' is defined but never used. Allowed unused args must match /c/."
                },
                {
                    message: "'b' is defined but never used. Allowed unused args must match /c/."
                }
            ]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{ argsIgnorePattern: "[cd]" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "'a' is defined but never used. Allowed unused args must match /[cd]/."
                },
                {
                    message: "'b' is defined but never used. Allowed unused args must match /[cd]/."
                }
            ]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{ argsIgnorePattern: "c" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "'a' is defined but never used. Allowed unused args must match /c/."
                },
                {
                    message: "'b' is defined but never used. Allowed unused args must match /c/."
                },
                {
                    message: "'d' is defined but never used. Allowed unused args must match /c/."
                }
            ]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{ argsIgnorePattern: "d" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "'a' is defined but never used. Allowed unused args must match /d/."
                },
                {
                    message: "'b' is defined but never used. Allowed unused args must match /d/."
                },
                {
                    message: "'c' is defined but never used. Allowed unused args must match /d/."
                }
            ]
        },
        {
            code: "/*global\rfoo*/",
            errors: [{ message: "'foo' is defined but never used.", line: 2, column: 1 }]
        },

        // https://github.com/eslint/eslint/issues/8442
        {
            code: "(function ({ a }, b ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "'a' is defined but never used."
            ]
        },
        {
            code: "(function ({ a }, { b, c } ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "'a' is defined but never used.",
                "'c' is defined but never used."
            ]
        },
        {
            code: "(function ({ a, b }, { c } ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "'a' is defined but never used.",
                "'c' is defined but never used."
            ]
        },
        {
            code: "(function ([ a ], b ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "'a' is defined but never used."
            ]
        },
        {
            code: "(function ([ a ], [ b, c ] ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "'a' is defined but never used.",
                "'c' is defined but never used."
            ]
        },
        {
            code: "(function ([ a, b ], [ c ] ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                "'a' is defined but never used.",
                "'c' is defined but never used."
            ]
        },

        // https://github.com/eslint/eslint/issues/9774
        {
            code: "(function(_a) {})();",
            options: [{ args: "all", varsIgnorePattern: "^_" }],
            errors: [{ message: "'_a' is defined but never used." }]
        },
        {
            code: "(function(_a) {})();",
            options: [{ args: "all", caughtErrorsIgnorePattern: "^_" }],
            errors: [{ message: "'_a' is defined but never used." }]
        },

        // https://github.com/eslint/eslint/issues/10982
        {
            code: "var a = function() { a(); };",
            errors: [{ message: "'a' is assigned a value but never used." }]
        },
        {
            code: "var a = function(){ return function() { a(); } };",
            errors: [
                { message: "'a' is assigned a value but never used." }
            ]
        },
        {
            code: "const a = () => { a(); };",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ message: "'a' is assigned a value but never used." }]
        },
        {
            code: "const a = () => () => { a(); };",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ message: "'a' is assigned a value but never used." }]
        }
    ]
});
