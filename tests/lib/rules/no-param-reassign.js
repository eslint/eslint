/**
 * @fileoverview Disallow reassignment of function parameters.
 * @author Nat Burns
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-param-reassign"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-param-reassign", rule, {

    valid: [
        "function foo(a) { var b = a; }",
        "function foo(a) { for (b in a); }",
        { code: "function foo(a) { for (b of a); }", parserOptions: { ecmaVersion: 6 } },
        "function foo(a) { a.prop = 'value'; }",
        "function foo(a) { for (a.prop in obj); }",
        { code: "function foo(a) { for (a.prop of arr); }", parserOptions: { ecmaVersion: 6 } },
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
        { code: "function foo(a) { for (a.b in obj); }", options: [{ props: true, ignorePropertyModificationsFor: ["a"] }] },
        { code: "function foo(a) { for (a.b of arr); }", options: [{ props: true, ignorePropertyModificationsFor: ["a"] }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo(a, z) { a.b = 0; x.y = 0; }", options: [{ props: true, ignorePropertyModificationsFor: ["a", "x"] }] },
        { code: "function foo(a) { a.b.c = 0;}", options: [{ props: true, ignorePropertyModificationsFor: ["a"] }] },
        { code: "function foo(aFoo) { aFoo.b = 0; }", options: [{ props: true, ignorePropertyModificationsForRegex: ["^a.*$"] }] },
        { code: "function foo(aFoo) { ++aFoo.b; }", options: [{ props: true, ignorePropertyModificationsForRegex: ["^a.*$"] }] },
        { code: "function foo(aFoo) { delete aFoo.b; }", options: [{ props: true, ignorePropertyModificationsForRegex: ["^a.*$"] }] },
        { code: "function foo(a, z) { aFoo.b = 0; x.y = 0; }", options: [{ props: true, ignorePropertyModificationsForRegex: ["^a.*$", "^x.*$"] }] },
        { code: "function foo(aFoo) { aFoo.b.c = 0;}", options: [{ props: true, ignorePropertyModificationsForRegex: ["^a.*$"] }] },
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
        },
        {
            code: "function foo(a) { for (obj[a.b] in obj); }",
            options: [{ props: true }]
        },
        {
            code: "function foo(a) { for (obj[a.b] of arr); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a) { for (bar in a.b); }",
            options: [{ props: true }]
        },
        {
            code: "function foo(a) { for (bar of a.b); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(a) { for (bar in baz) a.b; }",
            options: [{ props: true }]
        },
        {
            code: "function foo(a) { for (bar of baz) a.b; }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function foo(bar, baz) { bar.a = true; baz.b = false; }",
            options: [{
                props: true,
                ignorePropertyModificationsForRegex: ["^(foo|bar)$"],
                ignorePropertyModificationsFor: ["baz"]
            }]
        }
    ],

    invalid: [
        {
            code: "function foo(bar) { bar = 13; }",
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { bar += 13; }",
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { (function() { bar = 13; })(); }",
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { ++bar; }",
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { bar++; }",
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { --bar; }",
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { bar--; }",
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo({bar}) { bar = 13; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo([, {bar}]) { bar = 13; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { ({bar} = {}); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { ({x: [, bar = 0]} = {}); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { for (bar in baz); }",
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { for (bar of baz); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "bar" }
            }]
        },

        {
            code: "function foo(bar) { bar.a = 0; }",
            options: [{ props: true }],
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { bar.get(0).a = 0; }",
            options: [{ props: true }],
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { delete bar.a; }",
            options: [{ props: true }],
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { ++bar.a; }",
            options: [{ props: true }],
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { for (bar.a in {}); }",
            options: [{ props: true }],
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { for (bar.a of []); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { (bar ? bar : [])[0] = 1; }",
            options: [{ props: true }],
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { [bar.a] = []; }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { [bar.a] = []; }",
            options: [{ props: true, ignorePropertyModificationsFor: ["a"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { [bar.a] = []; }",
            options: [{ props: true, ignorePropertyModificationsForRegex: ["^a.*$"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { [bar.a] = []; }",
            options: [{ props: true, ignorePropertyModificationsForRegex: ["^B.*$"] }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(bar) { ({foo: bar.a} = {}); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "bar" }
            }]
        },
        {
            code: "function foo(a) { ({a} = obj); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: {
                    name: "a"
                }
            }]
        },
        {
            code: "function foo(a) { ([...a] = obj); }",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: {
                    name: "a"
                }
            }]
        },
        {
            code: "function foo(a) { ({...a} = obj); }",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: {
                    name: "a"
                }
            }]
        },
        {
            code: "function foo(a) { ([...a.b] = obj); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { ({...a.b} = obj); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { for ({bar: a.b} in {}); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { for ([a.b] of []); }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { a &&= b; }",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { a ||= b; }",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { a ??= b; }",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "assignmentToFunctionParam",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { a.b &&= c; }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { a.b.c ||= d; }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "a" }
            }]
        },
        {
            code: "function foo(a) { a[b] ??= c; }",
            options: [{ props: true }],
            parserOptions: { ecmaVersion: 2021 },
            errors: [{
                messageId: "assignmentToFunctionParamProp",
                data: { name: "a" }
            }]
        }
    ]
});
