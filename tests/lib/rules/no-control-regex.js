/**
 * @fileoverview Tests for no-control-regex rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    validate = require("../../../lib/validate-options"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint, validate);
eslintTester.addRuleTest("lib/rules/no-control-regex", {
    valid: [
        "var regex = /x1f/",
        "var regex = new RegExp('x1f')",
        "var regex = RegExp('x1f')",
        "new RegExp('[')",
        "RegExp('[')",
        "new (function foo(){})('\\x1f')"
    ],
    invalid: [
        { code: "var regex = /\\\x1f/", errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] },
        { code: "var regex = new RegExp('\\x1f')", errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] },
        { code: "var regex = RegExp('\\x1f')", errors: [{ message: "Unexpected control character in regular expression.", type: "Literal"}] }
    ]
});
