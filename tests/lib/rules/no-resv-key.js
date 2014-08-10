/**
 * @fileoverview Tests for no-resv-key rule.
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
eslintTester.addRuleTest("lib/rules/no-resv-key", {
    valid: [
        "var foo = { type: 1};",
        "var x = { foo: 1, bar: 2 };",
        "+{ get a() { }, set a(b) { } };",

        "var obj = {}; obj['type'] = 1;",
        "var obj = {}; obj[this] = 1;"
    ],
    invalid: [
        { code: "var x = { default: 1 };", errors: [{ message: "Reserved word 'default' used as key.", type: "ObjectExpression"}] },
        { code: "var foo = { if: 1, do: 2};", errors: [
            { message: "Reserved word 'if' used as key.", type: "ObjectExpression"},
            { message: "Reserved word 'do' used as key.", type: "ObjectExpression"}
        ] },
        { code: "var x = { \"while\": 1};", errors: [{ message: "Reserved word 'while' used as key.", type: "ObjectExpression"}] },

        { code: "var obj = {}; obj['default'] = 1;", errors: [{ message: "Reserved word 'default' used as key.", type: "MemberExpression"}] }
    ]
});
