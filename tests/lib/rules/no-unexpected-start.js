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

const prefix = "Unexpected continuation character at start of statement: ";

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
                message: `${prefix}[`
            }]
        },
        {
            code: "(function () { console.log(42) })()",
            errors: [{
                message: `${prefix}(`
            }]
        },
        {
            code: ";(function () {})()",
            errors: [{
                message: `${prefix}(`
            }]
        },
        {
            code: "`hello`.indexOf('o')",
            parserOptions: {
                ecmaVersion: 8
            },
            errors: [{
                message: `${prefix}\``
            }]
        },
        {
            code: "+42",
            errors: [{
                message: `${prefix}+`
            }]
        },
        {
            code: "-42",
            errors: [{
                message: `${prefix}-`
            }]
        },
        {
            code: "/foo/",
            errors: [{
                message: `${prefix}/`
            }]
        }
    ]
});
