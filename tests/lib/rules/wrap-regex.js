/**
 * @fileoverview Tests for wrap-regex rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


eslintTester.addRuleTest("wrap-regex", {
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
