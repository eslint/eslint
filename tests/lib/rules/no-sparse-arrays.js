/**
 * @fileoverview Disallow sparse arrays
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

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
