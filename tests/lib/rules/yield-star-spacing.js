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

const ruleTester = new RuleTester();

ruleTester.run("yield-star-spacing", rule, {

    valid: [

        // default (after)
        {
            code: "function *foo(){ yield foo; }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield* foo; }",
            parserOptions: { ecmaVersion: 6 }
        },

        // after
        {
            code: "function *foo(){ yield foo; }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield* foo; }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield* foo(); }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield* 0 }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield* []; }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ var result = yield* foo(); }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ var result = yield* (foo()); }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },

        // before
        {
            code: "function *foo(){ yield foo; }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield *foo; }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield *foo(); }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield *0 }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield *[]; }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ var result = yield *foo(); }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },

        // both
        {
            code: "function *foo(){ yield foo; }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield * foo; }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield * foo(); }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield * 0 }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield * []; }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ var result = yield * foo(); }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },

        // neither
        {
            code: "function *foo(){ yield foo; }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield*foo; }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield*foo(); }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield*0 }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ yield*[]; }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(){ var result = yield*foo(); }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [

        // default (after)
        {
            code: "function *foo(){ yield *foo1; }",
            output: "function *foo(){ yield* foo1; }",
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo2; }",
            output: "function *foo(){ yield* foo2; }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo; }",
            output: "function *foo(){ yield *foo; }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield *foo3; }",
            output: "function *foo(){ yield * foo3; }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo4; }",
            output: "function *foo(){ yield * foo4; }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield *foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield * foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 },
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
