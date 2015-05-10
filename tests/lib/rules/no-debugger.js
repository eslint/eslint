/**
 * @fileoverview Tests for no-debugger rule.
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
eslintTester.addRuleTest("lib/rules/no-debugger", {
    valid: [
        "var test = { debugger: 1 }; test.debugger;"
    ],
    invalid: [
        { code: "debugger", errors: [{ message: "Unexpected 'debugger' statement.", type: "DebuggerStatement"}] }
    ]
});
