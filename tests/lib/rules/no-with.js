/**
 * @fileoverview Tests for no-with rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-with", {
    valid: [
        "foo.bar()"
    ],
    invalid: [
        { code: "with(foo) { bar() }", errors: [{ message: "Unexpected use of 'with' statement.", type: "WithStatement"}] }
    ]
});
