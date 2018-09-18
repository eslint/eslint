/**
 * @fileoverview Tests for no-hardcoded-values regex.
 * @author Grigory Gorshkov
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-hardcoded-values"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-hardcoded-values", rule, {
    valid: [
        {
            code: "var a = 5;",
            options: [{}]
        }
    ],
    invalid: [
        {
            code: "var a = 5;",
            options: [{}]
        }
    ]
});
