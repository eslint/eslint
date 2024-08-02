/**
 * @fileoverview Tests for require-await rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-await"),
    RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2018
    }
});

ruleTester.run("require-await", rule, {
    valid: [
        "async function foo() { await doSomething() }",
        "(async function() { await doSomething() })",
        "async () => { await doSomething() }",
        "async () => await doSomething()",
        "({ async foo() { await doSomething() } })",
        "class A { async foo() { await doSomething() } }",
        "(class { async foo() { await doSomething() } })",
        "async function foo() { await (async () => { await doSomething() }) }",

        // empty functions are ok.
        "async function foo() {}",
        "async () => {}",

        // normal functions are ok.
        "function foo() { doSomething() }",

        // for-await-of
        "async function foo() { for await (x of xs); }",

        // global await
        {
            code: "await foo()",
            languageOptions: {
                parser: require("../../fixtures/parsers/typescript-parsers/global-await")
            }
        },
        {
            code: `
                for await (let num of asyncIterable) {
                    console.log(num);
                }
            `,
            languageOptions: {
                parser: require("../../fixtures/parsers/typescript-parsers/global-for-await-of")
            }
        },
        {
            code: "async function* run() { yield * anotherAsyncGenerator() }",
            languageOptions: { ecmaVersion: 9 }
        },
        {
            code: `async function* run() {
                await new Promise(resolve => setTimeout(resolve, 100));
                yield 'Hello';
                console.log('World');
            }
            `,
            languageOptions: { ecmaVersion: 9 }
        },
        {
            code: "async function* run() { }",
            languageOptions: { ecmaVersion: 9 }
        },
        {
            code: "const foo = async function *(){}",
            languageOptions: { ecmaVersion: 9 }
        },
        {
            code: 'const foo = async function *(){ console.log("bar") }',
            languageOptions: { ecmaVersion: 9 }
        },
        {
            code: 'async function* run() { console.log("bar") }',
            languageOptions: { ecmaVersion: 9 }
        }

    ],
    invalid: [
        {
            code: "async function foo() { doSomething() }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async function 'foo'" },
                suggestions: [
                    { output: "function foo() { doSomething() }", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "(async function() { doSomething() })",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async function" },
                suggestions: [
                    { output: "(function() { doSomething() })", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "async () => { doSomething() }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async arrow function" },
                suggestions: [
                    { output: "() => { doSomething() }", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "async () => doSomething()",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async arrow function" },
                suggestions: [
                    { output: "() => doSomething()", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "({ async foo() { doSomething() } })",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method 'foo'" },
                suggestions: [
                    { output: "({ foo() { doSomething() } })", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "class A { async foo() { doSomething() } }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method 'foo'" },
                suggestions: [
                    { output: "class A { foo() { doSomething() } }", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "(class { async foo() { doSomething() } })",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method 'foo'" },
                suggestions: [
                    { output: "(class { foo() { doSomething() } })", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "(class { async ''() { doSomething() } })",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method ''" },
                suggestions: [
                    { output: "(class { ''() { doSomething() } })", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "async function foo() { async () => { await doSomething() } }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async function 'foo'" },
                suggestions: [
                    { output: "function foo() { async () => { await doSomething() } }", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "async function foo() { await (async () => { doSomething() }) }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async arrow function" },
                suggestions: [
                    { output: "async function foo() { await (() => { doSomething() }) }", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "const obj = { async: async function foo() { bar(); } }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method 'async'" },
                suggestions: [
                    { output: "const obj = { async: function foo() { bar(); } }", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: "async    /* test */ function foo() { doSomething() }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async function 'foo'" },
                suggestions: [
                    { output: "/* test */ function foo() { doSomething() }", messageId: "removeAsync" }
                ]
            }]
        },
        {
            code: `class A {
                a = 0
                async [b](){ return 0; }
            }`,
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method" },
                suggestions: [
                    {
                        output: `class A {
                a = 0
                ;[b](){ return 0; }
            }`,
                        messageId: "removeAsync"
                    }
                ]
            }]
        },
        {
            code: `foo
                async () => { return 0; }
            `,
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async arrow function" },
                suggestions: [
                    {
                        output: `foo
                ;() => { return 0; }
            `,
                        messageId: "removeAsync"
                    }
                ]
            }]
        },
        {
            code: `class A {
                foo() {}
                async [bar] () { baz; }
            }`,
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method" },
                suggestions: [
                    {
                        output: `class A {
                foo() {}
                [bar] () { baz; }
            }`,
                        messageId: "removeAsync"
                    }
                ]
            }]
        }
    ]
});
