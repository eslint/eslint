/**
 * @fileoverview Tests for require-await rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-await"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: {
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
            parser: require.resolve("../../fixtures/parsers/typescript-parsers/global-await")
        },
        {
            code: `
                for await (let num of asyncIterable) {
                    console.log(num);
                }
            `,
            parser: require.resolve("../../fixtures/parsers/typescript-parsers/global-for-await-of")
        },
        {
            code: "async function* run() { yield * anotherAsyncGenerator() }",
            parserOptions: { ecmaVersion: 9 }
        },
        {
            code: `async function* run() {
                await new Promise(resolve => setTimeout(resolve, 100));
                yield 'Hello';
                console.log('World');
            }
            `,
            parserOptions: { ecmaVersion: 9 }
        },
        {
            code: "async function* run() { }",
            parserOptions: { ecmaVersion: 9 }
        },
        {
            code: "const foo = async function *(){}",
            parserOptions: { ecmaVersion: 9 }
        },
        {
            code: 'const foo = async function *(){ console.log("bar") }',
            parserOptions: { ecmaVersion: 9 }
        },
        {
            code: 'async function* run() { console.log("bar") }',
            parserOptions: { ecmaVersion: 9 }
        }

    ],
    invalid: [
        {
            code: "async function foo() { doSomething() }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async function 'foo'" }
            }]
        },
        {
            code: "(async function() { doSomething() })",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async function" }
            }]
        },
        {
            code: "async () => { doSomething() }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async arrow function" }
            }]
        },
        {
            code: "async () => doSomething()",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async arrow function" }
            }]
        },
        {
            code: "({ async foo() { doSomething() } })",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method 'foo'" }
            }]
        },
        {
            code: "class A { async foo() { doSomething() } }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method 'foo'" }
            }]
        },
        {
            code: "(class { async foo() { doSomething() } })",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method 'foo'" }
            }]
        },
        {
            code: "(class { async ''() { doSomething() } })",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async method ''" }
            }]
        },
        {
            code: "async function foo() { async () => { await doSomething() } }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async function 'foo'" }
            }]
        },
        {
            code: "async function foo() { await (async () => { doSomething() }) }",
            errors: [{
                messageId: "missingAwait",
                data: { name: "Async arrow function" }
            }]
        }
    ]
});
