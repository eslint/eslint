/**
 * @fileoverview Tests for require-await rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-await"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
        "async function foo() { await async () => { await doSomething() } }",

        // empty functions are ok.
        "async function foo() {}",
        "async () => {}",

        // normal functions are ok.
        "function foo() { doSomething() }",

        // for-await-of
        "async function foo() { for await (x of xs); }"
    ],
    invalid: [
        {
            code: "async function foo() { doSomething() }",
            errors: ["Async function 'foo' has no 'await' expression."]
        },
        {
            code: "(async function() { doSomething() })",
            errors: ["Async function has no 'await' expression."]
        },
        {
            code: "async () => { doSomething() }",
            errors: ["Async arrow function has no 'await' expression."]
        },
        {
            code: "async () => doSomething()",
            errors: ["Async arrow function has no 'await' expression."]
        },
        {
            code: "({ async foo() { doSomething() } })",
            errors: ["Async method 'foo' has no 'await' expression."]
        },
        {
            code: "class A { async foo() { doSomething() } }",
            errors: ["Async method 'foo' has no 'await' expression."]
        },
        {
            code: "(class { async foo() { doSomething() } })",
            errors: ["Async method 'foo' has no 'await' expression."]
        },
        {
            code: "async function foo() { async () => { await doSomething() } }",
            errors: ["Async function 'foo' has no 'await' expression."]
        },
        {
            code: "async function foo() { await async () => { doSomething() } }",
            errors: ["Async arrow function has no 'await' expression."]
        }
    ]
});
