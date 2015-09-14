/**
 * @fileoverview Tests for block-scoped-var rule
 * @author Matt DuVall <http://www.mattduvall.com>
 * @copyright 2015 Mathieu M-Gosselin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/block-scoped-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("block-scoped-var", rule, {
    valid: [
        // See issue https://github.com/eslint/eslint/issues/2242
        { code: "function f() { } f(); var exports = { f: f };", ecmaFeatures: {modules: true} },
        { code: "var f = () => {}; f(); var exports = { f: f };", ecmaFeatures: {arrowFunctions: true, modules: true} },
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
        { code: "function myFunc(foo) {  \"use strict\";  var { bar } = foo;  bar.hello();}", ecmaFeatures: { destructuring: true } },
        { code: "function myFunc(foo) {  \"use strict\";  var [ bar ]  = foo;  bar.hello();}", ecmaFeatures: { destructuring: true } },
        { code: "function myFunc(...foo) {  return foo;}", ecmaFeatures: { restParams: true } },
        { code: "var f = () => { var g = f; }", ecmaFeatures: { arrowFunctions: true } },
        { code: "class Foo {}\nexport default Foo;", ecmaFeatures: { modules: true, classes: true } },
        { code: "new Date", globals: {Date: false} },
        { code: "new Date", globals: {} },
        { code: "var eslint = require('eslint');", globals: {require: false} },
        { code: "var fun = function({x}) {return x;};", ecmaFeatures: { destructuring: true } },
        { code: "var fun = function([,x]) {return x;};", ecmaFeatures: { destructuring: true } },
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
        { code: "const React = require(\"react/addons\");const cx = React.addons.classSet;", globals: { require: false }, ecmaFeatures: { globalReturn: true, modules: true, blockBindings: true }},
        { code: "var v = 1;  function x() { return v; };", ecmaFeatures: { globalReturn: true }},
        { code: "import * as y from \"./other.js\"; y();", ecmaFeatures: { modules: true }},
        { code: "import y from \"./other.js\"; y();", ecmaFeatures: { modules: true }},
        { code: "import {x as y} from \"./other.js\"; y();", ecmaFeatures: { modules: true }},
        { code: "var x; export {x};", ecmaFeatures: { modules: true }},
        { code: "var x; export {x as v};", ecmaFeatures: { modules: true }},
        { code: "export {x} from \"./other.js\";", ecmaFeatures: { modules: true }},
        { code: "export {x as v} from \"./other.js\";", ecmaFeatures: { modules: true }},
        { code: "class Test { myFunction() { return true; }}", ecmaFeatures: { classes: true }},
        { code: "class Test { get flag() { return true; }}", ecmaFeatures: { classes: true }},
        { code: "var Test = class { myFunction() { return true; }}", ecmaFeatures: { classes: true }},
        { code: "var doStuff; let {x: y} = {x: 1}; doStuff(y);", ecmaFeatures: { blockBindings: true, destructuring: true }},
        { code: "function foo({x: y}) { return y; }", ecmaFeatures: { blockBindings: true, destructuring: true }},

        // those are the same as `no-undef`.
        { code: "!function f(){}; f" },
        { code: "var f = function foo() { }; foo(); var exports = { f: foo };" },
        { code: "var f = () => { x; }", ecmaFeatures: { arrowFunctions: true } },
        { code: "function f(){ x; }" },
        { code: "var eslint = require('eslint');" },
        { code: "function f(a) { return a[b]; }" },
        { code: "function f() { return b.a; }" },
        { code: "var a = { foo: bar };" },
        { code: "var a = { foo: foo };" },
        { code: "var a = { bar: 7, foo: bar };" },
        { code: "var a = arguments;" },
        { code: "function x(){}; var a = arguments;" },
        { code: "function z(b){}; var a = b;" },
        { code: "function z(){var b;}; var a = b;" },
        { code: "function f(){ try{}catch(e){} e }" },
        { code: "a:b;" },

        // https://github.com/eslint/eslint/issues/2253
        { code: "/*global React*/ let {PropTypes, addons: {PureRenderMixin}} = React; let Test = React.createClass({mixins: [PureRenderMixin]});", ecmaFeatures: { blockBindings: true, destructuring: true }},
        { code: "/*global prevState*/ const { virtualSize: prevVirtualSize = 0 } = prevState;", ecmaFeatures: { blockBindings: true, destructuring: true }},
        { code: "const { dummy: { data, isLoading }, auth: { isLoggedIn } } = this.props;", ecmaFeatures: { blockBindings: true, destructuring: true }},

        // https://github.com/eslint/eslint/issues/2747
        { code: "function a(n) { return n > 0 ? b(n - 1) : \"a\"; } function b(n) { return n > 0 ? a(n - 1) : \"b\"; }"},

        // https://github.com/eslint/eslint/issues/2967
        { code: "(function () { foo(); })(); function foo() {}"},
        { code: "(function () { foo(); })(); function foo() {}", ecmaFeatures: { modules: true }}
    ],
    invalid: [
        { code: "function f(){ x; { var x; } }", errors: [{ message: "\"x\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f(){ { var x; } x; }", errors: [{ message: "\"x\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f() { var a; { var b = 0; } a = b; }", errors: [{ message: "\"b\" used outside of binding context.", type: "Identifier" }] },
        { code: "function f() { try { var a = 0; } catch (e) { var b = a; } }", errors: [{ message: "\"a\" used outside of binding context.", type: "Identifier" }] },
        {
            code: "function a() { for(var b in {}) { var c = b; } c; }",
            errors: [{ message: "\"c\" used outside of binding context.", type: "Identifier" }]
        },
        {
            code: "function a() { for(var b of {}) { var c = b; } c; }",
            ecmaFeatures: { forOf: true },
            errors: [{ message: "\"c\" used outside of binding context.", type: "Identifier" }]
        },
        {
            code: "function f(){ switch(2) { case 1: var b = 2; b; break; default: b; break;} b; }",
            errors: [{ message: "\"b\" used outside of binding context.", type: "Identifier" }]
        },
        {
            code: "for (var a = 0;;) {} a;",
            errors: [{ message: "\"a\" used outside of binding context.", type: "Identifier" }]
        },
        {
            code: "for (var a in []) {} a;",
            errors: [{ message: "\"a\" used outside of binding context.", type: "Identifier" }]
        },
        {
            code: "for (var a of []) {} a;",
            ecmaFeatures: { forOf: true },
            errors: [{ message: "\"a\" used outside of binding context.", type: "Identifier" }]
        },
        {
            code: "{ var a = 0; } a;",
            ecmaFeatures: { modules: true },
            errors: [{ message: "\"a\" used outside of binding context.", type: "Identifier" }]
        },
        {
            code: "if (true) { var a; } a;",
            errors: [{ message: "\"a\" used outside of binding context.", type: "Identifier" }]
        },
        {
            code: "if (true) { var a = 1; } else { var a = 2; }",
            errors: [
                { message: "\"a\" used outside of binding context.", type: "Identifier" },
                { message: "\"a\" used outside of binding context.", type: "Identifier" }
            ]
        },
        {
            code: "for (var i = 0;;) {} for(var i = 0;;) {}",
            errors: [
                { message: "\"i\" used outside of binding context.", type: "Identifier" },
                { message: "\"i\" used outside of binding context.", type: "Identifier" }
            ]
        }
    ]
});
