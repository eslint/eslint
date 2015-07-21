/**
 * @fileoverview Tests for no-dupe-keys rule.
 * @author Ian Christian Myers
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 * @copyright 2013 Nicholas C. Zakas. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-dupe-keys", {
    valid: [
        "var foo = { __proto__: 1, two: 2};",
        "var x = { foo: 1, bar: 2 };",
        "+{ get a() { }, set a(b) { } };",
        { code: "var x = { a: b, [a]: b };", ecmaFeatures: { objectLiteralComputedProperties: true }},
        { code: "var x = { a: b, ...c }", ecmaFeatures: {experimentalObjectRestSpread: true }}
    ],
    invalid: [
        { code: "var x = { a: b, ['a']: b };", ecmaFeatures: { objectLiteralComputedProperties: true }, errors: [{ message: "Duplicate key 'a'.", type: "ObjectExpression"}] },
        { code: "var x = { y: 1, y: 2 };", errors: [{ message: "Duplicate key 'y'.", type: "ObjectExpression"}] },
        { code: "var foo = { 0x1: 1, 1: 2};", errors: [{ message: "Duplicate key '1'.", type: "ObjectExpression"}] },
        { code: "var x = { \"z\": 1, z: 2 };", errors: [{ message: "Duplicate key 'z'.", type: "ObjectExpression"}] }
    ]
});
