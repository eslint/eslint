/**
 * @fileoverview Tests for yield-star-spacing rule.
 * @author Bryan Smith
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/yield-star-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

const missingBeforeError = { messageId: "missingBefore", type: "Punctuator" };
const missingAfterError = { messageId: "missingAfter", type: "Punctuator" };
const unexpectedBeforeError = { messageId: "unexpectedBefore", type: "Punctuator" };
const unexpectedAfterError = { messageId: "unexpectedAfter", type: "Punctuator" };

ruleTester.run("yield-star-spacing", rule, {

    valid: [

        // default (after)
        "function *foo(){ yield foo; }",
        "function *foo(){ yield* foo; }",

        // after
        {
            code: "function *foo(){ yield foo; }",
            options: ["after"]
        },
        {
            code: "function *foo(){ yield* foo; }",
            options: ["after"]
        },
        {
            code: "function *foo(){ yield* foo(); }",
            options: ["after"]
        },
        {
            code: "function *foo(){ yield* 0 }",
            options: ["after"]
        },
        {
            code: "function *foo(){ yield* []; }",
            options: ["after"]
        },
        {
            code: "function *foo(){ var result = yield* foo(); }",
            options: ["after"]
        },
        {
            code: "function *foo(){ var result = yield* (foo()); }",
            options: ["after"]
        },

        // before
        {
            code: "function *foo(){ yield foo; }",
            options: ["before"]
        },
        {
            code: "function *foo(){ yield *foo; }",
            options: ["before"]
        },
        {
            code: "function *foo(){ yield *foo(); }",
            options: ["before"]
        },
        {
            code: "function *foo(){ yield *0 }",
            options: ["before"]
        },
        {
            code: "function *foo(){ yield *[]; }",
            options: ["before"]
        },
        {
            code: "function *foo(){ var result = yield *foo(); }",
            options: ["before"]
        },

        // both
        {
            code: "function *foo(){ yield foo; }",
            options: ["both"]
        },
        {
            code: "function *foo(){ yield * foo; }",
            options: ["both"]
        },
        {
            code: "function *foo(){ yield * foo(); }",
            options: ["both"]
        },
        {
            code: "function *foo(){ yield * 0 }",
            options: ["both"]
        },
        {
            code: "function *foo(){ yield * []; }",
            options: ["both"]
        },
        {
            code: "function *foo(){ var result = yield * foo(); }",
            options: ["both"]
        },

        // neither
        {
            code: "function *foo(){ yield foo; }",
            options: ["neither"]
        },
        {
            code: "function *foo(){ yield*foo; }",
            options: ["neither"]
        },
        {
            code: "function *foo(){ yield*foo(); }",
            options: ["neither"]
        },
        {
            code: "function *foo(){ yield*0 }",
            options: ["neither"]
        },
        {
            code: "function *foo(){ yield*[]; }",
            options: ["neither"]
        },
        {
            code: "function *foo(){ var result = yield*foo(); }",
            options: ["neither"]
        }
    ],

    invalid: [

        // default (after)
        {
            code: "function *foo(){ yield *foo1; }",
            output: "function *foo(){ yield* foo1; }",
            errors: [unexpectedBeforeError, missingAfterError]
        },

        // after
        {
            code: "function *foo(){ yield *foo1; }",
            output: "function *foo(){ yield* foo1; }",
            options: ["after"],
            errors: [unexpectedBeforeError, missingAfterError]
        },
        {
            code: "function *foo(){ yield * foo; }",
            output: "function *foo(){ yield* foo; }",
            options: ["after"],
            errors: [unexpectedBeforeError]
        },
        {
            code: "function *foo(){ yield*foo2; }",
            output: "function *foo(){ yield* foo2; }",
            options: ["after"],
            errors: [missingAfterError]
        },

        // before
        {
            code: "function *foo(){ yield* foo; }",
            output: "function *foo(){ yield *foo; }",
            options: ["before"],
            errors: [missingBeforeError, unexpectedAfterError]
        },
        {
            code: "function *foo(){ yield * foo; }",
            output: "function *foo(){ yield *foo; }",
            options: ["before"],
            errors: [unexpectedAfterError]
        },
        {
            code: "function *foo(){ yield*foo; }",
            output: "function *foo(){ yield *foo; }",
            options: ["before"],
            errors: [missingBeforeError]
        },

        // both
        {
            code: "function *foo(){ yield* foo; }",
            output: "function *foo(){ yield * foo; }",
            options: ["both"],
            errors: [missingBeforeError]
        },
        {
            code: "function *foo(){ yield *foo3; }",
            output: "function *foo(){ yield * foo3; }",
            options: ["both"],
            errors: [missingAfterError]
        },
        {
            code: "function *foo(){ yield*foo4; }",
            output: "function *foo(){ yield * foo4; }",
            options: ["both"],
            errors: [missingBeforeError, missingAfterError]
        },

        // neither
        {
            code: "function *foo(){ yield* foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            errors: [unexpectedAfterError]
        },
        {
            code: "function *foo(){ yield *foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            errors: [unexpectedBeforeError]
        },
        {
            code: "function *foo(){ yield * foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            errors: [unexpectedBeforeError, unexpectedAfterError]
        }
    ]

});
