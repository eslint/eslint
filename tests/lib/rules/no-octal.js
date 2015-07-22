/**
 * @fileoverview Tests for no-octal rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-octal", {
    valid: [
        "var a = 'hello world';",
        "0x1234",
        "0X5;",
        "a = 0;",
        "0.1",
        "0.5e1"
    ],
    invalid: [
        { code: "var a = 01234;", errors: [{ message: "Octal literals should not be used.", type: "Literal"}] },
        { code: "a = 1 + 01234;", errors: [{ message: "Octal literals should not be used.", type: "Literal"}] },
        { code: "00", errors: [{ message: "Octal literals should not be used.", type: "Literal"}] }
    ]
});
