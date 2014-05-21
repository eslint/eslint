/**
 * @fileoverview Tests for no-with rule.
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
eslintTester.addRuleTest("lib/rules/no-with", {
    valid: [
        "foo.bar()"
    ],
    invalid: [
        { code: "with(foo) { bar() }", errors: [{ message: "Unexpected use of 'with' statement.", type: "WithStatement"}] }
    ]
});
