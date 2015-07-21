/**
 * @fileoverview Tests for no-debugger rule.
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
eslintTester.addRuleTest("lib/rules/no-debugger", {
    valid: [
        "var test = { debugger: 1 }; test.debugger;"
    ],
    invalid: [
        { code: "debugger", errors: [{ message: "Unexpected 'debugger' statement.", type: "DebuggerStatement"}] }
    ]
});
