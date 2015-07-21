/**
 * @fileoverview Tests for wrap-regex rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/wrap-regex", {
    valid: [
        "(/foo/).test(bar);",
        "(/foo/ig).test(bar);",
        "/foo/;",
        "var f = 0;",
        "a[/b/];"
    ],
    invalid: [
        { code: "/foo/.test(bar);",
          errors: [{ message: "Wrap the regexp literal in parens to disambiguate the slash.", type: "Literal"}] },
        { code: "/foo/ig.test(bar);",
          errors: [{ message: "Wrap the regexp literal in parens to disambiguate the slash.", type: "Literal"}] }

    ]
});
