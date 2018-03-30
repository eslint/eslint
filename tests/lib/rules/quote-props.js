/**
 * @fileoverview Tests for quote-props rule.
 * @author Mathias Bynens <http://mathiasbynens.be/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/quote-props"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
        { code: "({ ...x })", options: ["consistent-as-needed"], parserOptions: { ecmaVersion: 2018 } }
    ],
    invalid: [{
        code: "({ a: 0 })",
        output: "({ \"a\": 0 })",
        errors: [{
            message: "Unquoted property 'a' found.", type: "Property"
        }]
    }, {
        code: "({ 0: '0' })",
        output: "({ \"0\": '0' })",
        errors: [{
            message: "Unquoted property '0' found.", type: "Property"
        }]
    }, {
        code: "({ 'a': 0 })",
        output: "({ a: 0 })",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property 'a' found.", type: "Property"
        }]
    }, {
        code: "({ 'null': 0 })",
        output: "({ null: 0 })",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property 'null' found.", type: "Property"
        }]
    }, {
        code: "({ 'true': 0 })",
        output: "({ true: 0 })",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property 'true' found.", type: "Property"
        }]
    }, {
        code: "({ '0': 0 })",
        output: "({ 0: 0 })",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property '0' found.", type: "Property"
        }]
    }, {
        code: "({ '-a': 0, b: 0 })",
        output: "({ '-a': 0, \"b\": 0 })",
        options: ["consistent"],
        errors: [{
            message: "Inconsistently quoted property 'b' found.", type: "Property"
        }]
    }, {
        code: "({ a: 0, 'b': 0 })",
        output: "({ \"a\": 0, 'b': 0 })",
        options: ["consistent"],
        errors: [{
            message: "Inconsistently quoted property 'a' found.", type: "Property"
        }]
    }, {
        code: "({ '-a': 0, b: 0 })",
        output: "({ '-a': 0, \"b\": 0 })",
        options: ["consistent-as-needed"],
        errors: [{
            message: "Inconsistently quoted property 'b' found.", type: "Property"
        }]
    }, {
        code: "({ 'a': 0, 'b': 0 })",
        output: "({ a: 0, b: 0 })",
        options: ["consistent-as-needed"],
        errors: [
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" },
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" }
        ]
    }, {
        code: "({ 'a': 0, [x]: 0 })",
        output: "({ a: 0, [x]: 0 })",
        options: ["consistent-as-needed"],
        errors: [
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" }
        ],
        env: { es6: true }
    }, {
        code: "({ 'a': 0, x })",
        output: "({ a: 0, x })",
        options: ["consistent-as-needed"],
        errors: [{
            message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property"
        }],
        env: { es6: true }
    }, {
        code: "({ 'true': 0, 'null': 0 })",
        output: "({ true: 0, null: 0 })",
        options: ["consistent-as-needed"],
        errors: [
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" },
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" }
        ]
    }, {
        code: "({ true: 0, 'null': 0 })",
        output: "({ \"true\": 0, 'null': 0 })",
        options: ["consistent"],
        errors: [{
            message: "Inconsistently quoted property 'true' found.", type: "Property"
        }]
    }, {
        code: "({ 'a': 0, 'b': 0 })",
        output: "({ a: 0, b: 0 })",
        options: ["consistent-as-needed", { keywords: true }],
        errors: [
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" },
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" }
        ]
    }, {
        code: "({ while: 0, b: 0 })",
        output: "({ \"while\": 0, \"b\": 0 })",
        options: ["consistent-as-needed", { keywords: true }],
        errors: [
            { message: "Properties should be quoted as 'while' is a reserved word.", type: "Property" },
            { message: "Properties should be quoted as 'while' is a reserved word.", type: "Property" }
        ]
    }, {
        code: "({ while: 0, 'b': 0 })",
        output: "({ \"while\": 0, 'b': 0 })",
        options: ["consistent-as-needed", { keywords: true }],
        errors: [{
            message: "Properties should be quoted as 'while' is a reserved word.", type: "Property"
        }]
    }, {
        code: "({ foo: 0, 'bar': 0 })",
        output: "({ foo: 0, bar: 0 })",
        options: ["consistent-as-needed", { keywords: true }],
        errors: [
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" }
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
            message: "Inconsistently quoted property 'prop2' found.", type: "Property"
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
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" },
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" },
            { message: "Properties shouldn't be quoted as all quotes are redundant.", type: "Property" }
        ]
    }, {
        code: "({'if': 0})",
        output: "({if: 0})",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property 'if' found.", type: "Property"
        }]
    }, {
        code: "({'synchronized': 0})",
        output: "({synchronized: 0})",
        options: ["as-needed"],
        errors: [{
            message: "Unnecessarily quoted property 'synchronized' found.", type: "Property"
        }]
    }, {
        code: "({while: 0})",
        output: "({\"while\": 0})",
        options: ["as-needed", { keywords: true }],
        errors: [{
            message: "Unquoted reserved word 'while' used as key.", type: "Property"
        }]
    }, {
        code: "({'unnecessary': 1, if: 0})",
        output: "({'unnecessary': 1, \"if\": 0})",
        options: ["as-needed", { keywords: true, unnecessary: false }],
        errors: [{
            message: "Unquoted reserved word 'if' used as key.", type: "Property"
        }]
    }, {
        code: "({1: 1})",
        output: "({\"1\": 1})",
        options: ["as-needed", { numbers: true }],
        errors: [{
            message: "Unquoted number literal '1' used as key.", type: "Property"
        }]
    }, {
        code: "({1: 1})",
        output: "({\"1\": 1})",
        options: ["always", { numbers: false }],
        errors: [{
            message: "Unquoted property '1' found.", type: "Property"
        }]
    }, {
        code: "({0x123: 1})",
        output: "({\"291\": 1})", // 0x123 === 291
        options: ["always"],
        errors: [{
            message: "Unquoted property '291' found."
        }]
    }, {
        code: "({1e2: 1})",
        output: "({\"100\": 1})",
        options: ["always", { numbers: false }],
        errors: [{
            message: "Unquoted property '100' found."
        }]
    }, {
        code: "({5.: 1})",
        output: "({\"5\": 1})",
        options: ["always", { numbers: false }],
        errors: [{
            message: "Unquoted property '5' found."
        }]
    }]
});
