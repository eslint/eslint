/**
 * @fileoverview Tests for no-obj-calls rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-obj-calls"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-obj-calls", rule, {
    valid: [
        "var x = Math.random();"
    ],
    invalid: [
        { code: "var x = Math();", errors: [{ message: "'Math' is not a function.", type: "CallExpression" }] },
        { code: "var x = JSON();", errors: [{ message: "'JSON' is not a function.", type: "CallExpression" }] },
        { code: "var x = Reflect();", errors: [{ message: "'Reflect' is not a function.", type: "CallExpression" }] }
    ]
});
