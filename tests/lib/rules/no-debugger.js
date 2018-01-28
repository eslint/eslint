/**
 * @fileoverview Tests for no-debugger rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-debugger"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-debugger", rule, {
    valid: [
        "var test = { debugger: 1 }; test.debugger;"
    ],
    invalid: [
        {
            code: "debugger",
            output: "",
            errors: [{ message: "Unexpected 'debugger' statement.", type: "DebuggerStatement" }]
        },
        {
            code: "if (foo) debugger",
            output: null,
            errors: [{ message: "Unexpected 'debugger' statement.", type: "DebuggerStatement" }]
        }
    ]
});
