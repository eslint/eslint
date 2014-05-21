/**
 * @fileoverview Tests for no-implied-eval rule.
 * @author James Allardice
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
eslintTester.addRuleTest("lib/rules/no-implied-eval", {
    valid: [
        "setInterval(function () { x = 1; }, 100);"
    ],
    invalid: [
        { code: "setTimeout(\"x = 1;\");", errors: [{ message: "Implied eval. Consider passing a function instead of a string.", type: "CallExpression"}] },
        { code: "setTimeout(\"x = 1;\", 100);", errors: [{ message: "Implied eval. Consider passing a function instead of a string.", type: "CallExpression"}] },
        { code: "setInterval(\"x = 1;\");", errors: [{ message: "Implied eval. Consider passing a function instead of a string.", type: "CallExpression"}] }
    ]
});
