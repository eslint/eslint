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
        "var str = 'test\\tstring'"
    ],
    invalid: [

        // Tabs in string/template/regex literals should be fixed by inserting `\t` escape sequence,
        // not by replacing the tab with a space
        {
            code: "const str = 'test\tstring'",
            output: "const str = 'test\\tstring'",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 19
            }]
        },
        {
            code: "const str = `test\tstring`",
            output: "const str = `test\\tstring`",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 19
            }]
        },
        {
            code: "const str = /test\tstring/",
            output: "const str = /test\\tstring/",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 19
            }]
        },

        // These errors should be auto-fixed by replacing the tabs with a space
        {
            code: "function test(){\t}",
            output: "function test(){    }",
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 18
            }]
        },
        {
            code: "/** \t comment test */",
            output: "/**      comment test */",
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
            output:
            "function test(){\n" +
            "  //    sdfdsf \n" +
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
            output:
            "function    test(){\n" +
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
            output:
            "function test(){\n" +
            "  //    sdfdsf \n" +
            "    }",
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
        },
        {
            code: "function\ttest()\t{}",
            output: "function    test()    {}",
            errors: [
                {
                    message: ERROR_MESSAGE,
                    line: 1,
                    column: 10
                },
                {
                    message: ERROR_MESSAGE,
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code:
            "function\ttest(\t)\n" +
            "{\t\n}",
            output:
            "function    test(    )\n" +
            "{    \n}",
            errors: [
                {
                    message: ERROR_MESSAGE,
                    line: 1,
                    column: 10
                },
                {
                    message: ERROR_MESSAGE,
                    line: 1,
                    column: 16
                },
                {
                    message: ERROR_MESSAGE,
                    line: 2,
                    column: 3
                }
            ]
        }
    ]
});
