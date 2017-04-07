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
        {
            code: "var x = .5;",
            output: "var x = 0.5;",
            errors: [{ message: "A leading decimal point can be confused with a dot.", type: "Literal" }]
        },
        {
            code: "var x = -.5;",
            output: "var x = -0.5;",
            errors: [{ message: "A leading decimal point can be confused with a dot.", type: "Literal" }]
        },
        {
            code: "var x = 2.;",
            output: "var x = 2.0;",
            errors: [{ message: "A trailing decimal point can be confused with a dot.", type: "Literal" }]
        },
        {
            code: "var x = -2.;",
            output: "var x = -2.0;",
            errors: [{ message: "A trailing decimal point can be confused with a dot.", type: "Literal" }]
        },
        {
            code: "typeof.2",
            output: "typeof 0.2",
            errors: [{ message: "A leading decimal point can be confused with a dot.", type: "Literal" }]
        },
        {
            code: "for(foo of.2);",
            output: "for(foo of 0.2);",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{ message: "A leading decimal point can be confused with a dot.", type: "Literal" }]
        }
    ]
});
