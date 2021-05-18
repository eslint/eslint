/**
 * @fileoverview Tests for no-with rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-with"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-with", rule, {
    valid: [
        "foo.bar()"
    ],
    invalid: [
        { code: "with(foo) { bar() }", errors: [{ message: "Unexpected use of 'with' statement.", type: "WithStatement" }] }
    ]
});
