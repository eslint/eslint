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
        { code: "class A { foo() {this} bar() {} }", parserOptions: { ecmaVersion: 6 }, options: [{ exceptMethods: ["bar"] }] }
    ],
    invalid: [
        {
            code: "class A { foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'." }
            ]
        },
        {
            code: "class A { foo() {/**this**/} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'." }
            ]
        },
        {
            code: "class A { foo() {var a = function () {this};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'." }
            ]
        },
        {
            code: "class A { foo() {var a = function () {var b = function(){this}};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'." }
            ]
        },
        {
            code: "class A { foo() {window.this} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'." }
            ]
        },
        {
            code: "class A { foo() {that.this = 'this';} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'." }
            ]
        },
        {
            code: "class A { foo() { () => undefined; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'." }
            ]
        },
        {
            code: "class A { foo() {} bar() {} }",
            parserOptions: { ecmaVersion: 6 },
            options: [{ exceptMethods: ["bar"] }],
            errors: [
                { type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'." },
            ]
        },
        {
            code: "class A { foo() {} hasOwnProperty() {} }",
            parserOptions: { ecmaVersion: 6 },
            options: [{ exceptMethods: ["foo"] }],
            errors: [
                { type: "FunctionExpression", line: 1, column: 34, message: "Expected 'this' to be used by class method 'hasOwnProperty'." }
            ]
        }
    ]
});
