/**
 * @fileoverview Tests for block-scoped-var rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/block-scoped-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("block-scoped-var", rule, {
    valid: [

        // See issue https://github.com/eslint/eslint/issues/2242
        { code: "function f() { } f(); var exports = { f: f };", parserOptions: { ecmaVersion: 6 } },
        { code: "var f = () => {}; f(); var exports = { f: f };", parserOptions: { sourceType: "module" } },
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
        { code: "function myFunc(foo) {  \"use strict\";  var { bar } = foo;  bar.hello();}", parserOptions: { ecmaVersion: 6 } },
        { code: "function myFunc(foo) {  \"use strict\";  var [ bar ]  = foo;  bar.hello();}", parserOptions: { ecmaVersion: 6 } },
        { code: "function myFunc(...foo) {  return foo;}", parserOptions: { ecmaVersion: 6 } },
        { code: "var f = () => { var g = f; }", parserOptions: { ecmaVersion: 6 } },
        { code: "class Foo {}\nexport default Foo;", parserOptions: { sourceType: "module" } },
        { code: "new Date", globals: { Date: false } },
        { code: "new Date", globals: {} },
        { code: "var eslint = require('eslint');", globals: { require: false } },
        { code: "var fun = function({x}) {return x;};", parserOptions: { ecmaVersion: 6 } },
        { code: "var fun = function([,x]) {return x;};", parserOptions: { ecmaVersion: 6 } },
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
        { code: "const React = require(\"react/addons\");const cx = React.addons.classSet;", parserOptions: { sourceType: "module" }, globals: { require: false } },
        { code: "var v = 1;  function x() { return v; };", parserOptions: { parserOptions: { ecmaVersion: 6 } } },
        { code: "import * as y from \"./other.js\"; y();", parserOptions: { sourceType: "module" } },
        { code: "import y from \"./other.js\"; y();", parserOptions: { sourceType: "module" } },
        { code: "import {x as y} from \"./other.js\"; y();", parserOptions: { sourceType: "module" } },
        { code: "var x; export {x};", parserOptions: { sourceType: "module" } },
        { code: "var x; export {x as v};", parserOptions: { sourceType: "module" } },
        { code: "export {x} from \"./other.js\";", parserOptions: { sourceType: "module" } },
        { code: "export {x as v} from \"./other.js\";", parserOptions: { sourceType: "module" } },
        { code: "class Test { myFunction() { return true; }}", parserOptions: { ecmaVersion: 6 } },
        { code: "class Test { get flag() { return true; }}", parserOptions: { ecmaVersion: 6 } },
        { code: "var Test = class { myFunction() { return true; }}", parserOptions: { ecmaVersion: 6 } },
        { code: "var doStuff; let {x: y} = {x: 1}; doStuff(y);", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo({x: y}) { return y; }", parserOptions: { ecmaVersion: 6 } },

        // those are the same as `no-undef`.
        "!function f(){}; f",
        "var f = function foo() { }; foo(); var exports = { f: foo };",
        { code: "var f = () => { x; }", parserOptions: { ecmaVersion: 6 } },
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
        { code: "/*global React*/ let {PropTypes, addons: {PureRenderMixin}} = React; let Test = React.createClass({mixins: [PureRenderMixin]});", parserOptions: { ecmaVersion: 6 } },
        { code: "/*global prevState*/ const { virtualSize: prevVirtualSize = 0 } = prevState;", parserOptions: { ecmaVersion: 6 } },
        { code: "const { dummy: { data, isLoading }, auth: { isLoggedIn } } = this.props;", parserOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/2747
        "function a(n) { return n > 0 ? b(n - 1) : \"a\"; } function b(n) { return n > 0 ? a(n - 1) : \"b\"; }",

        // https://github.com/eslint/eslint/issues/2967
        "(function () { foo(); })(); function foo() {}",
        { code: "(function () { foo(); })(); function foo() {}", parserOptions: { sourceType: "module" } }
    ],
    invalid: [
        { code: "function f(){ x; { var x; } }", errors: [{ messageId: "outOfScope", data: { name: "x" }, type: "Identifier" }] },
        { code: "function f(){ { var x; } x; }", errors: [{ messageId: "outOfScope", data: { name: "x" }, type: "Identifier" }] },
        { code: "function f() { var a; { var b = 0; } a = b; }", errors: [{ messageId: "outOfScope", data: { name: "b" }, type: "Identifier" }] },
        { code: "function f() { try { var a = 0; } catch (e) { var b = a; } }", errors: [{ messageId: "outOfScope", data: { name: "a" }, type: "Identifier" }] },
        {
            code: "function a() { for(var b in {}) { var c = b; } c; }",
            errors: [{ messageId: "outOfScope", data: { name: "c" }, type: "Identifier" }]
        },
        {
            code: "function a() { for(var b of {}) { var c = b; } c; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "outOfScope", data: { name: "c" }, type: "Identifier" }]
        },
        {
            code: "function f(){ switch(2) { case 1: var b = 2; b; break; default: b; break;} b; }",
            errors: [{ messageId: "outOfScope", data: { name: "b" }, type: "Identifier" }]
        },
        {
            code: "for (var a = 0;;) {} a;",
            errors: [{ messageId: "outOfScope", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "for (var a in []) {} a;",
            errors: [{ messageId: "outOfScope", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "for (var a of []) {} a;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "outOfScope", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "{ var a = 0; } a;",
            parserOptions: { sourceType: "module" },
            errors: [{ messageId: "outOfScope", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "if (true) { var a; } a;",
            errors: [{ messageId: "outOfScope", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "if (true) { var a = 1; } else { var a = 2; }",
            errors: [
                { messageId: "outOfScope", data: { name: "a" }, type: "Identifier" },
                { messageId: "outOfScope", data: { name: "a" }, type: "Identifier" }
            ]
        },
        {
            code: "for (var i = 0;;) {} for(var i = 0;;) {}",
            errors: [
                { messageId: "outOfScope", data: { name: "i" }, type: "Identifier" },
                { messageId: "outOfScope", data: { name: "i" }, type: "Identifier" }
            ]
        }
    ]
});
