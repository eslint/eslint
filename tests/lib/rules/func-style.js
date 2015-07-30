/**
 * @fileoverview Tests for func-style rule.
 * @author Nicholas C. Zakas
 * @copyright 2013 Nicholas C. Zakas. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/func-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("func-style", rule, {
    valid: [
        {
            code: "function foo(){}\n function bar(){}",
            options: ["declaration"]
        },
        {
            code: "foo.bar = function(){};",
            options: ["declaration"]
        },
        {
            code: "(function() { /* code */ }());",
            options: ["declaration"]
        },
        {
            code: "var module = (function() { return {}; }());",
            options: ["declaration"]
        },
        {
            code: "var object = { foo: function(){} };",
            options: ["declaration"]
        },
        {
            code: "Array.prototype.foo = function(){};",
            options: ["declaration"]
        },
        {
            code: "foo.bar = function(){};",
            options: ["expression"]
        },
        {
            code: "var foo = function(){};\n var bar = function(){};",
            options: ["expression"]
        },
        {
            code: "var foo = () => {};\n var bar = () => {}",
            options: ["expression"],
            ecmaFeatures: { arrowFunctions: true }
        }
    ],

    invalid: [
        {
            code: "var foo = function(){};",
            options: ["declaration"],
            errors: [
                {
                    message: "Expected a function declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "var foo = () => {};",
            options: ["declaration"],
            ecmaFeatures: { arrowFunctions: true },
            errors: [
                {
                    message: "Expected a function declaration.",
                    type: "VariableDeclarator"
                }
            ]
        },
        {
            code: "function foo(){}",
            options: ["expression"],
            errors: [
                {
                    message: "Expected a function expression.",
                    type: "FunctionDeclaration"
                }
            ]
        }
    ]
});
