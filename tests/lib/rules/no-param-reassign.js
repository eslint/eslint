/**
 * @fileoverview Disallow reassignment of function parameters.
 * @author Nat Burns
 * @copyright 2014 Nat Burns. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-param-reassign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-param-reassign", rule, {

    valid: [
        "function foo(a) { var b = a; }",
        "function foo(a) { a.prop = 'value'; }",
        "function foo(a) { (function() { var a = 12; a++; })(); }",
        { code: "function foo() { global = 13; }", globals: ["global"] },
        "function foo(a) { a.b = 0; }",
        "function foo(a) { delete a.b; }",
        "function foo(a) { ++a.b; }",
        { code: "function foo(a) { [a.b] = []; }", ecmaFeatures: {destructuring: true} },
        { code: "function foo(a) { bar(a.b).c = 0; }", options: [{props: true}] },
        { code: "function foo(a) { data[a.b] = 0; }", options: [{props: true}] },
        { code: "function foo(a) { +a.b; }", options: [{props: true}] }
    ],

    invalid: [
        { code: "function foo(bar) { bar = 13; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar += 13; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { (function() { bar = 13; })(); }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { ++bar; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar++; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { --bar; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar--; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo({bar}) { bar = 13; }", ecmaFeatures: {destructuring: true}, errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo([, {bar}]) { bar = 13; }", ecmaFeatures: {destructuring: true}, errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { ({bar}) = {}; }", ecmaFeatures: {destructuring: true}, errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { ({x: [, bar = 0]}) = {}; }", ecmaFeatures: {destructuring: true}, errors: [{ message: "Assignment to function parameter 'bar'." }] },

        {
            code: "function foo(bar) { bar.a = 0; }",
            options: [{props: true}],
            errors: [{ message: "Assignment to function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { bar.get(0).a = 0; }",
            options: [{props: true}],
            errors: [{ message: "Assignment to function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { delete bar.a; }",
            options: [{props: true}],
            errors: [{ message: "Assignment to function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { ++bar.a; }",
            options: [{props: true}],
            errors: [{ message: "Assignment to function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { [bar.a] = []; }",
            ecmaFeatures: {destructuring: true},
            options: [{props: true}],
            errors: [{ message: "Assignment to function parameter 'bar'." }]
        }
    ]
});
