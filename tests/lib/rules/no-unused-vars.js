/**
 * @fileoverview Tests for no-unused-vars rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unused-vars"),
    { RuleTester } = require("../../../lib/rule-tester");

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
 * @param {string} [additional] The additional text for the message data
 * @param {string} [type] The node type (defaults to "Identifier")
 * @returns {Object} An expected error object
 */
function definedError(varName, additional = "", type = "Identifier") {
    return {
        messageId: "unusedVar",
        data: {
            varName,
            action: "defined",
            additional
        },
        type
    };
}

/**
 * Returns an expected error for assigned-but-not-used variables.
 * @param {string} varName The name of the variable
 * @param {string} [additional] The additional text for the message data
 * @param {string} [type] The node type (defaults to "Identifier")
 * @returns {Object} An expected error object
 */
function assignedError(varName, additional = "", type = "Identifier") {
    return {
        messageId: "unusedVar",
        data: {
            varName,
            action: "assigned a value",
            additional
        },
        type
    };
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
        { code: "export var foo = 123;", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function foo () {}", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "let toUpper = (partial) => partial.toUpperCase; export {toUpper}", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export class foo {}", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
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
        {
            code: "const [ a, _b, c ] = items;\nconsole.log(a+c);",
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const [ [a, _b, c] ] = items;\nconsole.log(a+c);",
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "const { x: [_a, foo] } = bar;\nconsole.log(foo);",
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function baz([_b, foo]) { foo; };\nbaz()",
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function baz({x: [_b, foo]}) {foo};\nbaz()",
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function baz([{x: [_b, foo]}]) {foo};\nbaz()",
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: `
            let _a, b;
            foo.forEach(item => {
                [_a, b] = item;
                doSomething(b);
            });
            `,
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: `
            // doesn't report _x
            let _x, y;
            _x = 1;
            [_x, y] = foo;
            y;

            // doesn't report _a
            let _a, b;
            [_a, b] = foo;
            _a = 1;
            b;
            `,
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: `
            // doesn't report _x
            let _x, y;
            _x = 1;
            [_x, y] = foo;
            y;

            // doesn't report _a
            let _a, b;
            _a = 1;
            ({_a, ...b } = foo);
            b;
            `,
            options: [{ destructuredArrayIgnorePattern: "^_", ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2018 }
        },

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

        // Sequence Expressions (See https://github.com/eslint/eslint/issues/14325)
        { code: "let x = 0; foo = (0, x++);", parserOptions: { ecmaVersion: 6 } },
        { code: "let x = 0; foo = (0, x += 1);", parserOptions: { ecmaVersion: 6 } },
        { code: "let x = 0; foo = (0, x = x + 1);", parserOptions: { ecmaVersion: 6 } },

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

        // https://github.com/eslint/eslint/issues/14163
        {
            code: "let foo, rest;\n({ foo, ...rest } = something);\nconsole.log(rest);",
            options: [{ ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2020 }
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
        },

        // export * as ns from "source"
        {
            code: 'export * as ns from "source"',
            parserOptions: { ecmaVersion: 2020, sourceType: "module" }
        },

        // import.meta
        {
            code: "import.meta",
            parserOptions: { ecmaVersion: 2020, sourceType: "module" }
        }
    ],
    invalid: [
        { code: "function foox() { return foox(); }", errors: [definedError("foox")] },
        { code: "(function() { function foox() { if (true) { return foox(); } } }())", errors: [definedError("foox")] },
        { code: "var a=10", errors: [assignedError("a")] },
        { code: "function f() { var a = 1; return function(){ f(a *= 2); }; }", errors: [definedError("f")] },
        { code: "function f() { var a = 1; return function(){ f(++a); }; }", errors: [definedError("f")] },
        { code: "/*global a */", errors: [definedError("a", "", "Program")] },
        { code: "function foo(first, second) {\ndoStuff(function() {\nconsole.log(second);});};", errors: [definedError("foo")] },
        { code: "var a=10;", options: ["all"], errors: [assignedError("a")] },
        { code: "var a=10; a=20;", options: ["all"], errors: [assignedError("a")] },
        { code: "var a=10; (function() { var a = 1; alert(a); })();", options: ["all"], errors: [assignedError("a")] },
        { code: "var a=10, b=0, c=null; alert(a+b)", options: ["all"], errors: [assignedError("c")] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; alert(a+b+c); }, 0);", options: ["all"], errors: [assignedError("b")] },
        { code: "var a=10, b=0, c=null; setTimeout(function() { var b=2; var c=2; alert(a+b+c); }, 0);", options: ["all"], errors: [assignedError("b"), assignedError("c")] },
        { code: "function f(){var a=[];return a.map(function(){});}", options: ["all"], errors: [definedError("f")] },
        { code: "function f(){var a=[];return a.map(function g(){});}", options: ["all"], errors: [definedError("f")] },
        {
            code: "function foo() {function foo(x) {\nreturn x; }; return function() {return foo; }; }",
            errors: [{
                messageId: "unusedVar",
                data: { varName: "foo", action: "defined", additional: "" },
                line: 1,
                type: "Identifier"
            }]
        },
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
        { code: "function f() { var a = 1; return function(){ f(a = 2); }; }", options: [{}], errors: [definedError("f"), assignedError("a")] },
        { code: "import x from \"y\";", parserOptions: { ecmaVersion: 6, sourceType: "module" }, errors: [definedError("x")] },
        { code: "export function fn2({ x, y }) {\n console.log(x); \n};", parserOptions: { ecmaVersion: 6, sourceType: "module" }, errors: [definedError("y")] },
        { code: "export function fn2( x, y ) {\n console.log(x); \n};", parserOptions: { ecmaVersion: 6, sourceType: "module" }, errors: [definedError("y")] },

        // exported
        { code: "/*exported max*/ var max = 1, min = {min: 1}", errors: [assignedError("min")] },
        { code: "/*exported x*/ var { x, y } = z", parserOptions: { ecmaVersion: 6 }, errors: [assignedError("y")] },

        // ignore pattern
        {
            code: "var _a; var b;",
            options: [{ vars: "all", varsIgnorePattern: "^_" }],
            errors: [{
                line: 1,
                column: 13,
                messageId: "unusedVar",
                data: {
                    varName: "b",
                    action: "defined",
                    additional: ". Allowed unused vars must match /^_/u"
                }
            }]
        },
        {
            code: "var a; function foo() { var _b; var c_; } foo();",
            options: [{ vars: "local", varsIgnorePattern: "^_" }],
            errors: [{
                line: 1,
                column: 37,
                messageId: "unusedVar",
                data: {
                    varName: "c_",
                    action: "defined",
                    additional: ". Allowed unused vars must match /^_/u"
                }
            }]
        },
        {
            code: "function foo(a, _b) { } foo();",
            options: [{ args: "all", argsIgnorePattern: "^_" }],
            errors: [{
                line: 1,
                column: 14,
                messageId: "unusedVar",
                data: {
                    varName: "a",
                    action: "defined",
                    additional: ". Allowed unused args must match /^_/u"
                }
            }]
        },
        {
            code: "function foo(a, _b, c) { return a; } foo();",
            options: [{ args: "after-used", argsIgnorePattern: "^_" }],
            errors: [{
                line: 1,
                column: 21,
                messageId: "unusedVar",
                data: {
                    varName: "c",
                    action: "defined",
                    additional: ". Allowed unused args must match /^_/u"
                }
            }]
        },
        {
            code: "function foo(_a) { } foo();",
            options: [{ args: "all", argsIgnorePattern: "[iI]gnored" }],
            errors: [{
                line: 1,
                column: 14,
                messageId: "unusedVar",
                data: {
                    varName: "_a",
                    action: "defined",
                    additional: ". Allowed unused args must match /[iI]gnored/u"
                }
            }]
        },
        {
            code: "var [ firstItemIgnored, secondItem ] = items;",
            options: [{ vars: "all", varsIgnorePattern: "[iI]gnored" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                line: 1,
                column: 25,
                messageId: "unusedVar",
                data: {
                    varName: "secondItem",
                    action: "assigned a value",
                    additional: ". Allowed unused vars must match /[iI]gnored/u"
                }
            }]
        },

        // https://github.com/eslint/eslint/issues/15611
        {
            code: `
            const array = ['a', 'b', 'c'];
            const [a, _b, c] = array;
            const newArray = [a, c];
            `,
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [

                // should report only `newArray`
                { ...assignedError("newArray"), line: 4, column: 19 }
            ]
        },
        {
            code: `
            const array = ['a', 'b', 'c', 'd', 'e'];
            const [a, _b, c] = array;
            `,
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                {
                    ...assignedError("a", ". Allowed unused elements of array destructuring patterns must match /^_/u"),
                    line: 3,
                    column: 20
                },
                {
                    ...assignedError("c", ". Allowed unused elements of array destructuring patterns must match /^_/u"),
                    line: 3,
                    column: 27
                }
            ]
        },
        {
            code: `
            const array = ['a', 'b', 'c'];
            const [a, _b, c] = array;
            const fooArray = ['foo'];
            const barArray = ['bar'];
            const ignoreArray = ['ignore'];
            `,
            options: [{ destructuredArrayIgnorePattern: "^_", varsIgnorePattern: "ignore" }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                {
                    ...assignedError("a", ". Allowed unused elements of array destructuring patterns must match /^_/u"),
                    line: 3,
                    column: 20
                },
                {
                    ...assignedError("c", ". Allowed unused elements of array destructuring patterns must match /^_/u"),
                    line: 3,
                    column: 27
                },
                {
                    ...assignedError("fooArray", ". Allowed unused vars must match /ignore/u"),
                    line: 4,
                    column: 19
                },
                {
                    ...assignedError("barArray", ". Allowed unused vars must match /ignore/u"),
                    line: 5,
                    column: 19
                }
            ]
        },
        {
            code: `
            const array = [obj];
            const [{_a, foo}] = array;
            console.log(foo);
            `,
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                {
                    ...assignedError("_a"),
                    line: 3,
                    column: 21
                }
            ]
        },
        {
            code: `
            function foo([{_a, bar}]) {
                bar;
            }
            foo();
            `,
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                {
                    ...definedError("_a"),
                    line: 2,
                    column: 28
                }
            ]
        },
        {
            code: `
            let _a, b;

            foo.forEach(item => {
                [a, b] = item;
            });
            `,
            options: [{ destructuredArrayIgnorePattern: "^_" }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                {
                    ...definedError("_a"),
                    line: 2,
                    column: 17
                },
                {
                    ...assignedError("b"),
                    line: 2,
                    column: 21
                }
            ]
        },

        // for-in loops (see #2342)
        {
            code: "(function(obj) { var name; for ( name in obj ) { i(); return; } })({});",
            errors: [{
                line: 1,
                column: 34,
                messageId: "unusedVar",
                data: {
                    varName: "name",
                    action: "assigned a value",
                    additional: ""
                }
            }]
        },
        {
            code: "(function(obj) { var name; for ( name in obj ) { } })({});",
            errors: [{
                line: 1,
                column: 34,
                messageId: "unusedVar",
                data: {
                    varName: "name",
                    action: "assigned a value",
                    additional: ""
                }
            }]
        },
        {
            code: "(function(obj) { for ( var name in obj ) { } })({});",
            errors: [{
                line: 1,
                column: 28,
                messageId: "unusedVar",
                data: {
                    varName: "name",
                    action: "assigned a value",
                    additional: ""
                }
            }]
        },

        // https://github.com/eslint/eslint/issues/3617
        {
            code: "\n/* global foobar, foo, bar */\nfoobar;",
            errors: [
                {
                    line: 2,
                    endLine: 2,
                    column: 19,
                    endColumn: 22,
                    messageId: "unusedVar",
                    data: {
                        varName: "foo",
                        action: "defined",
                        additional: ""
                    }
                },
                {
                    line: 2,
                    endLine: 2,
                    column: 24,
                    endColumn: 27,
                    messageId: "unusedVar",
                    data: {
                        varName: "bar",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },
        {
            code: "\n/* global foobar,\n   foo,\n   bar\n */\nfoobar;",
            errors: [
                {
                    line: 3,
                    column: 4,
                    endLine: 3,
                    endColumn: 7,
                    messageId: "unusedVar",
                    data: {
                        varName: "foo",
                        action: "defined",
                        additional: ""
                    }
                },
                {
                    line: 4,
                    column: 4,
                    endLine: 4,
                    endColumn: 7,
                    messageId: "unusedVar",
                    data: {
                        varName: "bar",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },

        // Rest property sibling without ignoreRestSiblings
        {
            code: "const data = { type: 'coords', x: 1, y: 2 };\nconst { type, ...coords } = data;\n console.log(coords);",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    line: 2,
                    column: 9,
                    messageId: "unusedVar",
                    data: {
                        varName: "type",
                        action: "assigned a value",
                        additional: ""
                    }
                }
            ]
        },

        // Unused rest property with ignoreRestSiblings
        {
            code: "const data = { type: 'coords', x: 2, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
            options: [{ ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    line: 2,
                    column: 18,
                    messageId: "unusedVar",
                    data: {
                        varName: "coords",
                        action: "assigned a value",
                        additional: ""
                    }
                }
            ]
        },
        {
            code: "let type, coords;\n({ type, ...coords } = data);\n console.log(type)",
            options: [{ ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    line: 2,
                    column: 13,
                    messageId: "unusedVar",
                    data: {
                        varName: "coords",
                        action: "assigned a value",
                        additional: ""
                    }
                }
            ]
        },

        // Unused rest property without ignoreRestSiblings
        {
            code: "const data = { type: 'coords', x: 3, y: 2 };\nconst { type, ...coords } = data;\n console.log(type)",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    line: 2,
                    column: 18,
                    messageId: "unusedVar",
                    data: {
                        varName: "coords",
                        action: "assigned a value",
                        additional: ""
                    }
                }
            ]
        },

        // Nested array destructuring with rest property
        {
            code: "const data = { vars: ['x','y'], x: 1, y: 2 };\nconst { vars: [x], ...coords } = data;\n console.log(coords)",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    line: 2,
                    column: 16,
                    messageId: "unusedVar",
                    data: {
                        varName: "x",
                        action: "assigned a value",
                        additional: ""
                    }
                }
            ]
        },

        // Nested object destructuring with rest property
        {
            code: "const data = { defaults: { x: 0 }, x: 1, y: 2 };\nconst { defaults: { x }, ...coords } = data;\n console.log(coords)",
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                {
                    line: 2,
                    column: 21,
                    messageId: "unusedVar",
                    data: {
                        varName: "x",
                        action: "assigned a value",
                        additional: ""
                    }
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/8119
        {
            code: "(({a, ...rest}) => {})",
            options: [{ args: "all", ignoreRestSiblings: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [definedError("rest")]
        },

        // https://github.com/eslint/eslint/issues/3714
        {
            code: "/* global a$fooz,$foo */\na$fooz;",
            errors: [
                {
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 22,
                    messageId: "unusedVar",
                    data: {
                        varName: "$foo",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },
        {
            code: "/* globals a$fooz, $ */\na$fooz;",
            errors: [
                {
                    line: 1,
                    column: 20,
                    endLine: 1,
                    endColumn: 21,
                    messageId: "unusedVar",
                    data: {
                        varName: "$",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },
        {
            code: "/*globals $foo*/",
            errors: [
                {
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 15,
                    messageId: "unusedVar",
                    data: {
                        varName: "$foo",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },
        {
            code: "/* global global*/",
            errors: [
                {
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 17,
                    messageId: "unusedVar",
                    data: {
                        varName: "global",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },
        {
            code: "/*global foo:true*/",
            errors: [
                {
                    line: 1,
                    column: 10,
                    endLine: 1,
                    endColumn: 13,
                    messageId: "unusedVar",
                    data: {
                        varName: "foo",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },

        // non ascii.
        {
            code: "/*global 変数, 数*/\n変数;",
            errors: [
                {
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15,
                    messageId: "unusedVar",
                    data: {
                        varName: "数",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },

        // surrogate pair.
        {
            code: "/*global 𠮷𩸽, 𠮷*/\n\\u{20BB7}\\u{29E3D};",
            env: { es6: true },
            errors: [
                {
                    line: 1,
                    column: 16,
                    endLine: 1,
                    endColumn: 18,
                    messageId: "unusedVar",
                    data: {
                        varName: "𠮷",
                        action: "defined",
                        additional: ""
                    }
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/4047
        {
            code: "export default function(a) {}",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [definedError("a")]
        },
        {
            code: "export default function(a, b) { console.log(a); }",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [definedError("b")]
        },
        {
            code: "export default (function(a) {});",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [definedError("a")]
        },
        {
            code: "export default (function(a, b) { console.log(a); });",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [definedError("b")]
        },
        {
            code: "export default (a) => {};",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [definedError("a")]
        },
        {
            code: "export default (a, b) => { console.log(a); };",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [definedError("b")]
        },

        // caughtErrors
        {
            code: "try{}catch(err){};",
            options: [{ caughtErrors: "all" }],
            errors: [definedError("err")]
        },
        {
            code: "try{}catch(err){};",
            options: [{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" }],
            errors: [definedError("err", ". Allowed unused args must match /^ignore/u")]
        },

        // multiple try catch with one success
        {
            code: "try{}catch(ignoreErr){}try{}catch(err){};",
            options: [{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" }],
            errors: [definedError("err", ". Allowed unused args must match /^ignore/u")]
        },

        // multiple try catch both fail
        {
            code: "try{}catch(error){}try{}catch(err){};",
            options: [{ caughtErrors: "all", caughtErrorsIgnorePattern: "^ignore" }],
            errors: [
                definedError("error", ". Allowed unused args must match /^ignore/u"),
                definedError("err", ". Allowed unused args must match /^ignore/u")
            ]
        },

        // caughtErrors with other configs
        {
            code: "try{}catch(err){};",
            options: [{ vars: "all", args: "all", caughtErrors: "all" }],
            errors: [definedError("err")]
        },

        // no conflict in ignore patterns
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
            errors: [definedError("err")]
        },

        // Ignore reads for modifications to itself: https://github.com/eslint/eslint/issues/6348
        { code: "var a = 0; a = a + 1;", errors: [assignedError("a")] },
        { code: "var a = 0; a = a + a;", errors: [assignedError("a")] },
        { code: "var a = 0; a += a + 1;", errors: [assignedError("a")] },
        { code: "var a = 0; a++;", errors: [assignedError("a")] },
        { code: "function foo(a) { a = a + 1 } foo();", errors: [assignedError("a")] },
        { code: "function foo(a) { a += a + 1 } foo();", errors: [assignedError("a")] },
        { code: "function foo(a) { a++ } foo();", errors: [assignedError("a")] },
        { code: "var a = 3; a = a * 5 + 6;", errors: [assignedError("a")] },
        { code: "var a = 2, b = 4; a = a * 2 + b;", errors: [assignedError("a")] },

        // https://github.com/eslint/eslint/issues/6576 (For coverage)
        {
            code: "function foo(cb) { cb = function(a) { cb(1 + a); }; bar(not_cb); } foo();",
            errors: [assignedError("cb")]
        },
        {
            code: "function foo(cb) { cb = function(a) { return cb(1 + a); }(); } foo();",
            errors: [assignedError("cb")]
        },
        {
            code: "function foo(cb) { cb = (function(a) { cb(1 + a); }, cb); } foo();",
            errors: [assignedError("cb")]
        },
        {
            code: "function foo(cb) { cb = (0, function(a) { cb(1 + a); }); } foo();",
            errors: [assignedError("cb")]
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
            errors: [assignedError("b")]
        },

        // https://github.com/eslint/eslint/issues/7124
        {
            code: "(function(a, b, c) {})",
            options: [{ argsIgnorePattern: "c" }],
            errors: [
                definedError("a", ". Allowed unused args must match /c/u"),
                definedError("b", ". Allowed unused args must match /c/u")
            ]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{ argsIgnorePattern: "[cd]" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                definedError("a", ". Allowed unused args must match /[cd]/u"),
                definedError("b", ". Allowed unused args must match /[cd]/u")
            ]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{ argsIgnorePattern: "c" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                definedError("a", ". Allowed unused args must match /c/u"),
                definedError("b", ". Allowed unused args must match /c/u"),
                definedError("d", ". Allowed unused args must match /c/u")
            ]
        },
        {
            code: "(function(a, b, {c, d}) {})",
            options: [{ argsIgnorePattern: "d" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                definedError("a", ". Allowed unused args must match /d/u"),
                definedError("b", ". Allowed unused args must match /d/u"),
                definedError("c", ". Allowed unused args must match /d/u")
            ]
        },
        {
            code: "/*global\rfoo*/",
            errors: [{
                line: 2,
                column: 1,
                endLine: 2,
                endColumn: 4,
                messageId: "unusedVar",
                data: {
                    varName: "foo",
                    action: "defined",
                    additional: ""
                }
            }]
        },

        // https://github.com/eslint/eslint/issues/8442
        {
            code: "(function ({ a }, b ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                definedError("a")
            ]
        },
        {
            code: "(function ({ a }, { b, c } ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                definedError("a"),
                definedError("c")
            ]
        },

        // https://github.com/eslint/eslint/issues/14325
        {
            code: `let x = 0;
            x++, x = 0;`,
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 2, column: 18 }]
        },
        {
            code: `let x = 0;
            x++, x = 0;
            x=3;`,
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 3, column: 13 }]
        },
        {
            code: "let x = 0; x++, 0;",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 12 }]
        },
        {
            code: "let x = 0; 0, x++;",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 15 }]
        },
        {
            code: "let x = 0; 0, (1, x++);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 19 }]
        },
        {
            code: "let x = 0; foo = (x++, 0);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 19 }]
        },
        {
            code: "let x = 0; foo = ((0, x++), 0);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 23 }]
        },
        {
            code: "let x = 0; x += 1, 0;",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 12 }]
        },
        {
            code: "let x = 0; 0, x += 1;",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 15 }]
        },
        {
            code: "let x = 0; 0, (1, x += 1);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 19 }]
        },
        {
            code: "let x = 0; foo = (x += 1, 0);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 19 }]
        },
        {
            code: "let x = 0; foo = ((0, x += 1), 0);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 1, column: 23 }]
        },

        // https://github.com/eslint/eslint/issues/14866
        {
            code: `let z = 0;
            z = z + 1, z = 2;
            `,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("z"), line: 2, column: 24 }]
        },
        {
            code: `let z = 0;
            z = z+1, z = 2;
            z = 3;`,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("z"), line: 3, column: 13 }]
        },
        {
            code: `let z = 0;
            z = z+1, z = 2;
            z = z+3;
            `,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("z"), line: 3, column: 13 }]
        },
        {
            code: "let x = 0; 0, x = x+1;",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("x"), line: 1, column: 15 }]
        },
        {
            code: "let x = 0; x = x+1, 0;",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("x"), line: 1, column: 12 }]
        },
        {
            code: "let x = 0; foo = ((0, x = x + 1), 0);",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("x"), line: 1, column: 23 }]
        },
        {
            code: "let x = 0; foo = (x = x+1, 0);",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("x"), line: 1, column: 19 }]
        },
        {
            code: "let x = 0; 0, (1, x=x+1);",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("x"), line: 1, column: 19 }]
        },
        {
            code: "(function ({ a, b }, { c } ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                definedError("a"),
                definedError("c")
            ]
        },
        {
            code: "(function ([ a ], b ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                definedError("a")
            ]
        },
        {
            code: "(function ([ a ], [ b, c ] ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                definedError("a"),
                definedError("c")
            ]
        },
        {
            code: "(function ([ a, b ], [ c ] ) { return b; })();",
            parserOptions: { ecmaVersion: 2015 },
            errors: [
                definedError("a"),
                definedError("c")
            ]
        },

        // https://github.com/eslint/eslint/issues/9774
        {
            code: "(function(_a) {})();",
            options: [{ args: "all", varsIgnorePattern: "^_" }],
            errors: [definedError("_a")]
        },
        {
            code: "(function(_a) {})();",
            options: [{ args: "all", caughtErrorsIgnorePattern: "^_" }],
            errors: [definedError("_a")]
        },

        // https://github.com/eslint/eslint/issues/10982
        {
            code: "var a = function() { a(); };",
            errors: [assignedError("a")]
        },
        {
            code: "var a = function(){ return function() { a(); } };",
            errors: [assignedError("a")]
        },
        {
            code: "const a = () => { a(); };",
            parserOptions: { ecmaVersion: 2015 },
            errors: [assignedError("a")]
        },
        {
            code: "const a = () => () => { a(); };",
            parserOptions: { ecmaVersion: 2015 },
            errors: [assignedError("a")]
        },
        {
            code: `let myArray = [1,2,3,4].filter((x) => x == 0);
    myArray = myArray.filter((x) => x == 1);`,
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("myArray"), line: 2, column: 5 }]
        },
        {
            code: "const a = 1; a += 1;",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("a"), line: 1, column: 14 }]
        },
        {
            code: "var a = function() { a(); };",
            errors: [{ ...assignedError("a"), line: 1, column: 5 }]
        },
        {
            code: "var a = function(){ return function() { a(); } };",
            errors: [{ ...assignedError("a"), line: 1, column: 5 }]
        },
        {
            code: "const a = () => { a(); };",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("a"), line: 1, column: 7 }]
        },
        {
            code: "const a = () => () => { a(); };",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("a"), line: 1, column: 7 }]
        },

        // https://github.com/eslint/eslint/issues/14324
        {
            code: "let x = [];\nx = x.concat(x);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ ...assignedError("x"), line: 2, column: 1 }]
        },
        {

            code: `let a = 'a';
            a = 10;
            function foo(){
                a = 11;
                a = () => {
                    a = 13
                }
            }`,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("a"), line: 2, column: 13 }, { ...definedError("foo"), line: 3, column: 22 }]
        },
        {
            code: `let foo;
            init();
            foo = foo + 2;
            function init() {
                foo = 1;
            }`,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("foo"), line: 3, column: 13 }]
        },
        {
            code: `function foo(n) {
                if (n < 2) return 1;
                return n * foo(n - 1);
            }`,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...definedError("foo"), line: 1, column: 10 }]
        },
        {
            code: `let c = 'c'
c = 10
function foo1() {
  c = 11
  c = () => {
    c = 13
  }
}

c = foo1`,
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ ...assignedError("c"), line: 10, column: 1 }]
        }
    ]
});
