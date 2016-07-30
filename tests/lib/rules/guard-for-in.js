/**
 * @fileoverview Tests for guard-for-in rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/guard-for-in"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("guard-for-in", rule, {
    valid: [
        "for (var x in o) {}",
        "for (var x in o) { if (x) {}}"
    ],
    invalid: [
        { code: "for (var x in o) { foo() }", errors: [{ message: "The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype.", type: "ForInStatement"}] },
        { code: "for (var x in o) foo();", errors: [{ message: "The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype.", type: "ForInStatement"}] }
    ]
});
