/**
 * @fileoverview Tests for quote-props rule.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/quote-props"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("quote-props", rule, {
    valid: [
        "({ '0': 0 })",
        "({ 'a': 0 })",
        "({ \"a\": 0 })",
        "({ 'null': 0 })",
        "({ 'true': 0 })",
        "({ 'a-b': 0 })",
        "({ 'if': 0 })",
        "({ '@': 0 })",

        { code: "({ 'a': 0, b(){} })", parserOptions: { ecmaVersion: 6 } },
        { code: "({ [x]: 0 });", env: { es6: true } },
        { code: "({ x });", env: { es6: true } },
        { code: "({ a: 0, b(){} })", options: ["as-needed"], parserOptions: { ecmaVersion: 6 } },
        { code: "({ a: 0, [x]: 1 })", options: ["as-needed"], env: { es6: true } },
        { code: "({ a: 0, x })", options: ["as-needed"], env: { es6: true } },
        { code: "({ '@': 0, [x]: 1 })", options: ["as-needed"], env: { es6: true } },
        { code: "({ '@': 0, x })", options: ["as-needed"], env: { es6: true } },
        { code: "({ a: 0, b: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, 0: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, true: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, null: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, if: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, while: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, volatile: 0 })", options: ["as-needed"] },
        { code: "({ a: 0, '-b': 0 })", options: ["as-needed"] },
        { code: "({ a: 0, '@': 0 })", options: ["as-needed"] },
        { code: "({ a: 0, '0x0': 0 })", options: ["as-needed"] },
        { code: "({ ' 0': 0, '0x0': 0 })", options: ["as-needed"] },
        { code: "({ '0 ': 0 })", options: ["as-needed"] },
        { code: "({ 'hey//meh': 0 })", options: ["as-needed"] },
        { code: "({ 'hey/*meh': 0 })", options: ["as-needed"] },
        { code: "({ 'hey/*meh*/': 0 })", options: ["as-needed"] },
        { code: "({ 'a': 0, '-b': 0 })", options: ["consistent"] },
        { code: "({ 'true': 0, 'b': 0 })", options: ["consistent"] },
        { code: "({ null: 0, a: 0 })", options: ["consistent"] },
        { code: "({ a: 0, b: 0 })", options: ["consistent"] },
        { code: "({ 'a': 1, [x]: 0 });", options: ["consistent"], env: { es6: true } },
        { code: "({ 'a': 1, x });", options: ["consistent"], env: { es6: true } },
        { code: "({ a: 0, b: 0 })", options: ["consistent-as-needed"] },
        { code: "({ a: 0, null: 0 })", options: ["consistent-as-needed"] },
        { code: "({ 'a': 0, '-b': 0 })", options: ["consistent-as-needed"] },
        { code: "({ '@': 0, 'B': 0 })", options: ["consistent-as-needed"] },
        { code: "({ 'while': 0, 'B': 0 })", options: ["consistent-as-needed", { keywords: true }] },
        { code: "({ '@': 0, 'B': 0 })", options: ["consistent-as-needed", { keywords: true }] },
        { code: "({ '@': 1, [x]: 0 });", options: ["consistent-as-needed"], env: { es6: true } },
        { code: "({ '@': 1, x });", options: ["consistent-as-needed"], env: { es6: true } },
        { code: "({ a: 1, [x]: 0 });", options: ["consistent-as-needed"], env: { es6: true } },
        { code: "({ a: 1, x });", options: ["consistent-as-needed"], env: { es6: true } },
        { code: "({ a: 0, 'if': 0 })", options: ["as-needed", { keywords: true }] },
        { code: "({ a: 0, 'while': 0 })", options: ["as-needed", { keywords: true }] },
        { code: "({ a: 0, 'volatile': 0 })", options: ["as-needed", { keywords: true }] },
        { code: "({'unnecessary': 1, 'if': 0})", options: ["as-needed", { keywords: true, unnecessary: false }] },
        { code: "({'1': 1})", options: ["as-needed", { numbers: true }] },
        { code: "({1: 1, x: 2})", options: ["consistent", { numbers: true }] },
        { code: "({1: 1, x: 2})", options: ["consistent-as-needed", { numbers: true }] },
        { code: "({ ...x })", options: ["as-needed"], parserOptions: { ecmaVersion: 2018 } },
        { code: "({ ...x })", options: ["consistent"], parserOptions: { ecmaVersion: 2018 } },
        { code: "({ ...x })", options: ["consistent-as-needed"], parserOptions: { ecmaVersion: 2018 } },
        { code: "({ 1n: 1 })", options: ["as-needed"], parserOptions: { ecmaVersion: 2020 } },
        { code: "({ 1n: 1 })", options: ["as-needed", { numbers: false }], parserOptions: { ecmaVersion: 2020 } },
        { code: "({ 1n: 1 })", options: ["consistent"], parserOptions: { ecmaVersion: 2020 } },
        { code: "({ 1n: 1 })", options: ["consistent-as-needed"], parserOptions: { ecmaVersion: 2020 } },
        { code: "({ '99999999999999999': 1 })", options: ["as-needed"], parserOptions: { ecmaVersion: 2020 } },
        { code: "({ '1n': 1 })", options: ["as-needed"], parserOptions: { ecmaVersion: 2020 } },
        { code: "({ 1_0: 1 })", options: ["as-needed"], parserOptions: { ecmaVersion: 2021 } },
        { code: "({ 1_0: 1 })", options: ["as-needed", { numbers: false }], parserOptions: { ecmaVersion: 2021 } },
        { code: "({ '1_0': 1 })", options: ["as-needed"], parserOptions: { ecmaVersion: 2021 } },
        { code: "({ '1_0': 1 })", options: ["as-needed", { numbers: false }], parserOptions: { ecmaVersion: 2021 } },
        { code: "({ '1_0': 1 })", options: ["as-needed", { numbers: true }], parserOptions: { ecmaVersion: 2021 } },
        { code: "({ 1_0: 1, 1: 1 })", options: ["consistent-as-needed"], parserOptions: { ecmaVersion: 2021 } }
    ],
    invalid: [{
        code: "({ a: 0 })",
        output: "({ \"a\": 0 })",
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "a" },
            type: "Property"
        }]
    }, {
        code: "({ 0: '0' })",
        output: "({ \"0\": '0' })",
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "0" },
            type: "Property"
        }]
    }, {
        code: "({ 'a': 0 })",
        output: "({ a: 0 })",
        options: ["as-needed"],
        errors: [{
            messageId: "unnecessarilyQuotedProperty",
            data: { property: "a" },
            type: "Property"
        }]
    }, {
        code: "({ 'null': 0 })",
        output: "({ null: 0 })",
        options: ["as-needed"],
        errors: [{
            messageId: "unnecessarilyQuotedProperty",
            data: { property: "null" },
            type: "Property"
        }]
    }, {
        code: "({ 'true': 0 })",
        output: "({ true: 0 })",
        options: ["as-needed"],
        errors: [{
            messageId: "unnecessarilyQuotedProperty",
            data: { property: "true" },
            type: "Property"
        }]
    }, {
        code: "({ '0': 0 })",
        output: "({ 0: 0 })",
        options: ["as-needed"],
        errors: [{
            messageId: "unnecessarilyQuotedProperty",
            data: { property: "0" },
            type: "Property"
        }]
    }, {
        code: "({ '-a': 0, b: 0 })",
        output: "({ '-a': 0, \"b\": 0 })",
        options: ["consistent"],
        errors: [{
            messageId: "inconsistentlyQuotedProperty",
            data: { key: "b" },
            type: "Property"
        }]
    }, {
        code: "({ a: 0, 'b': 0 })",
        output: "({ \"a\": 0, 'b': 0 })",
        options: ["consistent"],
        errors: [{
            messageId: "inconsistentlyQuotedProperty",
            data: { key: "a" },
            type: "Property"
        }]
    }, {
        code: "({ '-a': 0, b: 0 })",
        output: "({ '-a': 0, \"b\": 0 })",
        options: ["consistent-as-needed"],
        errors: [{
            messageId: "inconsistentlyQuotedProperty",
            data: { key: "b" },
            type: "Property"
        }]
    }, {
        code: "({ 'a': 0, 'b': 0 })",
        output: "({ a: 0, b: 0 })",
        options: ["consistent-as-needed"],
        errors: [
            { messageId: "redundantQuoting", type: "Property" },
            { messageId: "redundantQuoting", type: "Property" }
        ]
    }, {
        code: "({ 'a': 0, [x]: 0 })",
        output: "({ a: 0, [x]: 0 })",
        options: ["consistent-as-needed"],
        env: { es6: true },
        errors: [
            { messageId: "redundantQuoting", type: "Property" }
        ]
    }, {
        code: "({ 'a': 0, x })",
        output: "({ a: 0, x })",
        options: ["consistent-as-needed"],
        env: { es6: true },
        errors: [{
            messageId: "redundantQuoting", type: "Property"
        }]
    }, {
        code: "({ 'true': 0, 'null': 0 })",
        output: "({ true: 0, null: 0 })",
        options: ["consistent-as-needed"],
        errors: [
            { messageId: "redundantQuoting", type: "Property" },
            { messageId: "redundantQuoting", type: "Property" }
        ]
    }, {
        code: "({ true: 0, 'null': 0 })",
        output: "({ \"true\": 0, 'null': 0 })",
        options: ["consistent"],
        errors: [{
            messageId: "inconsistentlyQuotedProperty",
            data: { key: "true" },
            type: "Property"
        }]
    }, {
        code: "({ 'a': 0, 'b': 0 })",
        output: "({ a: 0, b: 0 })",
        options: ["consistent-as-needed", { keywords: true }],
        errors: [
            { messageId: "redundantQuoting", type: "Property" },
            { messageId: "redundantQuoting", type: "Property" }
        ]
    }, {
        code: "({ while: 0, b: 0 })",
        output: "({ \"while\": 0, \"b\": 0 })",
        options: ["consistent-as-needed", { keywords: true }],
        errors: [
            {
                messageId: "requireQuotesDueToReservedWord",
                data: { property: "while" },
                type: "Property"
            },
            {
                messageId: "requireQuotesDueToReservedWord",
                data: { property: "while" },
                type: "Property"
            }
        ]
    }, {
        code: "({ while: 0, 'b': 0 })",
        output: "({ \"while\": 0, 'b': 0 })",
        options: ["consistent-as-needed", { keywords: true }],
        errors: [{
            messageId: "requireQuotesDueToReservedWord",
            data: { property: "while" },
            type: "Property"

        }]
    }, {
        code: "({ foo: 0, 'bar': 0 })",
        output: "({ foo: 0, bar: 0 })",
        options: ["consistent-as-needed", { keywords: true }],
        errors: [
            { messageId: "redundantQuoting", type: "Property" }
        ]
    }, {
        code:
        "({\n" +
        "  /* a */ 'prop1' /* b */ : /* c */ value1 /* d */ ,\n" +
        "  /* e */ prop2 /* f */ : /* g */ value2 /* h */,\n" +
        "  /* i */ \"prop3\" /* j */ : /* k */ value3 /* l */\n" +
        "})",
        output:
        "({\n" +
        "  /* a */ 'prop1' /* b */ : /* c */ value1 /* d */ ,\n" +
        "  /* e */ \"prop2\" /* f */ : /* g */ value2 /* h */,\n" +
        "  /* i */ \"prop3\" /* j */ : /* k */ value3 /* l */\n" +
        "})",
        options: ["consistent"],
        errors: [{
            messageId: "inconsistentlyQuotedProperty",
            data: { key: "prop2" },
            type: "Property"
        }]
    }, {
        code:
        "({\n" +
        "  /* a */ \"foo\" /* b */ : /* c */ value1 /* d */ ,\n" +
        "  /* e */ \"bar\" /* f */ : /* g */ value2 /* h */,\n" +
        "  /* i */ \"baz\" /* j */ : /* k */ value3 /* l */\n" +
        "})",
        output:
        "({\n" +
        "  /* a */ foo /* b */ : /* c */ value1 /* d */ ,\n" +
        "  /* e */ bar /* f */ : /* g */ value2 /* h */,\n" +
        "  /* i */ baz /* j */ : /* k */ value3 /* l */\n" +
        "})",
        options: ["consistent-as-needed"],
        errors: [
            { messageId: "redundantQuoting", type: "Property" },
            { messageId: "redundantQuoting", type: "Property" },
            { messageId: "redundantQuoting", type: "Property" }
        ]
    }, {
        code: "({'if': 0})",
        output: "({if: 0})",
        options: ["as-needed"],
        errors: [{
            messageId: "unnecessarilyQuotedProperty",
            data: { property: "if" },
            type: "Property"
        }]
    }, {
        code: "({'synchronized': 0})",
        output: "({synchronized: 0})",
        options: ["as-needed"],
        errors: [{
            messageId: "unnecessarilyQuotedProperty",
            data: { property: "synchronized" },
            type: "Property"
        }]
    }, {
        code: "({while: 0})",
        output: "({\"while\": 0})",
        options: ["as-needed", { keywords: true }],
        errors: [{
            messageId: "unquotedReservedProperty",
            data: { property: "while" },
            type: "Property"
        }]
    }, {
        code: "({'unnecessary': 1, if: 0})",
        output: "({'unnecessary': 1, \"if\": 0})",
        options: ["as-needed", { keywords: true, unnecessary: false }],
        errors: [{
            messageId: "unquotedReservedProperty",
            data: { property: "if" },
            type: "Property"
        }]
    }, {
        code: "({1: 1})",
        output: "({\"1\": 1})",
        options: ["as-needed", { numbers: true }],
        errors: [{
            messageId: "unquotedNumericProperty",
            data: { property: "1" },
            type: "Property"
        }]
    }, {
        code: "({1: 1})",
        output: "({\"1\": 1})",
        options: ["always", { numbers: false }],
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "1" },
            type: "Property"
        }]
    }, {
        code: "({0x123: 1})",
        output: "({\"291\": 1})", // 0x123 === 291
        options: ["always"],
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "291" }

        }]
    }, {
        code: "({1e2: 1})",
        output: "({\"100\": 1})",
        options: ["always", { numbers: false }],
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "100" }

        }]
    }, {
        code: "({5.: 1})",
        output: "({\"5\": 1})",
        options: ["always", { numbers: false }],
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "5" }

        }]
    }, {
        code: "({ 1n: 1 })",
        output: "({ \"1\": 1 })",
        options: ["always"],
        parserOptions: { ecmaVersion: 2020 },
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "1" }
        }
        ]
    }, {
        code: "({ 1n: 1 })",
        output: "({ \"1\": 1 })",
        options: ["as-needed", { numbers: true }],
        parserOptions: { ecmaVersion: 2020 },
        errors: [{
            messageId: "unquotedNumericProperty",
            data: { property: "1" }
        }]
    }, {
        code: "({ 1_0: 1 })",
        output: "({ \"10\": 1 })",
        options: ["as-needed", { numbers: true }],
        parserOptions: { ecmaVersion: 2021 },
        errors: [{
            messageId: "unquotedNumericProperty",
            data: { property: "10" }
        }]
    }, {
        code: "({ 1_2.3_4e0_2: 1 })",
        output: "({ \"1234\": 1 })",
        options: ["always"],
        parserOptions: { ecmaVersion: 2021 },
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "1234" }
        }]
    }, {
        code: "({ 0b1_000: 1 })",
        output: "({ \"8\": 1 })",
        options: ["always"],
        parserOptions: { ecmaVersion: 2021 },
        errors: [{
            messageId: "unquotedPropertyFound",
            data: { property: "8" }
        }]
    }, {
        code: "({ 1_000: a, '1_000': b })",
        output: "({ \"1000\": a, '1_000': b })",
        options: ["consistent-as-needed"],
        parserOptions: { ecmaVersion: 2021 },
        errors: [{
            messageId: "inconsistentlyQuotedProperty",
            data: { key: "1000" }
        }]
    }]
});
