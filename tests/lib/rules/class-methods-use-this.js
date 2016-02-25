/**
 * @fileoverview Tests for class-methods-use-this rule.
 * @author Patrick Williams
 * @copyright 2016 Patrick Williams. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/class-methods-use-this");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("class-methods-use-this", rule, {
    valid: [
        {code: "class A { constructor() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { foo() {this} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { foo() {this.bar = 'bar';} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { foo() {bar(this);} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { foo() { if(true) { return this; } } }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { static foo() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { constructor() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "({ a(){} });", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { foo() { () => this; } }", parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {
            code: "class A { foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'."}
            ]
        },
        {
            code: "class A { foo() {/**this**/} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'."}
            ]
        },
        {
            code: "class A { foo() {var a = function () {this};} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'."}
            ]
        },
        {
            code: "class A { foo() {window.this} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'."}
            ]
        },
        {
            code: "class A { foo() {that.this = 'this';} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'."}
            ]
        },
        {
            code: "class A { foo() { () => undefined; } }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "FunctionExpression", line: 1, column: 14, message: "Expected 'this' to be used by class method 'foo'."}
            ]
        }
    ]
});
