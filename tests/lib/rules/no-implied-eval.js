/**
 * @fileoverview Tests for no-implied-eval rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint),
    expectedErrorMessage = "Implied eval. Consider passing a function instead of a string.",
    expectedError = { message: expectedErrorMessage, type: "CallExpression" };

eslintTester.addRuleTest("lib/rules/no-implied-eval", {
    valid: [
        "setInterval(function() { x = 1; }, 100);",
        "foo.setTimeout('hi')",
        "setTimeout(foo, 10)",
        "setTimeout(function() {}, 10)",
        "foo.setInterval('hi')",
        "setInterval(foo, 10)",
        "setInterval(function() {}, 10)"
    ],

    invalid: [
        { code: "setTimeout(\"x = 1;\");", errors: [expectedError] },
        { code: "setTimeout(\"x = 1;\", 100);", errors: [expectedError] },
        { code: "setInterval(\"x = 1;\");", errors: [expectedError] },
        { code: "execScript(\"x = 1;\");", errors: [expectedError] },
        { code: "window.setTimeout('foo')", errors: [expectedError] },
        { code: "window.setInterval('foo')", errors: [expectedError] },
        { code: "window['setTimeout']('foo')", errors: [expectedError] },
        { code: "window['setInterval']('foo')", errors: [expectedError] }
    ]
});
