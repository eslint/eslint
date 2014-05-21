/**
 * @fileoverview Tests for new-cap rule.
 * @author Nicholas C. Zakas
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
eslintTester.addRuleTest("lib/rules/new-cap", {
    valid: [
        "var x = new Constructor();",
        "var x = new a.b.Constructor();",
        "var x = new function(){};",
        "var x = new _;",
        "var x = new $;",
        "var x = new Σ;",
        "var x = new _x;",
        "var x = new $x;",
        "var x = new this;"
    ],
    invalid: [
        { code: "var x = new c();", errors: [{ message: "A constructor name should start with an uppercase letter.", type: "NewExpression"}] },
        { code: "var x = new φ;", errors: [{ message: "A constructor name should start with an uppercase letter.", type: "NewExpression"}] },
        { code: "var x = new a.b.c;", errors: [{ message: "A constructor name should start with an uppercase letter.", type: "NewExpression"}] }
    ]
});
