/**
 * @fileoverview Tests for no-debugger rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("lib/rules/no-debugger", {
    valid: [
        "var test = { debugger: 1 }; test.debugger;"
    ],
    invalid: [
        { code: "debugger", errors: [{ message: "Unexpected 'debugger' statement.", type: "DebuggerStatement"}] }
    ]
});
