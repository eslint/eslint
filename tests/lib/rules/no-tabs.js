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

        {
            code: "\tdoSomething();",
            options: [{ allowIndentationTabs: true }]
        },
        {
            code: "\t// comment",
            options: [{ allowIndentationTabs: true }]
        }
    ],
    invalid: [
        {
            code: "function test(){\t}",
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 17
            }]
        },
        {
            code: "/** \t comment test */",
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 5
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
                column: 5
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
                column: 9
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
                    column: 5
                },
                {
                    message: ERROR_MESSAGE,
                    line: 3,
                    column: 1
                }
            ]
        },
        {
            code: "\t// Comment with leading tab \t and inline tab",
            options: [{ allowIndentationTabs: true }],
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 30
            }]
        }
    ]
});
