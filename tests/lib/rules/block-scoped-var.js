/**
 * @fileoverview Tests for block-scoped-var rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/block-scoped-var"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: { ecmaVersion: 5, sourceType: "script" }
});

ruleTester.run("block-scoped-var", rule, {
    valid: [

        // See issue https://github.com/eslint/eslint/issues/2242
        { code: "function f() { } f(); var exports = { f: f };", languageOptions: { ecmaVersion: 6 } },
        { code: "var f = () => {}; f(); var exports = { f: f };", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        "!function f(){ f; }",
        "function f() { } f(); var exports = { f: f };",
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
        "if (true) { var a = 1; a; }",
        "var a; if (true) { a; }",
        "for (var i = 0; i < 10; i++) { i; }",
        "var i; for(i; i; i) { i; }",
        { code: "function myFunc(foo) {  \"use strict\";  var { bar } = foo;  bar.hello();}", languageOptions: { ecmaVersion: 6 } },
        { code: "function myFunc(foo) {  \"use strict\";  var [ bar ]  = foo;  bar.hello();}", languageOptions: { ecmaVersion: 6 } },
        { code: "function myFunc(...foo) {  return foo;}", languageOptions: { ecmaVersion: 6 } },
        { code: "var f = () => { var g = f; }", languageOptions: { ecmaVersion: 6 } },
        { code: "class Foo {}\nexport default Foo;", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "new Date", languageOptions: { globals: { Date: false } } },
        { code: "new Date", languageOptions: { globals: {} } },
        { code: "var eslint = require('eslint');", languageOptions: { globals: { require: false } } },
        { code: "var fun = function({x}) {return x;};", languageOptions: { ecmaVersion: 6 } },
        { code: "var fun = function([,x]) {return x;};", languageOptions: { ecmaVersion: 6 } },
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
        "function f(){ switch(2) { case 1: var b = 2; b; break; default: b; break;} }",
        "a:;",
        "foo: while (true) { bar: for (var i = 0; i < 13; ++i) {if (i === 7) break foo; } }",
        "foo: while (true) { bar: for (var i = 0; i < 13; ++i) {if (i === 7) continue foo; } }",
        { code: "const React = require(\"react/addons\");const cx = React.addons.classSet;", languageOptions: { ecmaVersion: 6, sourceType: "module", globals: { require: false } } },
        { code: "var v = 1;  function x() { return v; };", languageOptions: { ecmaVersion: 6 } },
        { code: "import * as y from \"./other.js\"; y();", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import y from \"./other.js\"; y();", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import {x as y} from \"./other.js\"; y();", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var x; export {x};", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var x; export {x as v};", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {x} from \"./other.js\";", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export {x as v} from \"./other.js\";", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "class Test { myFunction() { return true; }}", languageOptions: { ecmaVersion: 6 } },
        { code: "class Test { get flag() { return true; }}", languageOptions: { ecmaVersion: 6 } },
        { code: "var Test = class { myFunction() { return true; }}", languageOptions: { ecmaVersion: 6 } },
        { code: "var doStuff; let {x: y} = {x: 1}; doStuff(y);", languageOptions: { ecmaVersion: 6 } },
        { code: "function foo({x: y}) { return y; }", languageOptions: { ecmaVersion: 6 } },

        // those are the same as `no-undef`.
        "!function f(){}; f",
        "var f = function foo() { }; foo(); var exports = { f: foo };",
        { code: "var f = () => { x; }", languageOptions: { ecmaVersion: 6 } },
        "function f(){ x; }",
        "var eslint = require('eslint');",
        "function f(a) { return a[b]; }",
        "function f() { return b.a; }",
        "var a = { foo: bar };",
        "var a = { foo: foo };",
        "var a = { bar: 7, foo: bar };",
        "var a = arguments;",
        "function x(){}; var a = arguments;",
        "function z(b){}; var a = b;",
        "function z(){var b;}; var a = b;",
        "function f(){ try{}catch(e){} e }",
        "a:b;",

        // https://github.com/eslint/eslint/issues/2253
        { code: "/*global React*/ let {PropTypes, addons: {PureRenderMixin}} = React; let Test = React.createClass({mixins: [PureRenderMixin]});", languageOptions: { ecmaVersion: 6 } },
        { code: "/*global prevState*/ const { virtualSize: prevVirtualSize = 0 } = prevState;", languageOptions: { ecmaVersion: 6 } },
        { code: "const { dummy: { data, isLoading }, auth: { isLoggedIn } } = this.props;", languageOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/2747
        "function a(n) { return n > 0 ? b(n - 1) : \"a\"; } function b(n) { return n > 0 ? a(n - 1) : \"b\"; }",

        // https://github.com/eslint/eslint/issues/2967
        "(function () { foo(); })(); function foo() {}",
        { code: "(function () { foo(); })(); function foo() {}", languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        { code: "class C { static { var foo; foo; } }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo; var foo; } }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { if (bar) { foo; } var foo; } }", languageOptions: { ecmaVersion: 2022 } },
        { code: "var foo; class C { static { foo; } } ", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo; } } var foo;", languageOptions: { ecmaVersion: 2022 } },
        { code: "var foo; class C { static {} [foo]; } ", languageOptions: { ecmaVersion: 2022 } },
        { code: "foo; class C { static {} } var foo; ", languageOptions: { ecmaVersion: 2022 } }
    ],
    invalid: [
        {
            code: "function f(){ x; { var x; } }",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "x",
                    definitionLine: 1,
                    definitionColumn: 24
                },
                line: 1,
                column: 15,
                type: "Identifier"
            }]
        },
        {
            code: "function f(){ { var x; } x; }",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "x",
                    definitionLine: 1,
                    definitionColumn: 21
                },
                line: 1,
                column: 26,
                type: "Identifier"
            }]
        },
        {
            code: "function f() { var a; { var b = 0; } a = b; }",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "b",
                    definitionLine: 1,
                    definitionColumn: 29
                },
                line: 1,
                column: 42,
                type: "Identifier"
            }]
        },
        {
            code: "function f() { try { var a = 0; } catch (e) { var b = a; } }",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "a",
                    definitionLine: 1,
                    definitionColumn: 26
                },
                line: 1,
                column: 55,
                type: "Identifier"
            }]
        },
        {
            code: "function a() { for(var b in {}) { var c = b; } c; }",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "c",
                    definitionLine: 1,
                    definitionColumn: 39
                },
                line: 1,
                column: 48,
                type: "Identifier"
            }]
        },
        {
            code: "function a() { for(var b of {}) { var c = b; } c; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "c",
                    definitionLine: 1,
                    definitionColumn: 39
                },
                line: 1,
                column: 48,
                type: "Identifier"
            }]
        },
        {
            code: "function f(){ switch(2) { case 1: var b = 2; b; break; default: b; break;} b; }",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "b",
                    definitionLine: 1,
                    definitionColumn: 39
                },
                line: 1,
                column: 76,
                type: "Identifier"
            }]
        },
        {
            code: "for (var a = 0;;) {} a;",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "a",
                    definitionLine: 1,
                    definitionColumn: 10
                },
                line: 1,
                column: 22,
                type: "Identifier"
            }]
        },
        {
            code: "for (var a in []) {} a;",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "a",
                    definitionLine: 1,
                    definitionColumn: 10
                },
                line: 1,
                column: 22,
                type: "Identifier"
            }]
        },
        {
            code: "for (var a of []) {} a;",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "a",
                    definitionLine: 1,
                    definitionColumn: 10
                },
                line: 1,
                column: 22,
                type: "Identifier"
            }]
        },
        {
            code: "{ var a = 0; } a;",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "a",
                    definitionLine: 1,
                    definitionColumn: 7
                },
                line: 1,
                column: 16,
                type: "Identifier"
            }]
        },
        {
            code: "if (true) { var a; } a;",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "a",
                    definitionLine: 1,
                    definitionColumn: 17
                },
                line: 1,
                column: 22,
                type: "Identifier"
            }]
        },
        {
            code: "if (true) { var a = 1; } else { var a = 2; }",
            errors: [
                {
                    messageId: "outOfScope",
                    data: {
                        name: "a",
                        definitionLine: 1,
                        definitionColumn: 37
                    },
                    line: 1,
                    column: 17,
                    type: "Identifier"
                },
                {
                    messageId: "outOfScope",
                    data: {
                        name: "a",
                        definitionLine: 1,
                        definitionColumn: 17
                    },
                    line: 1,
                    column: 37,
                    type: "Identifier"
                }
            ]
        },
        {
            code: "for (var i = 0;;) {} for(var i = 0;;) {}",
            errors: [
                {
                    messageId: "outOfScope",
                    data: {
                        name: "i",
                        definitionLine: 1,
                        definitionColumn: 30
                    },
                    line: 1,
                    column: 10,
                    type: "Identifier"
                },
                {
                    messageId: "outOfScope",
                    data: {
                        name: "i",
                        definitionLine: 1,
                        definitionColumn: 10
                    },
                    line: 1,
                    column: 30,
                    type: "Identifier"
                }
            ]
        },
        {
            code: "class C { static { if (bar) { var foo; } foo; } }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "foo",
                    definitionLine: 1,
                    definitionColumn: 35
                },
                line: 1,
                column: 42,
                type: "Identifier"
            }]
        },
        {
            code: "{ var foo,\n  bar; } bar;",
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "bar",
                    definitionLine: 2,
                    definitionColumn: 3
                },
                line: 2,
                column: 10,
                type: "Identifier"
            }]
        },
        {
            code: "{ var { foo,\n  bar } = baz; } bar;",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "outOfScope",
                data: {
                    name: "bar",
                    definitionLine: 2,
                    definitionColumn: 3
                },
                line: 2,
                column: 18,
                type: "Identifier"
            }]
        },
        {
            code: "if (foo) { var a = 1; } else if (bar) { var a = 2; } else { var a = 3; }",
            errors: [
                {
                    messageId: "outOfScope",
                    data: {
                        name: "a",
                        definitionLine: 1,
                        definitionColumn: 45
                    },
                    line: 1,
                    column: 16,
                    type: "Identifier"
                },
                {
                    messageId: "outOfScope",
                    data: {
                        name: "a",
                        definitionLine: 1,
                        definitionColumn: 65
                    },
                    line: 1,
                    column: 16,
                    type: "Identifier"
                },
                {
                    messageId: "outOfScope",
                    data: {
                        name: "a",
                        definitionLine: 1,
                        definitionColumn: 16
                    },
                    line: 1,
                    column: 45,
                    type: "Identifier"
                },
                {
                    messageId: "outOfScope",
                    data: {
                        name: "a",
                        definitionLine: 1,
                        definitionColumn: 65
                    },
                    line: 1,
                    column: 45,
                    type: "Identifier"
                },
                {
                    messageId: "outOfScope",
                    data: {
                        name: "a",
                        definitionLine: 1,
                        definitionColumn: 16
                    },
                    line: 1,
                    column: 65,
                    type: "Identifier"
                },
                {
                    messageId: "outOfScope",
                    data: {
                        name: "a",
                        definitionLine: 1,
                        definitionColumn: 45
                    },
                    line: 1,
                    column: 65,
                    type: "Identifier"
                }
            ]
        }
    ]
});
