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
        { code: "class A { foo() {this} bar() {} }", options: [{ exceptMethods: ["bar"] }], parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        {
            code: "class A { foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {/**this**/} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {var a = function () {this};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {var a = function () {var b = function(){this}};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {window.this} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {that.this = 'this';} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() { () => undefined; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {} bar() {} }",
            options: [{ exceptMethods: ["bar"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "method 'foo'" } }
            ]
        },
        {
            code: "class A { foo() {} hasOwnProperty() {} }",
            options: [{ exceptMethods: ["foo"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 34, messageId: "missingThis", data: { name: "method 'hasOwnProperty'" } }
            ]
        },
        {
            code: "class A { [foo]() {} }",
            options: [{ exceptMethods: ["foo"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 16, messageId: "missingThis", data: { name: "method" } }
            ]
        },
        {
            code: "class A { foo(){} 'bar'(){} 123(){} [`baz`](){} [a](){} [f(a)](){} get quux(){} set[a](b){} *quuux(){} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "missingThis", data: { name: "method 'foo'" }, type: "FunctionExpression", column: 14 },
                { messageId: "missingThis", data: { name: "method 'bar'" }, type: "FunctionExpression", column: 24 },
                { messageId: "missingThis", data: { name: "method '123'" }, type: "FunctionExpression", column: 32 },
                { messageId: "missingThis", data: { name: "method 'baz'" }, type: "FunctionExpression", column: 44 },
                { messageId: "missingThis", data: { name: "method" }, type: "FunctionExpression", column: 52 },
                { messageId: "missingThis", data: { name: "method" }, type: "FunctionExpression", column: 63 },
                { messageId: "missingThis", data: { name: "getter 'quux'" }, type: "FunctionExpression", column: 76 },
                { messageId: "missingThis", data: { name: "setter" }, type: "FunctionExpression", column: 87 },
                { messageId: "missingThis", data: { name: "generator method 'quuux'" }, type: "FunctionExpression", column: 99 }
            ]
        }
    ]
});
