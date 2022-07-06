/**
 * @fileoverview Disallow sparse arrays
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-sparse-arrays"),
    { RuleTester } = require("../../../lib/rule-tester");

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
                messageId: "unexpectedSparseArray",
                type: "ArrayExpression"
            }]
        },
        {
            code: "var a = [ 1,, 2];",
            errors: [{
                messageId: "unexpectedSparseArray",
                type: "ArrayExpression"
            }]
        }
    ]
});
