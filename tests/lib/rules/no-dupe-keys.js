/**
 * @fileoverview Tests for no-dupe-keys rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-dupe-keys"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

ruleTester.run("no-dupe-keys", rule, {
    valid: [
        "var foo = { __proto__: 1, two: 2};",
        "var x = { foo: 1, bar: 2 };",
        "var x = { '': 1, bar: 2 };",
        "var x = { '': 1, ' ': 2 };",
        { code: "var x = { '': 1, [null]: 2 };", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = { '': 1, [a]: 2 };", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = { [a]: 1, [a]: 2 };", languageOptions: { ecmaVersion: 6 } },
        "+{ get a() { }, set a(b) { } };",
        { code: "var x = { a: b, [a]: b };", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = { a: b, ...c }", languageOptions: { ecmaVersion: 2018 } },
        { code: "var x = { get a() {}, set a (value) {} };", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = { a: 1, b: { a: 2 } };", languageOptions: { ecmaVersion: 6 } },
        { code: "var x = ({ null: 1, [/(?<zero>0)/]: 2 })", languageOptions: { ecmaVersion: 2018 } },
        { code: "var {a, a} = obj", languageOptions: { ecmaVersion: 6 } },
        "var x = { 012: 1, 12: 2 };",
        { code: "var x = { 1_0: 1, 1: 2 };", languageOptions: { ecmaVersion: 2021 } }
    ],
    invalid: [
        { code: "var x = { a: b, ['a']: b };", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", data: { name: "a" }, type: "ObjectExpression" }] },
        { code: "var x = { y: 1, y: 2 };", errors: [{ messageId: "unexpected", data: { name: "y" }, type: "ObjectExpression" }] },
        { code: "var x = { '': 1, '': 2 };", errors: [{ messageId: "unexpected", data: { name: "" }, type: "ObjectExpression" }] },
        { code: "var x = { '': 1, [``]: 2 };", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", data: { name: "" }, type: "ObjectExpression" }] },
        { code: "var foo = { 0x1: 1, 1: 2};", errors: [{ messageId: "unexpected", data: { name: "1" }, type: "ObjectExpression" }] },
        { code: "var x = { 012: 1, 10: 2 };", errors: [{ messageId: "unexpected", data: { name: "10" }, type: "ObjectExpression" }] },
        { code: "var x = { 0b1: 1, 1: 2 };", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", data: { name: "1" }, type: "ObjectExpression" }] },
        { code: "var x = { 0o1: 1, 1: 2 };", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", data: { name: "1" }, type: "ObjectExpression" }] },
        { code: "var x = { 1n: 1, 1: 2 };", languageOptions: { ecmaVersion: 2020 }, errors: [{ messageId: "unexpected", data: { name: "1" }, type: "ObjectExpression" }] },
        { code: "var x = { 1_0: 1, 10: 2 };", languageOptions: { ecmaVersion: 2021 }, errors: [{ messageId: "unexpected", data: { name: "10" }, type: "ObjectExpression" }] },
        { code: "var x = { \"z\": 1, z: 2 };", errors: [{ messageId: "unexpected", data: { name: "z" }, type: "ObjectExpression" }] },
        { code: "var foo = {\n  bar: 1,\n  bar: 1,\n}", errors: [{ messageId: "unexpected", data: { name: "bar" }, line: 3, column: 3 }] },
        { code: "var x = { a: 1, get a() {} };", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", data: { name: "a" }, type: "ObjectExpression" }] },
        { code: "var x = { a: 1, set a(value) {} };", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", data: { name: "a" }, type: "ObjectExpression" }] },
        { code: "var x = { a: 1, b: { a: 2 }, get b() {} };", languageOptions: { ecmaVersion: 6 }, errors: [{ messageId: "unexpected", data: { name: "b" }, type: "ObjectExpression" }] },
        { code: "var x = ({ '/(?<zero>0)/': 1, [/(?<zero>0)/]: 2 })", languageOptions: { ecmaVersion: 2018 }, errors: [{ messageId: "unexpected", data: { name: "/(?<zero>0)/" }, type: "ObjectExpression" }] }
    ]
});
