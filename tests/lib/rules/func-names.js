/**
 * @fileoverview Tests for func-names rule.
 * @author Kyle T. Nunery
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/func-names"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("func-names", rule, {
    valid: [
        "Foo.prototype.bar = function bar(){};",
        { code: "Foo.prototype.bar = () => {}", parserOptions: { ecmaVersion: 6 } },
        "function foo(){}",
        "function test(d, e, f) {}",
        "new function bar(){}",
        "exports = { get foo() { return 1; }, set bar(val) { return val; } };",
        {
            code: "({ foo() { return 1; } });",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A { constructor(){} foo(){} get bar(){} set baz(value){} static qux(){}}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() {}",
            options: ["always"]
        },
        {
            code: "var a = function foo() {};",
            options: ["always"]
        },
        {
            code: "class A { constructor(){} foo(){} get bar(){} set baz(value){} static qux(){}}",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ foo() {} });",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function(){};",
            options: ["as-needed"]
        },
        {
            code: "({foo: function(){}});",
            options: ["as-needed"]
        },
        {
            code: "(foo = function(){});",
            options: ["as-needed"]
        },
        {
            code: "export default (function(){});",
            options: ["as-needed"],
            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module"
            }
        },
        {
            code: "({foo = function(){}} = {});",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({key: foo = function(){}} = {});",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "[foo = function(){}] = [];",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function fn(foo = function(){}) {}",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo() {}",
            options: ["never"]
        },
        {
            code: "var a = function() {};",
            options: ["never"]
        },
        {
            code: "var a = function foo() { foo(); };",
            options: ["never"]
        },
        {
            code: "var foo = {bar: function() {}};",
            options: ["never"]
        },
        {
            code: "$('#foo').click(function() {});",
            options: ["never"]
        },
        {
            code: "Foo.prototype.bar = function() {};",
            options: ["never"]
        },
        {
            code: "class A { constructor(){} foo(){} get bar(){} set baz(value){} static qux(){}}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ foo() {} });",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "Foo.prototype.bar = function() {};",
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "(function(){}())",
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "f(function(){})",
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "var a = new Date(function() {});",
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "var test = function(d, e, f) {};",
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "new function() {}",
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "Foo.prototype.bar = function() {};",
            options: ["as-needed"],
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "(function(){}())",
            options: ["as-needed"],
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "f(function(){})",
            options: ["as-needed"],
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "var a = new Date(function() {});",
            options: ["as-needed"],
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "new function() {}",
            options: ["as-needed"],
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "var {foo} = function(){};",
            options: ["as-needed"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unexpected unnamed function.", type: "FunctionExpression" }]
        },
        {
            code: "var x = function foo() {};",
            options: ["never"],
            errors: [{ message: "Unexpected named function 'foo'.", type: "FunctionExpression" }]
        },
        {
            code: "Foo.prototype.bar = function foo() {};",
            options: ["never"],
            errors: [{ message: "Unexpected named function 'foo'.", type: "FunctionExpression" }]
        },
        {
            code: "({foo: function foo() {}})",
            options: ["never"],
            errors: [{ message: "Unexpected named method 'foo'.", type: "FunctionExpression" }]
        },
        {
            code: "({foo: function foo() {}})",
            options: ["never"],
            errors: [{ message: "Unexpected named method 'foo'.", type: "FunctionExpression" }]
        }
    ]
});
