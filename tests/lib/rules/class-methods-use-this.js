/**
 * @fileoverview Tests for class-methods-use-this rule.
 * @author Patrick Williams
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/class-methods-use-this");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("class-methods-use-this", rule, {
    valid: [
        { code: "class A { constructor() {} }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { foo() {this} }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { foo() {this.bar = 'bar';} }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { foo() {bar(this);} }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A extends B { foo() {super.foo();} }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { foo() { if(true) { return this; } } }", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { static foo() {} }", parserOptions: { ecmaVersion: 6 } },
        { code: "({ a(){} });", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { foo() { () => this; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "({ a: function () {} });", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { foo() {this} bar() {} }", options: [{ exceptMethods: ["bar"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "class A { \"foo\"() { } }", options: [{ exceptMethods: ["foo"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "class A { 42() { } }", options: [{ exceptMethods: ["42"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "class A { foo = function() {this} }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { foo = () => {this} }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { foo = () => {super.toString} }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { static foo = function() {} }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { static foo = () => {} }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { #bar() {} }", options: [{ exceptMethods: ["#bar"] }], parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { foo = function () {} }", options: [{ enforceForClassFields: false }], parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { foo = () => {} }", options: [{ enforceForClassFields: false }], parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { foo() { return class { [this.foo] = 1 }; } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { static {} }", parserOptions: { ecmaVersion: 2022 } }
    ],
    invalid: [
        {
            code: "class A { foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {/**this**/} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {var a = function () {this};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {var a = function () {var b = function(){this}};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {window.this} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {that.this = 'this';} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() { () => undefined; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {} bar() {} }",
            options: [{ exceptMethods: ["bar"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {} hasOwnProperty() {} }",
            options: [{ exceptMethods: ["foo"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 20, messageId: "missingThis", data: { name: "method 'hasOwnProperty'" } }
            ]
        },
        {
            code: "class A { [foo]() {} }",
            options: [{ exceptMethods: ["foo"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 11, messageId: "missingThis", data: { name: "method" } }
            ]
        },
        {
            code: "class A { #foo() { } foo() {} #bar() {} }",
            options: [{ exceptMethods: ["#foo"] }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 22, messageId: "missingThis", data: { name: "method 'foo'" } },
                { type: "FunctionExpression", line: 1, column: 31, messageId: "missingThis", data: { name: "private method #bar" } }
            ]
        },
        {
            code: "class A { foo(){} 'bar'(){} 123(){} [`baz`](){} [a](){} [f(a)](){} get quux(){} set[a](b){} *quuux(){} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "missingThis", data: { name: "method 'foo'" }, type: "FunctionExpression", column: 11 },
                { messageId: "missingThis", data: { name: "method 'bar'" }, type: "FunctionExpression", column: 19 },
                { messageId: "missingThis", data: { name: "method '123'" }, type: "FunctionExpression", column: 29 },
                { messageId: "missingThis", data: { name: "method 'baz'" }, type: "FunctionExpression", column: 37 },
                { messageId: "missingThis", data: { name: "method" }, type: "FunctionExpression", column: 49 },
                { messageId: "missingThis", data: { name: "method" }, type: "FunctionExpression", column: 57 },
                { messageId: "missingThis", data: { name: "getter 'quux'" }, type: "FunctionExpression", column: 68 },
                { messageId: "missingThis", data: { name: "setter" }, type: "FunctionExpression", column: 81 },
                { messageId: "missingThis", data: { name: "generator method 'quuux'" }, type: "FunctionExpression", column: 93 }
            ]
        },
        {
            code: "class A { foo = function() {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "method 'foo'" }, column: 11, endColumn: 25 }
            ]
        },
        {
            code: "class A { foo = () => {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "method 'foo'" }, column: 11, endColumn: 17 }
            ]
        },
        {
            code: "class A { #foo = function() {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "private method #foo" }, column: 11, endColumn: 26 }
            ]
        },
        {
            code: "class A { #foo = () => {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "private method #foo" }, column: 11, endColumn: 18 }
            ]
        },
        {
            code: "class A { #foo() {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "private method #foo" }, column: 11, endColumn: 15 }
            ]
        },
        {
            code: "class A { get #foo() {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "private getter #foo" }, column: 11, endColumn: 19 }
            ]
        },
        {
            code: "class A { set #foo(x) {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "private setter #foo" }, column: 11, endColumn: 19 }
            ]
        },
        {
            code: "class A { foo () { return class { foo = this }; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "method 'foo'" }, column: 11, endColumn: 15 }
            ]
        },
        {
            code: "class A { foo () { return function () { foo = this }; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "method 'foo'" }, column: 11, endColumn: 15 }
            ]
        },
        {
            code: "class A { foo () { return class { static { this; } } } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [
                { messageId: "missingThis", data: { name: "method 'foo'" }, column: 11, endColumn: 15 }
            ]
        }
    ]
});
