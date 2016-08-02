/**
 * @fileoverview Tests for no-caller rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-caller"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-caller", rule, {
    valid: [
        "var x = arguments.length",
        "var x = arguments",
        "var x = arguments[0]",
        "var x = arguments[caller]"
    ],
    invalid: [
        { code: "var x = arguments.callee", errors: [{ message: "Avoid arguments.callee.", type: "MemberExpression"}] },
        { code: "var x = arguments.caller", errors: [{ message: "Avoid arguments.caller.", type: "MemberExpression"}] }
    ]
});
