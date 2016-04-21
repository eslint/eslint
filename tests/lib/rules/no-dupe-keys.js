/**
 * @fileoverview Tests for no-dupe-keys rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-dupe-keys"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("no-dupe-keys", rule, {
    valid: [
        "var foo = { __proto__: 1, two: 2};",
        "var x = { foo: 1, bar: 2 };",
        "+{ get a() { }, set a(b) { } };",
        { code: "var x = { a: b, [a]: b };", parserOptions: { ecmaVersion: 6 }},
        { code: "var x = { a: b, ...c }", parserOptions: { ecmaVersion: 6, ecmaFeatures: { experimentalObjectRestSpread: true } }}
    ],
    invalid: [
        { code: "var x = { a: b, ['a']: b };", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Duplicate key 'a'.", type: "ObjectExpression"}] },
        { code: "var x = { y: 1, y: 2 };", errors: [{ message: "Duplicate key 'y'.", type: "ObjectExpression"}] },
        { code: "var foo = { 0x1: 1, 1: 2};", errors: [{ message: "Duplicate key '1'.", type: "ObjectExpression"}] },
        { code: "var x = { \"z\": 1, z: 2 };", errors: [{ message: "Duplicate key 'z'.", type: "ObjectExpression"}] },
        { code: "var foo = {\n  bar: 1,\n  bar: 1,\n}", errors: [{ message: "Duplicate key 'bar'.", line: 3, column: 3}]}
    ]
});
