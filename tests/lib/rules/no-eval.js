/**
 * @fileoverview Tests for no-eval rule.
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
eslintTester.addRuleTest("lib/rules/no-eval", {
    valid: [
        "Eval(foo)",
        "foo.setTimeout('hi')",
        "setTimeout(foo, 10)",
        "setTimeout(function() {}, 10)",
        "foo.setInterval('hi')",
        "setInterval(foo, 10)",
        "setInterval(function() {}, 10)"
    ],
    invalid: [
        { code: "eval(foo)", errors: [{ message: "eval can be harmful.", type: "CallExpression"}] },
        { code: "setTimeout('foo')", errors: [{ message: "Implied eval can be harmful. Pass a function instead of a string.", type: "CallExpression"}] },
        { code: "setInterval('foo')", errors: [{ message: "Implied eval can be harmful. Pass a function instead of a string.", type: "CallExpression"}] },
        { code: "window.setTimeout('foo')", errors: [{ message: "Implied eval can be harmful. Pass a function instead of a string.", type: "CallExpression"}] },
        { code: "window.setInterval('foo')", errors: [{ message: "Implied eval can be harmful. Pass a function instead of a string.", type: "CallExpression"}] }
    ]
});
