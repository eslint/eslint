/**
 * @fileoverview Tests for no-floating-decimal rule.
 * @author James Allardice
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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
