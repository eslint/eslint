/**
 * @fileoverview Tests for no-tabs rule
 * @author Gyandeep Singh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-tabs");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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
                messageId: "unexpectedTab",
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 18
            }]
        },
        {
            code: "/** \t comment test */",
            errors: [{
                messageId: "unexpectedTab",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code:
            "function test(){\n" +
            "  //\tsdfdsf \n" +
            "}",
            errors: [{
                messageId: "unexpectedTab",
                line: 2,
                column: 5,
                endLine: 2,
                endColumn: 6
            }]
        },
        {
            code:
            "function\ttest(){\n" +
            "  //sdfdsf \n" +
            "}",
            errors: [{
                messageId: "unexpectedTab",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 10
            }]
        },
        {
            code:
            "function test(){\n" +
            "  //\tsdfdsf \n" +
            "\t}",
            errors: [
                {
                    messageId: "unexpectedTab",
                    line: 2,
                    column: 5,
                    endLine: 2,
                    endColumn: 6
                },
                {
                    messageId: "unexpectedTab",
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },
        {
            code: "\t// Comment with leading tab \t and inline tab",
            options: [{ allowIndentationTabs: true }],
            errors: [{
                messageId: "unexpectedTab",
                line: 1,
                column: 30,
                endLine: 1,
                endColumn: 31
            }]
        },
        {
            code: "\t\ta =\t\t\tb +\tc\t\t;\t\t",
            errors: [
                {
                    messageId: "unexpectedTab",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 3
                },
                {
                    messageId: "unexpectedTab",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 9
                },
                {
                    messageId: "unexpectedTab",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "unexpectedTab",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 16
                },
                {
                    messageId: "unexpectedTab",
                    line: 1,
                    column: 17,
                    endLine: 1,
                    endColumn: 19
                }
            ]
        }
    ]
});
