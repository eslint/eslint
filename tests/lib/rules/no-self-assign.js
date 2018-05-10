/**
 * @fileoverview Tests for no-self-assign rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-self-assign"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-self-assign", rule, {
    valid: [
        "var a = a",
        "a = b",
        "a += a",
        "a = +a",
        "a = [a]",
        { code: "let a = a", parserOptions: { ecmaVersion: 6 } },
        { code: "const a = a", parserOptions: { ecmaVersion: 6 } },
        { code: "[a] = a", parserOptions: { ecmaVersion: 6 } },
        { code: "[a = 1] = [a]", parserOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = [b, a]", parserOptions: { ecmaVersion: 6 } },
        { code: "[a,, b] = [, b, a]", parserOptions: { ecmaVersion: 6 } },
        { code: "[x, a] = [...x, a]", parserOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = {a, b}", parserOptions: { ecmaVersion: 6 } },
        { code: "({a} = a)", parserOptions: { ecmaVersion: 6 } },
        { code: "({a = 1} = {a})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a: b} = {a})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a} = {a: b})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a} = {a() {}})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a} = {[a]: a})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a, ...b} = {a, ...b})", parserOptions: { ecmaVersion: 2018 } },
        { code: "a.b = a.c", options: [{ props: true }] },
        { code: "a.b = c.b", options: [{ props: true }] },
        { code: "a.b = a[b]", options: [{ props: true }] },
        { code: "a[b] = a.b", options: [{ props: true }] },
        { code: "a.b().c = a.b().c", options: [{ props: true }] },
        { code: "b().c = b().c", options: [{ props: true }] },
        { code: "a[b + 1] = a[b + 1]", options: [{ props: true }] }, // it ignores non-simple computed properties.
        {
            code: "a.b = a.b",
            options: [{ props: false }]
        },
        {
            code: "a.b.c = a.b.c",
            options: [{ props: false }]
        },
        {
            code: "a[b] = a[b]",
            options: [{ props: false }]
        },
        {
            code: "a['b'] = a['b']",
            options: [{ props: false }]
        },
        {
            code: "a[\n    'b'\n] = a[\n    'b'\n]",
            options: [{ props: false }]
        }
    ],
    invalid: [
        { code: "a = a", errors: ["'a' is assigned to itself."] },
        { code: "[a] = [a]", parserOptions: { ecmaVersion: 6 }, errors: ["'a' is assigned to itself."] },
        { code: "[a, b] = [a, b]", parserOptions: { ecmaVersion: 6 }, errors: ["'a' is assigned to itself.", "'b' is assigned to itself."] },
        { code: "[a, b] = [a, c]", parserOptions: { ecmaVersion: 6 }, errors: ["'a' is assigned to itself."] },
        { code: "[a, b] = [, b]", parserOptions: { ecmaVersion: 6 }, errors: ["'b' is assigned to itself."] },
        { code: "[a, ...b] = [a, ...b]", parserOptions: { ecmaVersion: 6 }, errors: ["'a' is assigned to itself.", "'b' is assigned to itself."] },
        { code: "[[a], {b}] = [[a], {b}]", parserOptions: { ecmaVersion: 6 }, errors: ["'a' is assigned to itself.", "'b' is assigned to itself."] },
        { code: "({a} = {a})", parserOptions: { ecmaVersion: 6 }, errors: ["'a' is assigned to itself."] },
        { code: "({a: b} = {a: b})", parserOptions: { ecmaVersion: 6 }, errors: ["'b' is assigned to itself."] },
        { code: "({a, b} = {a, b})", parserOptions: { ecmaVersion: 6 }, errors: ["'a' is assigned to itself.", "'b' is assigned to itself."] },
        { code: "({a, b} = {b, a})", parserOptions: { ecmaVersion: 6 }, errors: ["'b' is assigned to itself.", "'a' is assigned to itself."] },
        { code: "({a, b} = {c, a})", parserOptions: { ecmaVersion: 6 }, errors: ["'a' is assigned to itself."] },
        { code: "({a: {b}, c: [d]} = {a: {b}, c: [d]})", parserOptions: { ecmaVersion: 6 }, errors: ["'b' is assigned to itself.", "'d' is assigned to itself."] },
        { code: "({a, b} = {a, ...x, b})", parserOptions: { ecmaVersion: 2018 }, errors: ["'b' is assigned to itself."] },
        {
            code: "a.b = a.b",
            errors: ["'a.b' is assigned to itself."]
        },
        {
            code: "a.b.c = a.b.c",
            errors: ["'a.b.c' is assigned to itself."]
        },
        {
            code: "a[b] = a[b]",
            errors: ["'a[b]' is assigned to itself."]
        },
        {
            code: "a['b'] = a['b']",
            errors: ["'a['b']' is assigned to itself."]
        },
        {
            code: "a[\n    'b'\n] = a[\n    'b'\n]",
            errors: ["'a['b']' is assigned to itself."]
        },
        { code: "a.b = a.b", options: [{ props: true }], errors: ["'a.b' is assigned to itself."] },
        { code: "a.b.c = a.b.c", options: [{ props: true }], errors: ["'a.b.c' is assigned to itself."] },
        { code: "a[b] = a[b]", options: [{ props: true }], errors: ["'a[b]' is assigned to itself."] },
        { code: "a['b'] = a['b']", options: [{ props: true }], errors: ["'a['b']' is assigned to itself."] },
        { code: "a[\n    'b'\n] = a[\n    'b'\n]", options: [{ props: true }], errors: ["'a['b']' is assigned to itself."] }
    ]
});
