/**
 * @fileoverview Test for no-underscore-dangle rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-underscore-dangle"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-underscore-dangle", rule, {
    valid: [
        "var foo_bar = 1;",
        "function foo_bar() {}",
        "foo.bar.__proto__;",
        "console.log(__filename); console.log(__dirname);",
        "var _ = require('underscore');",
        "var a = b._;",
        "function foo(_bar) {}",
        "function foo(bar_) {}",
        "(function _foo() {})",
        { code: "function foo(_bar) {}", options: [{}] },
        { code: "function foo( _bar = 0) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(_bar) { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(_bar = 0) { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = (_bar) => {}", parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = (_bar = 0) => {}", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo( ..._bar) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = (..._bar) => {}", parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(..._bar) { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "export default function() {}", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var _foo = 1", options: [{ allow: ["_foo"] }] },
        { code: "var __proto__ = 1;", options: [{ allow: ["__proto__"] }] },
        { code: "foo._bar;", options: [{ allow: ["_bar"] }] },
        { code: "function _foo() {}", options: [{ allow: ["_foo"] }] },
        { code: "this._bar;", options: [{ allowAfterThis: true }] },
        { code: "class foo { constructor() { super._bar; } }", options: [{ allowAfterSuper: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "class foo { _onClick() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class foo { onClick_() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { _onClick() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { onClick_() { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { _onClick() { } }", options: [{ allow: ["_onClick"], enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { _foo: 'bar' }", parserOptions: { ecmaVersion: 6 } },
        { code: "const o = { foo_: 'bar' }", parserOptions: { ecmaVersion: 6 } },
        { code: "this.constructor._bar", options: [{ allowAfterThisConstructor: true }] },
        { code: "const foo = { onClick(bar) { } }", parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = (bar) => {}", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(_bar) {}", options: [{ allowFunctionParams: true }] },
        { code: "function foo( _bar = 0) {}", options: [{ allowFunctionParams: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(_bar) { } }", options: [{ allowFunctionParams: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = (_bar) => {}", options: [{ allowFunctionParams: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(bar) {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(bar) { } }", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = (bar) => {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(_bar) {}", options: [{ allowFunctionParams: false, allow: ["_bar"] }] },
        { code: "const foo = { onClick(_bar) { } }", options: [{ allowFunctionParams: false, allow: ["_bar"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "const foo = (_bar) => {}", options: [{ allowFunctionParams: false, allow: ["_bar"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo([_bar]) {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo([_bar] = []) {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo( { _bar }) {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo( { _bar = 0 } = {}) {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(...[_bar]) {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 2016 } },
        { code: "class foo { _field; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class foo { _field; }", options: [{ enforceInClassFields: false }], parserOptions: { ecmaVersion: 2022 } },
        { code: "class foo { #_field; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class foo { #_field; }", options: [{ enforceInClassFields: false }], parserOptions: { ecmaVersion: 2022 } },
        { code: "class foo { _field; }", options: [{}], parserOptions: { ecmaVersion: 2022 } }
    ],
    invalid: [
        { code: "var _foo = 1", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" }, type: "VariableDeclarator" }] },
        { code: "var foo_ = 1", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "foo_" }, type: "VariableDeclarator" }] },
        { code: "function _foo() {}", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" }, type: "FunctionDeclaration" }] },
        { code: "function foo_() {}", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "foo_" }, type: "FunctionDeclaration" }] },
        { code: "var __proto__ = 1;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "__proto__" }, type: "VariableDeclarator" }] },
        { code: "foo._bar;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "MemberExpression" }] },
        { code: "this._prop;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { constructor() { super._prop; } }", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { constructor() { this._prop; } }", options: [{ allowAfterSuper: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { _onClick() { } }", options: [{ enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_onClick" }, type: "MethodDefinition" }] },
        { code: "class foo { onClick_() { } }", options: [{ enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "onClick_" }, type: "MethodDefinition" }] },
        { code: "const o = { _onClick() { } }", options: [{ enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_onClick" }, type: "Property" }] },
        { code: "const o = { onClick_() { } }", options: [{ enforceInMethodNames: true }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "onClick_" }, type: "Property" }] },
        { code: "this.constructor._bar", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "MemberExpression" }] },
        { code: "function foo(_bar) {}", options: [{ allowFunctionParams: false }], errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "Identifier" }] },
        { code: "(function foo(_bar) {})", options: [{ allowFunctionParams: false }], errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "Identifier" }] },
        { code: "function foo(bar, _foo) {}", options: [{ allowFunctionParams: false }], errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" }, type: "Identifier" }] },
        { code: "const foo = { onClick(_bar) { } }", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "Identifier" }] },
        { code: "const foo = (_bar) => {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "Identifier" }] },
        { code: "function foo(_bar = 0) {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "AssignmentPattern" }] },
        { code: "const foo = { onClick(_bar = 0) { } }", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "AssignmentPattern" }] },
        { code: "const foo = (_bar = 0) => {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "AssignmentPattern" }] },
        { code: "function foo(..._bar) {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "RestElement" }] },
        { code: "const foo = { onClick(..._bar) { } }", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "RestElement" }] },
        { code: "const foo = (..._bar) => {}", options: [{ allowFunctionParams: false }], parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "RestElement" }] },
        {
            code: "class foo { #_bar() {} }",
            options: [{ enforceInMethodNames: true }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "#_bar" } }]
        }, {
            code: "class foo { #bar_() {} }",
            options: [{ enforceInMethodNames: true }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "#bar_" } }]
        },
        {
            code: "class foo { _field; }",
            options: [{ enforceInClassFields: true }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_field" } }]
        },
        {
            code: "class foo { #_field; }",
            options: [{ enforceInClassFields: true }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "#_field" } }]
        },
        {
            code: "class foo { field_; }",
            options: [{ enforceInClassFields: true }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "field_" } }]
        },
        {
            code: "class foo { #field_; }",
            options: [{ enforceInClassFields: true }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "#field_" } }]
        }
    ]
});
