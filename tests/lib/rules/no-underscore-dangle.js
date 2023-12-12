/**
 * @fileoverview Test for no-underscore-dangle rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-underscore-dangle"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

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
        { code: "function foo( _bar = 0) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(_bar) { } }", languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(_bar = 0) { } }", languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = (_bar) => {}", languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = (_bar = 0) => {}", languageOptions: { ecmaVersion: 6 } },
        { code: "function foo( ..._bar) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = (..._bar) => {}", languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(..._bar) { } }", languageOptions: { ecmaVersion: 6 } },
        { code: "export default function() {}", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var _foo = 1", options: [{ allow: ["_foo"] }] },
        { code: "var __proto__ = 1;", options: [{ allow: ["__proto__"] }] },
        { code: "foo._bar;", options: [{ allow: ["_bar"] }] },
        { code: "function _foo() {}", options: [{ allow: ["_foo"] }] },
        { code: "this._bar;", options: [{ allowAfterThis: true }] },
        { code: "class foo { constructor() { super._bar; } }", options: [{ allowAfterSuper: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "class foo { _onClick() { } }", languageOptions: { ecmaVersion: 6 } },
        { code: "class foo { onClick_() { } }", languageOptions: { ecmaVersion: 6 } },
        { code: "const o = { _onClick() { } }", languageOptions: { ecmaVersion: 6 } },
        { code: "const o = { onClick_() { } }", languageOptions: { ecmaVersion: 6 } },
        { code: "const o = { _onClick() { } }", options: [{ allow: ["_onClick"], enforceInMethodNames: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const o = { _foo: 'bar' }", languageOptions: { ecmaVersion: 6 } },
        { code: "const o = { foo_: 'bar' }", languageOptions: { ecmaVersion: 6 } },
        { code: "this.constructor._bar", options: [{ allowAfterThisConstructor: true }] },
        { code: "const foo = { onClick(bar) { } }", languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = (bar) => {}", languageOptions: { ecmaVersion: 6 } },
        { code: "function foo(_bar) {}", options: [{ allowFunctionParams: true }] },
        { code: "function foo( _bar = 0) {}", options: [{ allowFunctionParams: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(_bar) { } }", options: [{ allowFunctionParams: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = (_bar) => {}", options: [{ allowFunctionParams: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo(bar) {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = { onClick(bar) { } }", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = (bar) => {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo(_bar) {}", options: [{ allowFunctionParams: false, allow: ["_bar"] }] },
        { code: "const foo = { onClick(_bar) { } }", options: [{ allowFunctionParams: false, allow: ["_bar"] }], languageOptions: { ecmaVersion: 6 } },
        { code: "const foo = (_bar) => {}", options: [{ allowFunctionParams: false, allow: ["_bar"] }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo([_bar]) {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo([_bar] = []) {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo( { _bar }) {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo( { _bar = 0 } = {}) {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo(...[_bar]) {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 2016 } },
        { code: "const [_foo] = arr", languageOptions: { ecmaVersion: 6 } },
        { code: "const [_foo] = arr", options: [{}], languageOptions: { ecmaVersion: 6 } },
        { code: "const [_foo] = arr", options: [{ allowInArrayDestructuring: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const [foo, ...rest] = [1, 2, 3]", options: [{ allowInArrayDestructuring: false }], languageOptions: { ecmaVersion: 2022 } },
        { code: "const [foo, _bar] = [1, 2, 3]", options: [{ allowInArrayDestructuring: false, allow: ["_bar"] }], languageOptions: { ecmaVersion: 2022 } },
        { code: "const { _foo } = obj", languageOptions: { ecmaVersion: 6 } },
        { code: "const { _foo } = obj", options: [{}], languageOptions: { ecmaVersion: 6 } },
        { code: "const { _foo } = obj", options: [{ allowInObjectDestructuring: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const { foo, bar: _bar } = { foo: 1, bar: 2 }", options: [{ allowInObjectDestructuring: false, allow: ["_bar"] }], languageOptions: { ecmaVersion: 2022 } },
        { code: "const { foo, _bar } = { foo: 1, _bar: 2 }", options: [{ allowInObjectDestructuring: false, allow: ["_bar"] }], languageOptions: { ecmaVersion: 2022 } },
        { code: "const { foo, _bar: bar } = { foo: 1, _bar: 2 }", options: [{ allowInObjectDestructuring: false }], languageOptions: { ecmaVersion: 2022 } },
        { code: "class foo { _field; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class foo { _field; }", options: [{ enforceInClassFields: false }], languageOptions: { ecmaVersion: 2022 } },
        { code: "class foo { #_field; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class foo { #_field; }", options: [{ enforceInClassFields: false }], languageOptions: { ecmaVersion: 2022 } },
        { code: "class foo { _field; }", options: [{}], languageOptions: { ecmaVersion: 2022 } }
    ],
    invalid: [
        { code: "var _foo = 1", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" }, type: "VariableDeclarator" }] },
        { code: "var foo_ = 1", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "foo_" }, type: "VariableDeclarator" }] },
        { code: "function _foo() {}", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" }, type: "FunctionDeclaration" }] },
        { code: "function foo_() {}", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "foo_" }, type: "FunctionDeclaration" }] },
        { code: "var __proto__ = 1;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "__proto__" }, type: "VariableDeclarator" }] },
        { code: "foo._bar;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "MemberExpression" }] },
        { code: "this._prop;", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { constructor() { super._prop; } }", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { constructor() { this._prop; } }", options: [{ allowAfterSuper: true }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_prop" }, type: "MemberExpression" }] },
        { code: "class foo { _onClick() { } }", options: [{ enforceInMethodNames: true }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_onClick" }, type: "MethodDefinition" }] },
        { code: "class foo { onClick_() { } }", options: [{ enforceInMethodNames: true }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "onClick_" }, type: "MethodDefinition" }] },
        { code: "const o = { _onClick() { } }", options: [{ enforceInMethodNames: true }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_onClick" }, type: "Property" }] },
        { code: "const o = { onClick_() { } }", options: [{ enforceInMethodNames: true }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "onClick_" }, type: "Property" }] },
        { code: "this.constructor._bar", errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "MemberExpression" }] },
        { code: "function foo(_bar) {}", options: [{ allowFunctionParams: false }], errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "Identifier" }] },
        { code: "(function foo(_bar) {})", options: [{ allowFunctionParams: false }], errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "Identifier" }] },
        { code: "function foo(bar, _foo) {}", options: [{ allowFunctionParams: false }], errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" }, type: "Identifier" }] },
        { code: "const foo = { onClick(_bar) { } }", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "Identifier" }] },
        { code: "const foo = (_bar) => {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "Identifier" }] },
        { code: "function foo(_bar = 0) {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "AssignmentPattern" }] },
        { code: "const foo = { onClick(_bar = 0) { } }", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "AssignmentPattern" }] },
        { code: "const foo = (_bar = 0) => {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "AssignmentPattern" }] },
        { code: "function foo(..._bar) {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "RestElement" }] },
        { code: "const foo = { onClick(..._bar) { } }", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "RestElement" }] },
        { code: "const foo = (..._bar) => {}", options: [{ allowFunctionParams: false }], languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" }, type: "RestElement" }] },
        {
            code: "const [foo, _bar] = [1, 2]",
            options: [{ allowInArrayDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_bar" } }]
        }, {
            code: "const [_foo = 1] = arr",
            options: [{ allowInArrayDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" } }]
        }, {
            code: "const [foo, ..._rest] = [1, 2, 3]",
            options: [{ allowInArrayDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_rest" } }]
        }, {
            code: "const [foo, [bar_, baz]] = [1, [2, 3]]",
            options: [{ allowInArrayDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "bar_" } }]
        }, {
            code: "const { _foo, bar } = { _foo: 1, bar: 2 }",
            options: [{ allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" } }]
        }, {
            code: "const { _foo = 1 } = obj",
            options: [{ allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" } }]
        }, {
            code: "const { bar: _foo = 1 } = obj",
            options: [{ allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" } }]
        }, {
            code: "const { foo: _foo, bar } = { foo: 1, bar: 2 }",
            options: [{ allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_foo" } }]
        }, {
            code: "const { foo, ..._rest} = { foo: 1, bar: 2, baz: 3 }",
            options: [{ allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_rest" } }]
        }, {
            code: "const { foo: [_bar, { a: _a, b } ] } = { foo: [1, { a: 'a', b: 'b' }] }",
            options: [{ allowInArrayDestructuring: false, allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "unexpectedUnderscore", data: { identifier: "_bar" } },
                { messageId: "unexpectedUnderscore", data: { identifier: "_a" } }
            ]
        }, {
            code: "const { foo: [_bar, { a: _a, b } ] } = { foo: [1, { a: 'a', b: 'b' }] }",
            options: [{ allowInArrayDestructuring: true, allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_a" } }]
        }, {
            code: "const [{ foo: [_bar, _, { bar: _baz }] }] = [{ foo: [1, 2, { bar: 'a' }] }]",
            options: [{ allowInArrayDestructuring: false, allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "unexpectedUnderscore", data: { identifier: "_bar" } },
                { messageId: "unexpectedUnderscore", data: { identifier: "_baz" } }
            ]
        }, {
            code: "const { foo, bar: { baz, _qux } } = { foo: 1, bar: { baz: 3, _qux: 4 } }",
            options: [{ allowInObjectDestructuring: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_qux" } }]
        }, {
            code: "class foo { #_bar() {} }",
            options: [{ enforceInMethodNames: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "#_bar" } }]
        }, {
            code: "class foo { #bar_() {} }",
            options: [{ enforceInMethodNames: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "#bar_" } }]
        },
        {
            code: "class foo { _field; }",
            options: [{ enforceInClassFields: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "_field" } }]
        },
        {
            code: "class foo { #_field; }",
            options: [{ enforceInClassFields: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "#_field" } }]
        },
        {
            code: "class foo { field_; }",
            options: [{ enforceInClassFields: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "field_" } }]
        },
        {
            code: "class foo { #field_; }",
            options: [{ enforceInClassFields: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpectedUnderscore", data: { identifier: "#field_" } }]
        }
    ]
});
