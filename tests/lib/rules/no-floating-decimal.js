/**
 * @fileoverview Tests for no-floating-decimal rule.
 * @author James Allardice
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
eslintTester.addRuleTest("lib/rules/no-floating-decimal", {
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
