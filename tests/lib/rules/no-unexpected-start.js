/**
 * @fileoverview disallow statement continuation characters at the start of statements
 * @author Fraction
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unexpected-start"),

    RuleTester = require("../../../lib/rule-tester/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-unexpected-start", rule, {

    valid: [
        "var numbers = [1, 2, 3]; numbers.reverse()",
        "{ console.log(42) }",
        ";;;;console.log(42)"
    ],

    invalid: [
        {
            code: "[1, 2, 3].reverse()",
            errors: [{
                message: "Unexpected start of statement."
            }]
        },
        {
            code: "(function () { console.log(42) })()",
            errors: [{
                message: "Unexpected start of statement."
            }]
        },
        {
            code: ";(function () {})()",
            errors: [{
                message: "Unexpected start of statement."
            }]
        },
        {
            code: "`hello`.indexOf('o')",
            parserOptions: {
                ecmaVersion: 8
            },
            errors: [{
                message: "Unexpected start of statement."
            }]
        },
        {
            code: "+42",
            errors: [{
                message: "Unexpected start of statement."
            }]
        },
        {
            code: "-42",
            errors: [{
                message: "Unexpected start of statement."
            }]
        },
        {
            code: "/foo/",
            errors: [{
                message: "Unexpected start of statement."
            }]
        }
    ]
});
