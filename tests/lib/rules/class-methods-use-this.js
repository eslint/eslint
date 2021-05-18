/**
 * @fileoverview Tests for class-methods-use-this rule.
 * @author Patrick Williams
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/class-methods-use-this");
const RuleTester = require("../../../lib/testers/rule-tester");

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
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {/**this**/} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {var a = function () {this};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {var a = function () {var b = function(){this}};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {window.this} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {that.this = 'this';} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() { () => undefined; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {} bar() {} }",
            options: [{ exceptMethods: ["bar"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, messageId: "missingThis", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {} hasOwnProperty() {} }",
            options: [{ exceptMethods: ["foo"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 34, messageId: "missingThis", data: { name: "hasOwnProperty" } }
            ]
        }
    ]
});
