/**
 * @fileoverview Disallow reassignment of function parameters.
 * @author Nat Burns
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-param-reassign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-param-reassign", rule, {

    valid: [
        "function foo(a) { var b = a; }",
        "function foo(a) { a.prop = 'value'; }",
        "function foo(a) { (function() { var a = 12; a++; })(); }",
        "function foo() { someGlobal = 13; }",
        { code: "function foo() { someGlobal = 13; }", globals: { someGlobal: false } },
        "function foo(a) { a.b = 0; }",
        "function foo(a) { delete a.b; }",
        "function foo(a) { ++a.b; }",
        { code: "function foo(a) { [a.b] = []; }", parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a) { bar(a.b).c = 0; }", options: [{ props: true }] },
        { code: "function foo(a) { data[a.b] = 0; }", options: [{ props: true }] },
        { code: "function foo(a) { +a.b; }", options: [{ props: true }] },
        { code: "function foo(a) { (a ? [] : [])[0] = 1; }", options: [{ props: true }] },
        { code: "function foo(a) { (a.b ? [] : [])[0] = 1; }", options: [{ props: true }] },
        { code: "function foo(a) { a.b = 0; }", options: [{ props: true, ignorePropertyModificationsFor: ["a"] }] },
        { code: "function foo(a) { ++a.b; }", options: [{ props: true, ignorePropertyModificationsFor: ["a"] }] },
        { code: "function foo(a) { delete a.b; }", options: [{ props: true, ignorePropertyModificationsFor: ["a"] }] },
        { code: "function foo(a, z) { a.b = 0; x.y = 0; }", options: [{ props: true, ignorePropertyModificationsFor: ["a", "x"] }] },
        { code: "function foo(a) { a.b.c = 0;}", options: [{ props: true, ignorePropertyModificationsFor: ["a"] }] },
        {
            code: "function foo(a) { ({ [a]: variable } = value) }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a) { ([...a.b] = obj); }",
            options: [{ props: false }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "function foo(a) { ({...a.b} = obj); }",
            options: [{ props: false }],
            parserOptions: { ecmaVersion: 2018 }
        }
    ],

    invalid: [
        { code: "function foo(bar) { bar = 13; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar += 13; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { (function() { bar = 13; })(); }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { ++bar; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar++; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { --bar; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { bar--; }", errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo({bar}) { bar = 13; }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo([, {bar}]) { bar = 13; }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { ({bar} = {}); }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Assignment to function parameter 'bar'." }] },
        { code: "function foo(bar) { ({x: [, bar = 0]} = {}); }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Assignment to function parameter 'bar'." }] },

        {
            code: "function foo(bar) { bar.a = 0; }",
            options: [{ props: true }],
            errors: [{ message: "Assignment to property of function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { bar.get(0).a = 0; }",
            options: [{ props: true }],
            errors: [{ message: "Assignment to property of function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { delete bar.a; }",
            options: [{ props: true }],
            errors: [{ message: "Assignment to property of function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { ++bar.a; }",
            options: [{ props: true }],
            errors: [{ message: "Assignment to property of function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { (bar ? bar : [])[0] = 1; }",
            options: [{ props: true }],
            errors: [{ message: "Assignment to property of function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { [bar.a] = []; }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Assignment to property of function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { [bar.a] = []; }",
            options: [{ props: true, ignorePropertyModificationsFor: ["a"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Assignment to property of function parameter 'bar'." }]
        },
        {
            code: "function foo(bar) { ({foo: bar.a} = {}); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Assignment to property of function parameter 'bar'." }]
        },
        {
            code: "function foo(a) { ({a} = obj); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Assignment to function parameter 'a'." }]
        },
        {
            code: "function foo(a) { ([...a] = obj); }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ message: "Assignment to function parameter 'a'." }]
        },
        {
            code: "function foo(a) { ({...a} = obj); }",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ message: "Assignment to function parameter 'a'." }]
        },
        {
            code: "function foo(a) { ([...a.b] = obj); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ message: "Assignment to property of function parameter 'a'." }]
        },
        {
            code: "function foo(a) { ({...a.b} = obj); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ message: "Assignment to property of function parameter 'a'." }]
        }
    ]
});
