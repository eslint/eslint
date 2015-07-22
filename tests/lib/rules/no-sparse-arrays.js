/**
 * @fileoverview Disallow sparse arrays
 * @author Nicholas C. Zakas
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
eslintTester.addRuleTest("lib/rules/no-sparse-arrays", {

    valid: [
        "var a = [ 1, 2, ]"
    ],

    invalid: [
        {
            code: "var a = [,];",
            errors: [{
                message: "Unexpected comma in middle of array.",
                type: "ArrayExpression"
            }]
        },
        {
            code: "var a = [ 1,, 2];",
            errors: [{
                message: "Unexpected comma in middle of array.",
                type: "ArrayExpression"
            }]
        }
    ]
});
