/**
 * @fileoverview Disallow sparse arrays
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/no-sparse-arrays"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester();

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
