/**
 * @fileoverview Tests for func-style rule.
 * @author Nicholas C. Zakas
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
eslintTester.addRuleTest("lib/rules/func-style", {
    valid: [
        {
            code: "function foo(){}\n function bar(){}",
            args: [1, "declaration"]
        },
        {
            code: "foo.bar = function(){};",
            args: [1, "declaration"]
        },
        {
            code: "(function() { /* code */ }());",
            args: [1, "declaration"]
        },
        {
            code: "var module = (function() { return {}; }());",
            args: [1, "declaration"]
        },
        {
            code: "var object = { foo: function(){} };",
            args: [1, "declaration"]
        },
        {
            code: "Array.prototype.foo = function(){};",
            args: [1, "declaration"]
        },
        {
            code: "foo.bar = function(){};",
            args: [1, "expression"]
        },
        {
            code: "var foo = function(){};\n var bar = function(){};",
            args: [1, "expression"]
        }
    ],

    invalid: [
        {
            code: "var foo = function(){};",
            args: [1, "declaration"],
            errors: [
                {
                    message: "Expected a function declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo(){}",
            args: [1, "expression"],
            errors: [
                {
                    message: "Expected a function expression.",
                    type: "FunctionDeclaration"
                }
            ]
        }
    ]
});
