/**
 * @fileoverview Disallow sparse arrays
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-sparse-arrays"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-sparse-arrays", rule, {

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
