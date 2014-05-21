/**
 * @fileoverview Tests for no-redeclare rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-redeclare", {
    valid: [
        "var a = 3; var b = function() { var a = 10; };",
        "var a = 3; a = 10;"
    ],
    invalid: [
        { code: "var a = 3; var a = 10;", errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "var a = {}; var a = [];", errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "var a = function() { }; var a = function() { }", errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "var a = function() { }; var a = new Date();", errors: [{ message: "a is already defined", type: "Identifier"}] },
        { code: "var a = 3; var a = 10; var a = 15;", errors: [{ message: "a is already defined", type: "Identifier"}, { message: "a is already defined", type: "Identifier"}] }
    ]
});
