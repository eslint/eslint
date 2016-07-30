/**
 * @fileoverview Tests for no-dupe-class-members rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-dupe-class-members");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-dupe-class-members", rule, {
    valid: [
        {code: "class A { foo() {} bar() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { static foo() {} foo() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { get foo() {} set foo(value) {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { static foo() {} get foo() {} set foo(value) {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { foo() { } } class B { foo() { } }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { [foo]() {} foo() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { 'foo'() {} 'bar'() {} baz() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { *'foo'() {} *'bar'() {} *baz() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { get 'foo'() {} get 'bar'() {} get baz() {} }", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { 1() {} 2() {} }", parserOptions: { ecmaVersion: 6 }}
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
            code: "class A { 'foo'() {} 'foo'() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "MethodDefinition", line: 1, column: 22, message: "Duplicate name 'foo'."}
            ]
        },
        {
            code: "class A { 10() {} 1e1() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {type: "MethodDefinition", line: 1, column: 19, message: "Duplicate name '10'."}
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
