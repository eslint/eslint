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

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("no-dupe-class-members", rule, {
    valid: [
        "class A { foo() {} bar() {} }",
        "class A { static foo() {} foo() {} }",
        "class A { get foo() {} set foo(value) {} }",
        "class A { static foo() {} get foo() {} set foo(value) {} }",
        "class A { foo() { } } class B { foo() { } }",
        "class A { [foo]() {} foo() {} }",
        "class A { 'foo'() {} 'bar'() {} baz() {} }",
        "class A { *'foo'() {} *'bar'() {} *baz() {} }",
        "class A { get 'foo'() {} get 'bar'() {} get baz() {} }",
        "class A { 1() {} 2() {} }"
    ],
    invalid: [
        {
            code: "class A { foo() {} foo() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 20, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "!class A { foo() {} foo() {} };",
            errors: [
                { type: "MethodDefinition", line: 1, column: 21, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { 'foo'() {} 'foo'() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 22, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { 10() {} 1e1() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 19, messageId: "unexpected", data: { name: "10" } }
            ]
        },
        {
            code: "class A { foo() {} foo() {} foo() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 20, messageId: "unexpected", data: { name: "foo" } },
                { type: "MethodDefinition", line: 1, column: 29, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { static foo() {} static foo() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 27, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {} get foo() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 20, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { set foo(value) {} foo() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 29, messageId: "unexpected", data: { name: "foo" } }
            ]
        }
    ]
});
