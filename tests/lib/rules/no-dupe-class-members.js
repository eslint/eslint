/**
 * @fileoverview Tests for no-dupe-class-members rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-dupe-class-members");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-dupe-class-members", rule, {
    valid: [
        {code: "class A { foo() {} bar() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { static foo() {} foo() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { get foo() {} set foo(value) {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { static foo() {} get foo() {} set foo(value) {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { foo() { } } class B { foo() { } }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { [foo]() {} foo() {} }", parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {
            code: "class A { foo() {} foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "MethodDefinition", line: 1, column: 20, message: "Duplicate name 'foo'."}
            ]
        },
        {
            code: "!class A { foo() {} foo() {} };",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "MethodDefinition", line: 1, column: 21, message: "Duplicate name 'foo'."}
            ]
        },
        {
            code: "class A { foo() {} foo() {} foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "MethodDefinition", line: 1, column: 20, message: "Duplicate name 'foo'."},
                {type: "MethodDefinition", line: 1, column: 29, message: "Duplicate name 'foo'."}
            ]
        },
        {
            code: "class A { static foo() {} static foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "MethodDefinition", line: 1, column: 27, message: "Duplicate name 'foo'."}
            ]
        },
        {
            code: "class A { foo() {} get foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "MethodDefinition", line: 1, column: 20, message: "Duplicate name 'foo'."}
            ]
        },
        {
            code: "class A { set foo(value) {} foo() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "MethodDefinition", line: 1, column: 29, message: "Duplicate name 'foo'."}
            ]
        }
    ]
});
