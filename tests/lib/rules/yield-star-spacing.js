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
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // after
        {
            code: "function *foo(){ yield *foo1; }",
            output: "function *foo(){ yield* foo1; }",
            options: ["after"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield * foo; }",
            output: "function *foo(){ yield* foo; }",
            options: ["after"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo2; }",
            output: "function *foo(){ yield* foo2; }",
            options: ["after"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // before
        {
            code: "function *foo(){ yield* foo; }",
            output: "function *foo(){ yield *foo; }",
            options: ["before"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield * foo; }",
            output: "function *foo(){ yield *foo; }",
            options: ["before"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo; }",
            output: "function *foo(){ yield *foo; }",
            options: ["before"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },

        // both
        {
            code: "function *foo(){ yield* foo; }",
            output: "function *foo(){ yield * foo; }",
            options: ["both"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield *foo3; }",
            output: "function *foo(){ yield * foo3; }",
            options: ["both"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo4; }",
            output: "function *foo(){ yield * foo4; }",
            options: ["both"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // neither
        {
            code: "function *foo(){ yield* foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield *foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield * foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        }
    ]

});
