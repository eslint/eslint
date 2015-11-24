/**
 * @fileoverview Tests for yield-star-spacing rule.
 * @author Bryan Smith
 * @copyright 2015 Bryan Smith. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/yield-star-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("yield-star-spacing", rule, {

    valid: [

        // default (after)
        {
            code: "function *foo(){ yield foo; }",
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield* foo; }",
            ecmaFeatures: { generators: true }
        },

        // after
        {
            code: "function *foo(){ yield foo; }",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield* foo; }",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield* foo(); }",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield* 0 }",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield* []; }",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ var result = yield* foo(); }",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ var result = yield* (foo()); }",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },

        // before
        {
            code: "function *foo(){ yield foo; }",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield *foo; }",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield *foo(); }",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield *0 }",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield *[]; }",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ var result = yield *foo(); }",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },

        // both
        {
            code: "function *foo(){ yield foo; }",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield * foo; }",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield * foo(); }",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield * 0 }",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield * []; }",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ var result = yield * foo(); }",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },

        // neither
        {
            code: "function *foo(){ yield foo; }",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield*foo; }",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield*foo(); }",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield*0 }",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ yield*[]; }",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(){ var result = yield*foo(); }",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        }
    ],

    invalid: [
        // default (after)
        {
            code: "function *foo(){ yield *foo1; }",
            output: "function *foo(){ yield* foo1; }",
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo2; }",
            output: "function *foo(){ yield* foo2; }",
            options: ["after"],
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo; }",
            output: "function *foo(){ yield *foo; }",
            options: ["before"],
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield *foo3; }",
            output: "function *foo(){ yield * foo3; }",
            options: ["both"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield*foo4; }",
            output: "function *foo(){ yield * foo4; }",
            options: ["both"],
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield *foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(){ yield * foo; }",
            output: "function *foo(){ yield*foo; }",
            options: ["neither"],
            ecmaFeatures: { generators: true },
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
