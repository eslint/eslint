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
        "var x = new a.b['Constructor']();",
        "var x = new a.b[Constructor]();",
        "var x = new a.b[constructor]();",
        "var x = new function(){};",
        "var x = new _;",
        "var x = new $;",
        "var x = new Σ;",
        "var x = new _x;",
        "var x = new $x;",
        "var x = new this;",
        "var x = Number(42)",
        "var x = String(42)",
        "var x = Boolean(42)",
        "var x = Date(42)",
        "var x = Array(42)",
        "var x = String(42)",
        "var x = RegExp(42)",
        "var x = _();",
        "var x = $();",
        {code: "var x = Foo(42)", args: [1, {"capIsNew": false}]},
        {code: "var x = bar.Foo(42)", args: [1, {"capIsNew": false}]},
        "var x = bar[Foo](42)",
        {code: "var x = bar['Foo'](42)", args: [1, {"capIsNew": false}]},
        "var x = Foo.bar(42)",
        {code: "var x = new foo(42)", args: [1, {"newIsCap": false}]},
        "var o = { 1: function () {} }; o[1]();",
        "var o = { 1: function () {} }; new o[1]();"
    ],
    invalid: [
        { code: "var x = new c();", errors: [{ message: "A constructor name should not start with a lowercase letter.", type: "NewExpression"}] },
        { code: "var x = new φ;", errors: [{ message: "A constructor name should not start with a lowercase letter.", type: "NewExpression"}] },
        { code: "var x = new a.b.c;", errors: [{ message: "A constructor name should not start with a lowercase letter.", type: "NewExpression"}] },
        { code: "var x = new a.b['c'];", errors: [{ message: "A constructor name should not start with a lowercase letter.", type: "NewExpression"}] },
        { code: "var b = Foo();", errors: [{ message: "A function with a name starting with an uppercase letter should only be used as a constructor.", type: "CallExpression"}] },
        { code: "var b = a.Foo();", errors: [{ message: "A function with a name starting with an uppercase letter should only be used as a constructor.", type: "CallExpression"}] },
        { code: "var b = a['Foo']();", errors: [{ message: "A function with a name starting with an uppercase letter should only be used as a constructor.", type: "CallExpression"}] }
    ]
});
