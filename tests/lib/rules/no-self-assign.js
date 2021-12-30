/**
 * @fileoverview Tests for no-self-assign rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-self-assign"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        "a &= a",
        "a |= a",
        { code: "let a = a", parserOptions: { ecmaVersion: 6 } },
        { code: "const a = a", parserOptions: { ecmaVersion: 6 } },
        { code: "[a] = a", parserOptions: { ecmaVersion: 6 } },
        { code: "[a = 1] = [a]", parserOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = [b, a]", parserOptions: { ecmaVersion: 6 } },
        { code: "[a,, b] = [, b, a]", parserOptions: { ecmaVersion: 6 } },
        { code: "[x, a] = [...x, a]", parserOptions: { ecmaVersion: 6 } },
        { code: "[...a] = [...a, 1]", parserOptions: { ecmaVersion: 6 } },
        { code: "[a, ...b] = [0, ...b, 1]", parserOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = {a, b}", parserOptions: { ecmaVersion: 6 } },
        { code: "({a} = a)", parserOptions: { ecmaVersion: 6 } },
        { code: "({a = 1} = {a})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a: b} = {a})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a} = {a: b})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a} = {a() {}})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a} = {[a]: a})", parserOptions: { ecmaVersion: 6 } },
        { code: "({[a]: b} = {[a]: b})", parserOptions: { ecmaVersion: 6 } },
        { code: "({'foo': a, 1: a} = {'bar': a, 2: a})", parserOptions: { ecmaVersion: 6 } },
        { code: "({a, ...b} = {a, ...b})", parserOptions: { ecmaVersion: 2018 } },
        { code: "a.b = a.c", options: [{ props: true }] },
        { code: "a.b = c.b", options: [{ props: true }] },
        { code: "a.b = a[b]", options: [{ props: true }] },
        { code: "a[b] = a.b", options: [{ props: true }] },
        { code: "a.b().c = a.b().c", options: [{ props: true }] },
        { code: "b().c = b().c", options: [{ props: true }] },
        { code: "a.null = a[/(?<zero>0)/]", options: [{ props: true }], parserOptions: { ecmaVersion: 2018 } },
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
        },
        {
            code: "this.x = this.y",
            options: [{ props: true }]
        },
        {
            code: "this.x = this.x",
            options: [{ props: false }]
        },
        {
            code: "class C { #field; foo() { this['#field'] = this.#field; } }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { #field; foo() { this.#field = this['#field']; } }",
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        { code: "a = a", errors: [{ messageId: "selfAssignment", data: { name: "a" } }] },
        { code: "[a] = [a]", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "a" } }] },
        { code: "[a, b] = [a, b]", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "a" } }, { messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "[a, b] = [a, c]", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "a" } }] },
        { code: "[a, b] = [, b]", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "[a, ...b] = [a, ...b]", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "a" } }, { messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "[[a], {b}] = [[a], {b}]", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "a" } }, { messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({a} = {a})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "a" } }] },
        { code: "({a: b} = {a: b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({'a': b} = {'a': b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({a: b} = {'a': b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({'a': b} = {a: b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({1: b} = {1: b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({1: b} = {'1': b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({'1': b} = {1: b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({['a']: b} = {a: b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({'a': b} = {[`a`]: b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({1: b} = {[1]: b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({a, b} = {a, b})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "a" } }, { messageId: "selfAssignment", data: { name: "b" } }] },
        { code: "({a, b} = {b, a})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }, { messageId: "selfAssignment", data: { name: "a" } }] },
        { code: "({a, b} = {c, a})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "a" } }] },
        { code: "({a: {b}, c: [d]} = {a: {b}, c: [d]})", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }, { messageId: "selfAssignment", data: { name: "d" } }] },
        { code: "({a, b} = {a, ...x, b})", parserOptions: { ecmaVersion: 2018 }, errors: [{ messageId: "selfAssignment", data: { name: "b" } }] },
        {
            code: "a.b = a.b",
            errors: [{ messageId: "selfAssignment", data: { name: "a.b" } }]
        },
        {
            code: "a.b.c = a.b.c",
            errors: [{ messageId: "selfAssignment", data: { name: "a.b.c" } }]
        },
        {
            code: "a[b] = a[b]",
            errors: [{ messageId: "selfAssignment", data: { name: "a[b]" } }]
        },
        {
            code: "a['b'] = a['b']",
            errors: [{ messageId: "selfAssignment", data: { name: "a['b']" } }]
        },
        {
            code: "a[\n    'b'\n] = a[\n    'b'\n]",
            errors: [{ messageId: "selfAssignment", data: { name: "a['b']" } }]
        },
        { code: "a.b = a.b", options: [{ props: true }], errors: [{ messageId: "selfAssignment", data: { name: "a.b" } }] },
        { code: "a.b.c = a.b.c", options: [{ props: true }], errors: [{ messageId: "selfAssignment", data: { name: "a.b.c" } }] },
        { code: "a[b] = a[b]", options: [{ props: true }], errors: [{ messageId: "selfAssignment", data: { name: "a[b]" } }] },
        { code: "a['b'] = a['b']", options: [{ props: true }], errors: [{ messageId: "selfAssignment", data: { name: "a['b']" } }] },
        { code: "a[\n    'b'\n] = a[\n    'b'\n]", options: [{ props: true }], errors: [{ messageId: "selfAssignment", data: { name: "a['b']" } }] },
        {
            code: "this.x = this.x",
            options: [{ props: true }],
            errors: [{ messageId: "selfAssignment", data: { name: "this.x" } }]
        },
        { code: "a['/(?<zero>0)/'] = a[/(?<zero>0)/]", options: [{ props: true }], parserOptions: { ecmaVersion: 2018 }, errors: [{ messageId: "selfAssignment", data: { name: "a[/(?<zero>0)/]" } }] },

        // Optional chaining
        {
            code: "(a?.b).c = (a?.b).c",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "selfAssignment", data: { name: "(a?.b).c" } }]
        },
        {
            code: "a.b = a?.b",
            parserOptions: { ecmaVersion: 2020 },
            errors: [{ messageId: "selfAssignment", data: { name: "a?.b" } }]
        },

        // Private members
        {
            code: "class C { #field; foo() { this.#field = this.#field; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "selfAssignment", data: { name: "this.#field" } }]
        },
        {
            code: "class C { #field; foo() { [this.#field] = [this.#field]; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "selfAssignment", data: { name: "this.#field" } }]
        },

        // logical assignment
        {
            code: "a &&= a",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "selfAssignment", data: { name: "a" } }]
        },
        {
            code: "a ||= a",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "selfAssignment", data: { name: "a" } }]
        },
        {
            code: "a ??= a",
            parserOptions: { ecmaVersion: 2021 },
            errors: [{ messageId: "selfAssignment", data: { name: "a" } }]
        }
    ]
});
