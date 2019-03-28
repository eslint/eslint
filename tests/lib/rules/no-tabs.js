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
        },
        {
            code:
            "function test(){\n" +
            "//\tignore everything after a comment \n" +
            "}",
            options: [{ ignoreTabsOnComments: true }]
        },
        {
            code:
            "function test(){\n" +
            "  //\tindent comment with tabs \n" +
            "}",
            options: [{ ignoreTabsOnComments: true }]
        },
        {
            code:
            "function test(){\n" +
            " /// \t multiple slashes \n" +
            "}",
            options: [{ ignoreTabsOnComments: true }]
        },
        {
            code:
            "function test(){\n" +
            " \t/// \t multiple slashes and tabs \n" +
            "}",
            options: [{ ignoreTabsOnComments: true, allowIndentationTabs: true }]
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
            code:
            "\t //\t preceed comment with tabs \n",
            errors: [{
                message: ERROR_MESSAGE,
                line: 1,
                column: 1
            },
            {
                message: ERROR_MESSAGE,
                line: 1,
                column: 5
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
