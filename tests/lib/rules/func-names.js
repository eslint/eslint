/**
 * @fileoverview Tests for func-names rule.
 * @author Kyle T. Nunery
 * @copyright 2015 Brandon Mills. All rights reserved.
 * @copyright 2014 Kyle T. Nunery. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/func-names", {
    valid: [
        "Foo.prototype.bar = function bar(){};",
        "function foo(){}",
        "function test(d, e, f) {}",
        "new function bar(){}",
        "exports = { get foo() { return 1; }, set bar(val) { return val; } };",
        {
            code: "({ foo() { return 1; } });",
            ecmaFeatures: { objectLiteralShorthandMethods: true }
        }
    ],
    invalid: [
        { code: "Foo.prototype.bar = function() {};", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "(function(){}())", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "f(function(){})", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "var a = new Date(function() {});", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "var test = function (d, e, f) {};", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] },
        { code: "new function() {}", errors: [{ message: "Missing function expression name.", type: "FunctionExpression"}] }
    ]
});
