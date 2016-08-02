/**
 * @fileoverview Tests for no-floating-decimal rule.
 * @author James Allardice
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-floating-decimal"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-floating-decimal", rule, {
    valid: [
        "var x = 2.5;",
        "var x = \"2.5\";"
    ],
    invalid: [
        { code: "var x = .5;", errors: [{ message: "A leading decimal point can be confused with a dot.", type: "Literal"}] },
        { code: "var x = -.5;", errors: [{ message: "A leading decimal point can be confused with a dot.", type: "Literal"}] },
        { code: "var x = 2.;", errors: [{ message: "A trailing decimal point can be confused with a dot.", type: "Literal"}] }
    ]
});
