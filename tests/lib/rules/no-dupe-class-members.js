/**
 * @fileoverview Tests for no-dupe-class-members rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-dupe-class-members");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

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
        "class A { 1() {} 2() {} }",
        "class A { ['foo']() {} ['bar']() {} }",
        "class A { [`foo`]() {} [`bar`]() {} }",
        "class A { [12]() {} [123]() {} }",
        "class A { [1.0]() {} ['1.0']() {} }",
        "class A { [0x1]() {} [`0x1`]() {} }",
        "class A { [null]() {} ['']() {} }",
        "class A { get ['foo']() {} set ['foo'](value) {} }",
        "class A { ['foo']() {} static ['foo']() {} }",

        // computed "constructor" key doesn't create constructor
        "class A { ['constructor']() {} constructor() {} }",
        "class A { 'constructor'() {} [`constructor`]() {} }",
        "class A { constructor() {} get [`constructor`]() {} }",
        "class A { 'constructor'() {} set ['constructor'](value) {} }",

        // not assumed to be statically-known values
        "class A { ['foo' + '']() {} ['foo']() {} }",
        "class A { [`foo${''}`]() {} [`foo`]() {} }",
        "class A { [-1]() {} ['-1']() {} }",

        // not supported by this rule
        "class A { [foo]() {} [foo]() {} }",

        // private and public
        "class A { foo; static foo; }",
        "class A { foo; #foo; }",
        "class A { '#foo'; #foo; }"
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
            code: "class A { ['foo']() {} ['foo']() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 24, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { static ['foo']() {} static foo() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 31, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { set 'foo'(value) {} set ['foo'](val) {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 31, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { ''() {} ['']() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 19, messageId: "unexpected", data: { name: "" } }
            ]
        },
        {
            code: "class A { [`foo`]() {} [`foo`]() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 24, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { static get [`foo`]() {} static get ['foo']() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 35, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { foo() {} [`foo`]() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 20, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { get [`foo`]() {} 'foo'() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 28, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { static 'foo'() {} static [`foo`]() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 29, messageId: "unexpected", data: { name: "foo" } }
            ]
        },
        {
            code: "class A { ['constructor']() {} ['constructor']() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 32, messageId: "unexpected", data: { name: "constructor" } }
            ]
        },
        {
            code: "class A { static [`constructor`]() {} static constructor() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 39, messageId: "unexpected", data: { name: "constructor" } }
            ]
        },
        {
            code: "class A { static constructor() {} static 'constructor'() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 35, messageId: "unexpected", data: { name: "constructor" } }
            ]
        },
        {
            code: "class A { [123]() {} [123]() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 22, messageId: "unexpected", data: { name: "123" } }
            ]
        },
        {
            code: "class A { [0x10]() {} 16() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 23, messageId: "unexpected", data: { name: "16" } }
            ]
        },
        {
            code: "class A { [100]() {} [1e2]() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 22, messageId: "unexpected", data: { name: "100" } }
            ]
        },
        {
            code: "class A { [123.00]() {} [`123`]() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 25, messageId: "unexpected", data: { name: "123" } }
            ]
        },
        {
            code: "class A { static '65'() {} static [0o101]() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 28, messageId: "unexpected", data: { name: "65" } }
            ]
        },
        {
            code: "class A { [123n]() {} 123() {} }",
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                { type: "MethodDefinition", line: 1, column: 23, messageId: "unexpected", data: { name: "123" } }
            ]
        },
        {
            code: "class A { [null]() {} 'null'() {} }",
            errors: [
                { type: "MethodDefinition", line: 1, column: 23, messageId: "unexpected", data: { name: "null" } }
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
        },
        {
            code: "class A { foo; foo; }",
            errors: [
                { type: "PropertyDefinition", line: 1, column: 16, messageId: "unexpected", data: { name: "foo" } }
            ]
        }

        /*
         * This is syntax error
         * { code: "class A { #foo; #foo; }" }
         */
    ]
});
