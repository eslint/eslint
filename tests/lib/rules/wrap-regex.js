/**
 * @fileoverview Tests for wrap-regex rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


eslintTester.addRuleTest("lib/rules/wrap-regex", {
    valid: [
        "var f = function() { return (/foo/).test(bar); };",
        "var f = function() { return (/foo/ig).test(bar); };",
        "var f = function() { return /foo/; };",
        "var f = 0;"
    ],
    invalid: [
        { code: "var f = function() { return /foo/.test(bar); };",
          errors: [{ message: "Wrap the /regexp/ literal in parens to disambiguate the slash operator.", type: "Literal"}] },
        { code: "var f = function() { return /foo/ig.test(bar); };",
          errors: [{ message: "Wrap the /regexp/ literal in parens to disambiguate the slash operator.", type: "Literal"}] }

    ]
});
