/**
 * @fileoverview Tests for no-self-assign rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-self-assign"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

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
        { code: "let a = a", languageOptions: { ecmaVersion: 6 } },
        { code: "const a = a", languageOptions: { ecmaVersion: 6 } },
        { code: "[a] = a", languageOptions: { ecmaVersion: 6 } },
        { code: "[a = 1] = [a]", languageOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = [b, a]", languageOptions: { ecmaVersion: 6 } },
        { code: "[a,, b] = [, b, a]", languageOptions: { ecmaVersion: 6 } },
        { code: "[x, a] = [...x, a]", languageOptions: { ecmaVersion: 6 } },
        { code: "[...a] = [...a, 1]", languageOptions: { ecmaVersion: 6 } },
        { code: "[a, ...b] = [0, ...b, 1]", languageOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = {a, b}", languageOptions: { ecmaVersion: 6 } },
        { code: "({a} = a)", languageOptions: { ecmaVersion: 6 } },
        { code: "({a = 1} = {a})", languageOptions: { ecmaVersion: 6 } },
        { code: "({a: b} = {a})", languageOptions: { ecmaVersion: 6 } },
        { code: "({a} = {a: b})", languageOptions: { ecmaVersion: 6 } },
        { code: "({a} = {a() {}})", languageOptions: { ecmaVersion: 6 } },
        { code: "({a} = {[a]: a})", languageOptions: { ecmaVersion: 6 } },
        { code: "({[a]: b} = {[a]: b})", languageOptions: { ecmaVersion: 6 } },
        { code: "({'foo': a, 1: a} = {'bar': a, 2: a})", languageOptions: { ecmaVersion: 6 } },
        { code: "({a, ...b} = {a, ...b})", languageOptions: { ecmaVersion: 2018 } },
        { code: "a.b = a.c", options: [{ props: true }] },
        { code: "a.b = c.b", options: [{ props: true }] },
        { code: "a.b = a[b]", options: [{ props: true }] },
        { code: "a[b] = a.b", options: [{ props: true }] },
        { code: "a.b().c = a.b().c", options: [{ props: true }] },
        { code: "b().c = b().c", options: [{ props: true }] },
        { code: "a.null = a[/(?<zero>0)/]", options: [{ props: true }], languageOptions: { ecmaVersion: 2018 } },
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
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { #field; foo() { this.#field = this['#field']; } }",
            languageOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        { code: "a = a", errors: [{ messageId: "selfAssignment", data: { name: "a" } }] },
        { code: "[a] = [a]", errors: [{ messageId: "selfAssignment", data: { name: "a" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = [a, b]", errors: [{ messageId: "selfAssignment", data: { name: "a" } }, { messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = [a, c]", errors: [{ messageId: "selfAssignment", data: { name: "a" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "[a, b] = [, b]", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "[a, ...b] = [a, ...b]", errors: [{ messageId: "selfAssignment", data: { name: "a" } }, { messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "[[a], {b}] = [[a], {b}]", errors: [{ messageId: "selfAssignment", data: { name: "a" } }, { messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({a} = {a})", errors: [{ messageId: "selfAssignment", data: { name: "a" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({a: b} = {a: b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({'a': b} = {'a': b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({a: b} = {'a': b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({'a': b} = {a: b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({1: b} = {1: b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({1: b} = {'1': b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({'1': b} = {1: b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({['a']: b} = {a: b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({'a': b} = {[`a`]: b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({1: b} = {[1]: b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({a, b} = {a, b})", errors: [{ messageId: "selfAssignment", data: { name: "a" } }, { messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({a, b} = {b, a})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }, { messageId: "selfAssignment", data: { name: "a" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({a, b} = {c, a})", errors: [{ messageId: "selfAssignment", data: { name: "a" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({a: {b}, c: [d]} = {a: {b}, c: [d]})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }, { messageId: "selfAssignment", data: { name: "d" } }], languageOptions: { ecmaVersion: 6 } },
        { code: "({a, b} = {a, ...x, b})", errors: [{ messageId: "selfAssignment", data: { name: "b" } }], languageOptions: { ecmaVersion: 2018 } },
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
        { code: "a['/(?<zero>0)/'] = a[/(?<zero>0)/]", options: [{ props: true }], errors: [{ messageId: "selfAssignment", data: { name: "a[/(?<zero>0)/]" } }], languageOptions: { ecmaVersion: 2018 } },

        // Optional chaining
        {
            code: "(a?.b).c = (a?.b).c",
            errors: [{ messageId: "selfAssignment", data: { name: "(a?.b).c" } }],
            languageOptions: { ecmaVersion: 2020 }
        },
        {
            code: "a.b = a?.b",
            errors: [{ messageId: "selfAssignment", data: { name: "a?.b" } }],
            languageOptions: { ecmaVersion: 2020 }
        },

        // Private members
        {
            code: "class C { #field; foo() { this.#field = this.#field; } }",
            errors: [{ messageId: "selfAssignment", data: { name: "this.#field" } }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { #field; foo() { [this.#field] = [this.#field]; } }",
            errors: [{ messageId: "selfAssignment", data: { name: "this.#field" } }],
            languageOptions: { ecmaVersion: 2022 }
        },

        // logical assignment
        {
            code: "a &&= a",
            errors: [{ messageId: "selfAssignment", data: { name: "a" } }],
            languageOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a ||= a",
            errors: [{ messageId: "selfAssignment", data: { name: "a" } }],
            languageOptions: { ecmaVersion: 2021 }
        },
        {
            code: "a ??= a",
            errors: [{ messageId: "selfAssignment", data: { name: "a" } }],
            languageOptions: { ecmaVersion: 2021 }
        }
    ]
});
