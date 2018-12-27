"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-await-function-call");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 8,
        sourceType: "module"
    }
});

const VALID_USAGES = [
    {
        code: "async function myFunction() { await asyncFunc(); }",
        options: [{ functions: ["asyncFunc"] }]
    },
    {

        // When the `AwaitExpression` isn't the direct parent of the `CallExpression`.
        code: "async function myFunction() { await asyncFunc().then(() => {}); }",
        options: [{ functions: ["asyncFunc"] }]
    },
    {

        // Not one of the specified functions.
        code: "otherFunc();",
        options: [{ functions: ["asyncFunc"] }]
    },
    {

        // Not one of the specified functions.
        code: "async function myFunction() { await otherAsyncFunc(); }",
        options: [{ functions: ["asyncFunc"] }]
    }
];

const INVALID_USAGES = [
    {

        // Missing `await`.
        code: "asyncFunc();",
        options: [{ functions: ["asyncFunc"] }],
        errors: [
            {
                message: "Use `await` with `asyncFunc` function call.",
                type: "CallExpression"
            }
        ]
    },
    {

        // Missing `await` and part of promise chain.
        code: "asyncFunc().then(() => {});",
        options: [{ functions: ["asyncFunc"] }],
        errors: [
            {
                message: "Use `await` with `asyncFunc` function call.",
                type: "CallExpression"
            }
        ]
    },
    {

        // Missing `await` but inside another `await` function call.
        code: "async function topLevelFunction() { await otherAsyncFunc(() => { asyncFunc(); }); }",
        options: [{ functions: ["asyncFunc"] }],
        errors: [
            {
                message: "Use `await` with `asyncFunc` function call.",
                type: "CallExpression"
            }
        ]
    }
];

ruleTester.run("require-await-function-call", rule, {
    valid: VALID_USAGES,
    invalid: INVALID_USAGES
});
