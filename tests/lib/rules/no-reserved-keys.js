/**
 * @fileoverview Tests for no-reserved-keys rule.
 * @author Emil Bay
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-reserved-keys", {
    valid: [
        "var foo = { type: 1};",
        "var x = { foo: 1, bar: 2 };",
        "+{ get a() { }, set a(b) { } };"
    ],
    invalid: [
        { code: "var x = { default: 1 };", errors: [{ message: "Reserved word 'default' used as property name.", type: "ObjectExpression"}] },
        { code: "var foo = { if: 1, do: 2};", errors: [
            { message: "Reserved word 'if' used as property name.", type: "ObjectExpression"},
            { message: "Reserved word 'do' used as property name.", type: "ObjectExpression"}
        ] },
        { code: "var x = { \"while\": 1};", errors: [{ message: "Reserved word 'while' used as property name.", type: "ObjectExpression"}] }
    ]
});
