/**
 * @fileoverview Tests for func-names rule.
 * @author Kyle T. Nunery
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/func-names"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("func-names", rule, {
    valid: [
        "Foo.prototype.bar = function bar(){};",
        { code: "Foo.prototype.bar = () => {}", parserOptions: { ecmaVersion: 6 }},
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
        }
    ],
    invalid: [
        { code: "Foo.prototype.bar = function() {};", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "(function(){}())", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "f(function(){})", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "var a = new Date(function() {});", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "var test = function(d, e, f) {};", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "new function() {}", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] }
    ]
});
