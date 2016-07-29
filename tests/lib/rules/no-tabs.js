/**
 * @fileoverview Tests for no-tabs rule
 * @author Gyandeep Singh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-tabs");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const ERROR_MESSAGE = "Unexpected tab character.";

ruleTester.run("no-tabs", rule, {
    valid: [
        "function test(){\n}",
        "function test(){\n" +
        "  //   sdfdsf \n" +
        "}",
    ],
    invalid: [
        {
            code: "function test(){\t}",
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 18
            }]
        },
        {
            code: "/** \t comment test */",
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 6
            }]
        },
        {
            code:
            "function test(){\n" +
            "  //\tsdfdsf \n" +
            "}",
            errors: [{
                message: ERROR_MESSAGE,
                line: 2,
                column: 6
            }]
        },
        {
            code:
            "function\ttest(){\n" +
            "  //sdfdsf \n" +
            "}",
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 10
            }]
        },
        {
            code:
            "function test(){\n" +
            "  //\tsdfdsf \n" +
            "\t}",
            errors: [
                {
                    message: ERROR_MESSAGE,
                    line: 2,
                    column: 6
                },
                {
                    message: ERROR_MESSAGE,
                    line: 3,
                    column: 2
                }
            ]
        }
    ]
});
